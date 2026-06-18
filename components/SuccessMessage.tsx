'use client'

import { useEffect, useRef } from 'react'

interface SuccessMessageProps {
  branch: string
  preferredDate: string
  onClose: () => void
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
  return `${day} ${months[month - 1]} ${year + 543}`
}

export default function SuccessMessage({ branch, preferredDate, onClose }: SuccessMessageProps) {
  const okRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    okRef.current?.focus()
  }, [])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      aria-hidden="false"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="success-title"
        className="bg-white border border-black w-full max-w-sm mx-4 p-8 relative rounded-none"
      >
        <button
          onClick={onClose}
          aria-label="ปิด"
          className="absolute top-4 right-4 text-black hover:text-[#333333] leading-none"
        >
          ×
        </button>

        <div className="flex flex-col items-center gap-4">
          <p className="text-4xl font-light text-black">✓</p>

          <h2 id="success-title" className="text-xl font-medium text-black text-center">
            ลงทะเบียนสำเร็จแล้ว
          </h2>

          <p className="text-sm text-[#666666] text-center">
            {branch}<br />
            {formatDate(preferredDate)}
          </p>

          <button
            ref={okRef}
            onClick={onClose}
            className="bg-black text-white w-full py-3 text-sm tracking-widest uppercase hover:bg-[#333333] rounded-none mt-2"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  )
}
