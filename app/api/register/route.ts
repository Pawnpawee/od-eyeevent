import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, email, phone, store, preferred_date } = body

  if (!name || !email || !phone || !store || !preferred_date) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
  }

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: 'Invalid email format.' }, { status: 400 })
  }

  await sql`
    INSERT INTO registrations (name, email, phone, store, preferred_date)
    VALUES (${name}, ${email}, ${phone}, ${store}, ${preferred_date})
  `

  return NextResponse.json({ success: true })
}
