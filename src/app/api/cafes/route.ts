import { NextResponse } from 'next/server'
import { getCafes } from '@/lib/cafes'

export function GET() {
  return NextResponse.json(getCafes())
}

