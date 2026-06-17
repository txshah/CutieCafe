import { NextResponse } from 'next/server'
import { getCafeById } from '@/lib/cafes'

export async function POST(request: Request) {
  const body = (await request.json()) as { cafeId?: string }
  if (!body.cafeId) return NextResponse.json({ error: 'Missing cafeId' }, { status: 400 })

  const cafe = getCafeById(body.cafeId)
  if (!cafe) return NextResponse.json({ error: 'Cafe not found' }, { status: 404 })

  return NextResponse.json({ pointsEarned: 20, cafe })
}

