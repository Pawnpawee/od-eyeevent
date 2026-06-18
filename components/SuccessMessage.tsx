'use client'

import { useEffect, useRef } from 'react'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

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
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      aria-hidden="false"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="success-title"
        className="bg-white border border-black w-full max-w-sm mx-4 p-10 relative rounded-none"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="ปิด"
          className="absolute top-4 right-4 text-[#999999] hover:text-black transition-colors cursor-pointer"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center gap-5">

          {/* Check icon in thin bordered circle */}
          <div className="w-14 h-14 rounded-full border border-black flex items-center justify-center">
            <CheckIcon className="w-6 h-6 text-black" strokeWidth={1.5} />
          </div>

          <div className="text-center">
            <h2 id="success-title" className="text-lg font-medium text-black mb-1">
              ลงทะเบียนสำเร็จแล้ว
            </h2>
            <p className="text-xs tracking-[0.2em] uppercase text-[#aaaaaa]">Registration Complete</p>
          </div>

          <div className="w-full border-t border-[#e0e0e0] pt-5 text-center">
            <p className="text-sm font-medium text-black">{branch}</p>
            <p className="text-sm text-[#666666] mt-1">{formatDate(preferredDate)}</p>
          </div>

          <button
            ref={okRef}
            onClick={onClose}
            className="bg-black text-white w-full py-3 text-xs tracking-widest uppercase hover:bg-[#333333] rounded-none cursor-pointer transition-colors mt-1"
          >
            ปิด
          </button>

        </div>
      </div>
    </div>
  )
}
