import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { stringify } from 'csv-stringify/sync'
import dotenv from 'dotenv'
import cafes from '../data/cafes.json'
import type { Cafe } from '../src/types'

dotenv.config({ path: '.env.local' })

const DATASET_ID = process.env.BRIGHT_DATA_REDDIT_DATASET_ID ?? 'gd_lvz8ah06191smkebj4'
const API_KEY = process.env.BRIGHT_DATA_API_KEY
const ROOT = process.cwd()
const RAW_CSV = path.join(ROOT, 'data/reviews-raw.csv')
const LOG_PATH = path.join(ROOT, 'data/scrape-log.json')
const SNAPSHOT_DIR = path.join(ROOT, 'data/snapshots')
const args = new Set(process.argv.slice(2))

type BrightDataRecord = Record<string, unknown>

interface ScrapeLog {
  lastRunAt: string | null
  provider: 'brightdata'
  datasetId: string
  snapshotId: string | null
  records: number
  status: 'not-run' | 'triggered' | 'ready' | 'failed'
}

function buildInputs() {
  return (cafes as Cafe[]).map((cafe) => {
    const q = `"${cafe.name}" "San Francisco" (wifi OR outlet OR laptop OR quiet OR work)`
    return {
      url: `https://www.reddit.com/search/?q=${encodeURIComponent(q)}&sort=relevance`,
      keyword: cafe.name,
      cafeId: cafe.id,
      cafeName: cafe.name,
    }
  })
}

function readLog(): ScrapeLog {
  if (!existsSync(LOG_PATH)) {
    return {
      lastRunAt: null,
      provider: 'brightdata',
      datasetId: DATASET_ID,
      snapshotId: null,
      records: 0,
      status: 'not-run',
    }
  }
  return JSON.parse(readFileSync(LOG_PATH, 'utf8')) as ScrapeLog
}

function writeLog(log: ScrapeLog) {
  writeFileSync(LOG_PATH, `${JSON.stringify(log, null, 2)}\n`)
}

function requireRunMode() {
  if (args.has('--run')) return

  console.log('Dry run only. Planned Bright Data Reddit inputs:')
  console.log(JSON.stringify(buildInputs(), null, 2))
  console.log('\nRun the paid scrape once with: npm run scrape:reddit:run')
  process.exit(0)
}

function guardAgainstAccidentalRerun(log: ScrapeLog) {
  const hasCsvData = existsSync(RAW_CSV) && readFileSync(RAW_CSV, 'utf8').trim().split('\n').length > 1
  if (!args.has('--force') && (log.status === 'ready' || hasCsvData)) {
    throw new Error(
      'reviews-raw.csv already has scraped data. Re-run only if you mean it: npm run scrape:reddit:run -- --force',
    )
  }
}

async function brightData<T>(url: string, init?: RequestInit): Promise<T> {
  if (!API_KEY) throw new Error('Missing BRIGHT_DATA_API_KEY in .env.local')

  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Bright Data ${response.status}: ${body}`)
  }

  return response.json() as Promise<T>
}

async function triggerSnapshot(): Promise<string> {
  const endpoint = new URL('https://api.brightdata.com/datasets/v3/trigger')
  endpoint.searchParams.set('dataset_id', DATASET_ID)
  endpoint.searchParams.set('include_errors', 'true')

  const result = await brightData<{ snapshot_id: string }>(endpoint.toString(), {
    method: 'POST',
    body: JSON.stringify(buildInputs()),
  })

  return result.snapshot_id
}

async function waitForSnapshot(snapshotId: string) {
  const endpoint = `https://api.brightdata.com/datasets/v3/progress/${snapshotId}`
  const startedAt = Date.now()

  while (Date.now() - startedAt < 15 * 60 * 1000) {
    const progress = await brightData<{ status: string }>(endpoint)
    console.log(`Snapshot ${snapshotId}: ${progress.status}`)

    if (progress.status === 'ready') return
    if (progress.status === 'failed') throw new Error(`Bright Data snapshot failed: ${snapshotId}`)

    await new Promise((resolve) => setTimeout(resolve, 10_000))
  }

  throw new Error(`Timed out waiting for Bright Data snapshot ${snapshotId}`)
}

async function downloadSnapshot(snapshotId: string): Promise<BrightDataRecord[]> {
  const endpoint = new URL(`https://api.brightdata.com/datasets/v3/snapshot/${snapshotId}`)
  endpoint.searchParams.set('format', 'json')
  return brightData<BrightDataRecord[]>(endpoint.toString())
}

function textField(record: BrightDataRecord, fields: string[]): string {
  for (const field of fields) {
    const value = record[field]
    if (typeof value === 'string' && value.trim()) return value.trim()
    if (typeof value === 'number') return String(value)
  }
  return ''
}

function findCafe(record: BrightDataRecord): Cafe | undefined {
  const hint = textField(record, ['cafeId', 'cafe_id', 'keyword', 'query', 'input', 'url']).toLowerCase()
  return (cafes as Cafe[]).find((cafe) => hint.includes(cafe.id) || hint.includes(cafe.name.toLowerCase()))
}

function normalizeRecords(records: BrightDataRecord[]) {
  return records.map((record) => {
    const cafe = findCafe(record)
    const snippet = textField(record, ['body', 'text', 'selftext', 'comment', 'description', 'content', 'title'])

    return {
      cafeId: cafe?.id ?? textField(record, ['cafeId', 'cafe_id']),
      cafeName: cafe?.name ?? textField(record, ['cafeName', 'keyword', 'query']),
      source: 'reddit',
      subreddit: textField(record, ['subreddit', 'community_name', 'community']),
      postTitle: textField(record, ['title', 'post_title']),
      snippet: snippet.slice(0, 320),
      score: textField(record, ['score', 'upvotes', 'num_upvotes']),
      url: textField(record, ['url', 'post_url', 'link']),
      createdAt: textField(record, ['created_at', 'date', 'timestamp']),
    }
  })
}

async function main() {
  requireRunMode()

  const log = readLog()
  guardAgainstAccidentalRerun(log)

  mkdirSync(SNAPSHOT_DIR, { recursive: true })
  const snapshotId = await triggerSnapshot()
  writeLog({ ...log, lastRunAt: new Date().toISOString(), datasetId: DATASET_ID, snapshotId, status: 'triggered' })

  await waitForSnapshot(snapshotId)
  const records = await downloadSnapshot(snapshotId)
  writeFileSync(path.join(SNAPSHOT_DIR, `${snapshotId}.json`), `${JSON.stringify(records, null, 2)}\n`)

  const rows = normalizeRecords(records)
  writeFileSync(RAW_CSV, stringify(rows, { header: true }))
  writeLog({
    lastRunAt: new Date().toISOString(),
    provider: 'brightdata',
    datasetId: DATASET_ID,
    snapshotId,
    records: rows.length,
    status: 'ready',
  })

  console.log(`Saved ${rows.length} Reddit rows to data/reviews-raw.csv`)
}

main().catch((error) => {
  const log = readLog()
  writeLog({ ...log, status: 'failed' })
  console.error(error)
  process.exit(1)
})

