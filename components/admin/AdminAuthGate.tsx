'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

const SESSION_KEY = 'owndays_admin_authed'

export default function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === 'true') setAuthed(true)
    setChecking(false)
  }, [])

  useEffect(() => {
    if (!checking && !authed) {
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [checking, authed])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/admin-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: input }),
    })
    if (res.ok) {
      sessionStorage.setItem(SESSION_KEY, 'true')
      setAuthed(true)
    } else {
      setError(true)
      setInput('')
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }

  if (checking) return null
  if (authed) return <>{children}</>

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4">
      <div className="bg-white border border-[#e0e0e0] w-full max-w-sm p-10">

        <div className="flex justify-center mb-10">
          <Image
            src="/owndays.svg"
            alt="OWNDAYS"
            width={100}
            height={25}
            unoptimized
            style={{ height: '22px', width: 'auto' }}
          />
        </div>

        <div className="flex items-center gap-2 mb-6">
          <LockClosedIcon className="w-4 h-4 text-[#666666]" />
          <p className="text-xs font-medium text-black uppercase tracking-[0.2em]">Admin Access</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-medium text-[#666666] uppercase tracking-[0.15em] mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={input}
                onChange={e => { setInput(e.target.value); setError(false) }}
                placeholder="••••"
                className={`w-full border px-4 py-3 pr-11 text-sm text-black bg-white rounded-none
                  focus:outline-none focus:ring-0
                  ${error
                    ? 'border-[#cc0000] focus:border-[#cc0000]'
                    : 'border-[#e0e0e0] hover:border-[#999999] focus:border-black'
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999999] hover:text-black cursor-pointer transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword
                  ? <EyeSlashIcon className="w-4 h-4" />
                  : <EyeIcon className="w-4 h-4" />
                }
              </button>
            </div>
            {error && (
              <p className="text-xs text-[#cc0000] mt-1">รหัสผ่านไม่ถูกต้อง</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 text-xs font-medium uppercase tracking-widest
              hover:bg-[#333333] transition-colors cursor-pointer"
          >
            เข้าสู่ระบบ
          </button>
        </form>

      </div>
    </div>
  )
}
