# SF Cafe Passport

`lockin.cafe` is a Next.js app for discovering work-friendly cafes in San Francisco (Mission + SoMa), with:
- a cafe map and filterable list
- cafe detail pages with cached Reddit mentions
- a passport/check-in flow with points, stamps, and rewards

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Bright Data Usage (Reddit Scrapper - can be expanded cross social media platforms)

Bright Data is used for a single Reddit scrape (to store and save - we will run this one a timer on a daily or weekly basis), then results are cached locally so you can avoid repeat credit usage.

1. Add env vars in `.env.local`:
   - `BRIGHT_DATA_API_KEY`
   - `BRIGHT_DATA_REDDIT_DATASET_ID` (defaults to `gd_lvz8ah06191smkebj4`)
2. Preview inputs without spending credits:
   - `npm run scrape:reddit`
3. Run one paid scrape:
   - `npm run scrape:reddit:run`
4. Process cached CSV into app data:
   - `npm run process:scrape`

Outputs:
- raw scrape CSV: `data/reviews-raw.csv`
- raw snapshot JSON backup: `data/snapshots/<snapshot_id>.json`
- processed cafes data: `data/cafes.json`
- scrape status/log: `data/scrape-log.json`
