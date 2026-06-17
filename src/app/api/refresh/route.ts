import { NextResponse } from 'next/server'

export function POST(request: Request) {
  const token = request.headers.get('x-refresh-token')
  if (!process.env.REFRESH_TOKEN || token !== process.env.REFRESH_TOKEN) {
    return NextResponse.json({ error: 'Refresh is protected.' }, { status: 401 })
  }

  return NextResponse.json({
    message: 'Run npm run scrape:reddit:run manually, then npm run process:scrape. This endpoint is intentionally non-spending.',
  })
}
