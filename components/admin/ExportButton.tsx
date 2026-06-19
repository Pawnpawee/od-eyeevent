'use client'

import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'

interface Registration {
  name: string
  email: string
  phone: string
  province: string
  branch: string
  preferred_date: string | Date
  created_at: string | Date
}

interface ExportButtonProps {
  data: Registration[]
}

export default function ExportButton({ data }: ExportButtonProps) {
  async function handleExport() {
    const XLSX = await import('xlsx')
    const rows = data.map(r => ({
      'ชื่อ-นามสกุล': r.name,
      'อีเมล': r.email,
      'เบอร์โทรศัพท์': r.phone,
      'จังหวัด': r.province,
      'สาขา': r.branch,
      'วันที่สะดวก': r.preferred_date,
      'วันที่ลงทะเบียน': new Date(r.created_at).toLocaleString('th-TH'),
    }))
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Registrations')
    const date = new Date().toISOString().split('T')[0]
    XLSX.writeFile(wb, `owndays-registrations-${date}.xlsx`)
  }

  return (
    <button
      onClick={handleExport}
      disabled={data.length === 0}
      className="flex items-center gap-2 bg-char text-cream px-4 py-2 text-xs tracking-widest uppercase
        hover:bg-ink disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors rounded-[4px]"
    >
      <ArrowDownTrayIcon className="w-4 h-4" />
      Export .xlsx ({data.length})
    </button>
  )
}
