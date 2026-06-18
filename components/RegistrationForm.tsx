'use client'

import { useEffect, useRef, useState } from 'react'
import SuccessMessage from './SuccessMessage'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^0[0-9]{9}$/

interface FormData {
  name: string
  email: string
  phone: string
  storeId: string
  preferred_date: string
}

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  storeId?: string
  preferred_date?: string
}

interface SubmittedData {
  branch: string
  preferredDate: string
}

interface Store {
  id: string;
  branch: string;
  province: string;
  display: string;
  region: "bkk" | "other";
}

const inputClass =
  'w-full border border-[#e0e0e0] rounded-none px-4 py-3 text-black text-base ' +
  'hover:border-[#999999] focus:border-black focus:outline-none focus:ring-0 ' +
  'placeholder:text-[#666666] bg-white'

const labelClass = 'block text-sm font-medium tracking-wide uppercase mb-2'

const EMPTY_FORM: FormData = { name: '', email: '', phone: '', storeId: '', preferred_date: '' }

export default function RegistrationForm() {
  const [stores, setStores] = useState<Store[]>([])
  const [storesLoading, setStoresLoading] = useState(true)

  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isDuplicateEmail, setIsDuplicateEmail] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const [submittedData, setSubmittedData] = useState<SubmittedData | null>(null)

  const firstInputRef = useRef<HTMLInputElement>(null)
  const [today, setToday] = useState('')

  useEffect(() => {
    setToday(new Date().toISOString().split('T')[0])
  }, [])

  useEffect(() => {
    fetch('/api/stores')
      .then(r => r.json())
      .then(setStores)
      .catch(() => {})
      .finally(() => setStoresLoading(false))
  }, [])

  const bkkStores = stores.filter(s => s.region === 'bkk')
  const otherStores = stores.filter(s => s.region === 'other')

  function setField(key: keyof FormData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      if (key === 'email') setIsDuplicateEmail(false)
      setForm(prev => ({ ...prev, [key]: e.target.value }))
    }
  }

  function validate(): FormErrors {
    const e: FormErrors = {}
    if (!form.name.trim()) e.name = 'กรุณากรอกชื่อ-นามสกุล'

    if (!form.email.trim()) e.email = 'กรุณากรอกอีเมล'
    else if (!EMAIL_REGEX.test(form.email)) e.email = 'รูปแบบอีเมลไม่ถูกต้อง'

    const normalizedPhone = form.phone.replace(/[-\s]/g, '')
    if (!normalizedPhone) e.phone = 'กรุณากรอกเบอร์โทรศัพท์'
    else if (!PHONE_REGEX.test(normalizedPhone)) e.phone = 'กรุณากรอกเบอร์โทรศัพท์ 10 หลัก (เช่น 0812345678)'

    if (!form.storeId) e.storeId = 'กรุณาเลือกสาขา'

    if (!form.preferred_date) e.preferred_date = 'กรุณาเลือกวันที่'
    else if (today && form.preferred_date < today) e.preferred_date = 'กรุณาเลือกวันที่ในอนาคต'

    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    const selectedStore = stores.find(s => s.id === form.storeId)
    if (!selectedStore) {
      setErrors({ storeId: 'กรุณาเลือกสาขา' })
      return
    }

    setErrors({})
    setIsDuplicateEmail(false)
    setLoading(true)
    setServerError('')

    try {
      const normalizedPhone = form.phone.replace(/[-\s]/g, '')
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: normalizedPhone,
          store_id: selectedStore.id,
          branch: selectedStore.branch,
          province: selectedStore.province,
          preferred_date: form.preferred_date,
        }),
      })

      if (res.status === 409) {
        setIsDuplicateEmail(true)
        return
      }
      if (!res.ok) {
        const data = await res.json()
        setServerError(data.error ?? 'เกิดข้อผิดพลาด กรุณาลองอีกครั้ง')
        return
      }

      setSubmittedData({ branch: selectedStore.branch, preferredDate: form.preferred_date })
    } catch {
      setServerError('เกิดข้อผิดพลาด กรุณาลองอีกครั้ง')
    } finally {
      setLoading(false)
    }
  }

  function handleModalClose() {
    setSubmittedData(null)
    setForm(EMPTY_FORM)
    setErrors({})
    setIsDuplicateEmail(false)
    setServerError('')
    setTimeout(() => firstInputRef.current?.focus(), 0)
  }

  return (
    <>
      {submittedData && (
        <SuccessMessage
          branch={submittedData.branch}
          preferredDate={submittedData.preferredDate}
          onClose={handleModalClose}
        />
      )}

      <section className="py-16 px-6 md:px-12 bg-[#f5f5f5]">
        <form onSubmit={handleSubmit} noValidate className="max-w-lg mx-auto flex flex-col gap-6">

          <div>
            <label htmlFor="name" className={labelClass}>ชื่อ-นามสกุล</label>
            <input
              ref={firstInputRef}
              id="name"
              type="text"
              placeholder="ชื่อ-นามสกุล"
              className={inputClass}
              value={form.name}
              onChange={setField('name')}
            />
            {errors.name && <p className="text-xs text-[#cc0000] mt-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>อีเมล</label>
            <input
              id="email"
              type="email"
              placeholder="example@email.com"
              className={inputClass}
              value={form.email}
              onChange={setField('email')}
            />
            {isDuplicateEmail ? (
              <div className="text-xs text-[#cc0000] mt-1 space-y-0.5">
                <p>อีเมลนี้ได้ลงทะเบียนไว้แล้ว</p>
                <p>หากต้องการเปลี่ยนสาขาหรือวันที่ กรุณาติดต่อเราได้ที่</p>
                <p>📧 contact@owndays.com</p>
                <p>💬 Facebook: OWNDAYS Thailand</p>
                <p>📞 02-xxx-xxxx</p>
              </div>
            ) : errors.email ? (
              <p className="text-xs text-[#cc0000] mt-1">{errors.email}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="phone" className={labelClass}>เบอร์โทรศัพท์</label>
            <input
              id="phone"
              type="tel"
              placeholder="0812345678"
              className={inputClass}
              value={form.phone}
              onChange={setField('phone')}
            />
            {errors.phone && <p className="text-xs text-[#cc0000] mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label htmlFor="store" className={labelClass}>สาขาที่สะดวก</label>
            <select
              id="store"
              className={inputClass}
              value={form.storeId}
              onChange={setField('storeId')}
              disabled={storesLoading}
            >
              <option value="">{storesLoading ? 'กำลังโหลด...' : '-- เลือกสาขา --'}</option>
              {bkkStores.length > 0 && (
                <optgroup label="กรุงเทพฯ และปริมณฑล">
                  {bkkStores.map(s => <option key={s.id} value={s.id}>{s.display}</option>)}
                </optgroup>
              )}
              {otherStores.length > 0 && (
                <optgroup label="ต่างจังหวัด">
                  {otherStores.map(s => <option key={s.id} value={s.id}>{s.display}</option>)}
                </optgroup>
              )}
            </select>
            {errors.storeId && <p className="text-xs text-[#cc0000] mt-1">{errors.storeId}</p>}
          </div>

          <div>
            <label htmlFor="preferred_date" className={labelClass}>วันที่สะดวก</label>
            <input
              id="preferred_date"
              type="date"
              min={today || undefined}
              className={inputClass}
              value={form.preferred_date}
              onChange={setField('preferred_date')}
            />
            {errors.preferred_date && (
              <p className="text-xs text-[#cc0000] mt-1">{errors.preferred_date}</p>
            )}
          </div>

          {serverError && <p className="text-xs text-[#cc0000]">{serverError}</p>}

          <button
            type="submit"
            disabled={loading || storesLoading}
            className="w-full bg-black text-white py-4 text-base font-medium tracking-wide uppercase
              hover:bg-[#333333] focus:outline-black disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            {loading ? 'กำลังส่ง...' : 'ลงทะเบียน'}
          </button>

        </form>
      </section>
    </>
  )
}
