import { NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

export async function GET() {
  const count = (await kv.get<number>('pageviews')) ?? 0
  return NextResponse.json({ count })
}

export async function POST() {
  const count = await kv.incr('pageviews')
  return NextResponse.json({ count })
}
