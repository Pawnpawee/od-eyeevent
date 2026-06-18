import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  const { rows } = await sql`
    SELECT id, branch, province, display, region
    FROM stores
    ORDER BY region ASC, display ASC
  `
  return NextResponse.json(rows)
}
