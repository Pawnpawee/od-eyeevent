import { sql } from '@/lib/db'
import { kv } from '@vercel/kv'
import Image from 'next/image'
import Link from 'next/link'
import AdminAuthGate from '@/components/admin/AdminAuthGate'
import StatsCards from '@/components/admin/StatsCards'
import StoreChart from '@/components/admin/StoreChart'
import RegistrationsTable from '@/components/admin/RegistrationsTable'
interface Registration {
  id: number
  name: string
  email: string
  phone: string
  province: string
  branch: string
  preferred_date: string | Date
  created_at: string | Date
}

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const [{ rows: registrations }, pageViewsRaw, { rows: topStore }] = await Promise.all([
    sql`SELECT * FROM registrations ORDER BY created_at DESC`,
    kv.get<number>('pageviews'),
    sql`SELECT branch, COUNT(*) AS count FROM registrations GROUP BY branch ORDER BY count DESC LIMIT 1`,
  ])

  const pageViews = pageViewsRaw ?? 0
  const mostPopularStore = (topStore[0]?.branch as string) ?? '—'

  return (
    <AdminAuthGate>
    <div className="min-h-screen bg-sand">

      {/* Header */}
      <header className="bg-white border-b border-stone px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="cursor-pointer">
            <Image
              src="/owndays.svg"
              alt="OWNDAYS"
              width={100}
              height={25}
              unoptimized
              style={{ height: '22px', width: 'auto' }}
              className="hover:opacity-70 transition-opacity"
            />
          </Link>
          <span className="text-stone select-none">|</span>
          <h1 className="text-sm font-medium text-ink uppercase tracking-[0.15em]">Dashboard</h1>
        </div>
        <span className="text-xs text-drift uppercase tracking-[0.15em]">Internal</span>
      </header>

      {/* Main */}
      <main className="px-6 py-8 max-w-7xl mx-auto flex flex-col gap-8">

        <StatsCards
          totalRegistrations={registrations.length}
          pageViews={Number(pageViews)}
          mostPopularStore={mostPopularStore}
        />

        <StoreChart registrations={registrations as Registration[]} />

        <div>
          <p className="text-xs font-medium text-drift uppercase tracking-[0.15em] mb-4">
            All Registrations
          </p>
          <RegistrationsTable registrations={registrations as Registration[]} />
        </div>

      </main>
    </div>
    </AdminAuthGate>
  )
}
