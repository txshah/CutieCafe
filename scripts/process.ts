import { readFileSync, writeFileSync } from 'node:fs'
import { parse } from 'csv-parse/sync'
import cafes from '../data/cafes.json'
import { extractSignals } from '../src/lib/nlp'
import type { Cafe, RedditMention } from '../src/types'

interface RawReview {
  cafeId: string
  cafeName: string
  source: string
  subreddit: string
  postTitle: string
  snippet: string
  score: string
  url: string
  createdAt: string
}

const raw = readFileSync('data/reviews-raw.csv', 'utf8')
const reviews = parse(raw, { columns: true, skip_empty_lines: true }) as RawReview[]

const next = (cafes as Cafe[]).map((cafe) => {
  const matches = reviews.filter((review) => review.cafeId === cafe.id)
  if (matches.length === 0) return cafe

  const combined = matches.map((review) => `${review.postTitle} ${review.snippet}`).join('\n')
  const scores = extractSignals(combined)
  const reddit: RedditMention[] = matches.slice(0, 6).map((review) => ({
    subreddit: review.subreddit || 'reddit',
    postTitle: review.postTitle || `${cafe.name} mention`,
    snippet: review.snippet,
    score: Number.parseInt(review.score, 10) || 0,
    url: review.url,
  }))

  return {
    ...cafe,
    scores,
    tags: Array.from(new Set([...cafe.tags, ...deriveTags(combined)])).slice(0, 6),
    sources: { ...cafe.sources, reddit },
    lastUpdated: new Date().toISOString(),
  }
})

writeFileSync('data/cafes.json', `${JSON.stringify(next, null, 2)}\n`)
console.log(`Processed ${reviews.length} scraped rows into data/cafes.json`)

function deriveTags(text: string): string[] {
  const lower = text.toLowerCase()
  return [
    lower.includes('wifi') || lower.includes('wi-fi') ? 'wifi mentions' : '',
    lower.includes('outlet') || lower.includes('plug') ? 'outlet mentions' : '',
    lower.includes('quiet') ? 'quiet mentions' : '',
    lower.includes('laptop') || lower.includes('work') ? 'work friendly' : '',
  ].filter(Boolean)
}
