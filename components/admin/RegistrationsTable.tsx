'use client'

import { useState, useMemo } from 'react'
import { FunnelIcon } from '@heroicons/react/24/outline'
import ExportButton from './ExportButton'

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

interface RegistrationsTableProps {
  registrations: Registration[]
}

const thClass = 'text-xs font-medium text-[#666666] uppercase tracking-[0.12em] px-4 py-3 text-left whitespace-nowrap'
const tdClass = 'text-sm text-black px-4 py-3 whitespace-nowrap'

function formatDate(val: unknown) {
  if (!val) return '—'
  const str = val instanceof Date ? val.toISOString() : String(val)
  const [y, m, d] = str.split('T')[0].split('-')
  return `${d}/${m}/${y}`
}

const filterControlClass =
  'border border-[#e0e0e0] text-black text-sm px-3 py-2 bg-white cursor-pointer ' +
  'hover:border-[#999999] focus:border-black focus:ring-1 focus:ring-black focus:outline-none'

export default function RegistrationsTable({ registrations }: RegistrationsTableProps) {
  const [filterBranch, setFilterBranch] = useState('')
  const [filterDate, setFilterDate] = useState('')

  const branches = useMemo(
    () => [...new Set(registrations.map(r => r.branch))].sort(),
    [registrations]
  )

  const filtered = useMemo(() => {
    return registrations.filter(r => {
      if (filterBranch && r.branch !== filterBranch) return false
      if (filterDate) {
        const dateStr = r.preferred_date instanceof Date
          ? r.preferred_date.toISOString().split('T')[0]
          : String(r.preferred_date).split('T')[0]
        if (dateStr !== filterDate) return false
      }
      return true
    })
  }, [registrations, filterBranch, filterDate])

  return (
    <div className="bg-white border border-[#e0e0e0]">

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 p-4 border-b border-[#e0e0e0]">
        <FunnelIcon className="w-4 h-4 text-[#666666]" />
        <select
          className={filterControlClass}
          value={filterBranch}
          onChange={e => setFilterBranch(e.target.value)}
        >
          <option value="">All Stores</option>
          {branches.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <input
          type="date"
          className={filterControlClass + ' cursor-pointer'}
          value={filterDate}
          onChange={e => setFilterDate(e.target.value)}
        />
        {(filterBranch || filterDate) && (
          <button
            onClick={() => { setFilterBranch(''); setFilterDate('') }}
            className="text-xs text-[#666666] hover:text-black underline underline-offset-2 cursor-pointer transition-colors"
          >
            Clear
          </button>
        )}
        <div className="ml-auto">
          <ExportButton data={filtered} />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#f5f5f5] border-b border-[#e0e0e0]">
            <tr>
              <th className={thClass}>#</th>
              <th className={thClass}>ชื่อ-นามสกุล</th>
              <th className={thClass}>อีเมล</th>
              <th className={thClass}>เบอร์โทรศัพท์</th>
              <th className={thClass}>จังหวัด</th>
              <th className={thClass}>สาขา</th>
              <th className={thClass}>วันที่สะดวก</th>
              <th className={thClass}>ลงทะเบียนเมื่อ</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center text-sm text-[#666666] py-12">
                  ไม่พบข้อมูล
                </td>
              </tr>
            ) : (
              filtered.map((r, i) => (
                <tr
                  key={r.id}
                  className="border-b border-[#e0e0e0] hover:bg-[#f5f5f5] transition-colors"
                >
                  <td className={tdClass + ' text-[#666666]'}>{i + 1}</td>
                  <td className={tdClass + ' font-medium'}>{r.name}</td>
                  <td className={tdClass}>{r.email}</td>
                  <td className={tdClass}>{r.phone}</td>
                  <td className={tdClass}>{r.province}</td>
                  <td className={tdClass}>{r.branch}</td>
                  <td className={tdClass}>{formatDate(r.preferred_date)}</td>
                  <td className={tdClass + ' text-[#666666]'}>
                    {new Date(r.created_at).toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 border-t border-[#e0e0e0] text-xs text-[#666666]">
        แสดง {filtered.length} จาก {registrations.length} รายการ
      </div>
    </div>
  )
}
