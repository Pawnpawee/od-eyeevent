"use client";

import { useEffect, useRef, useState } from "react";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BuildingStorefrontIcon,
  CalendarDaysIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/24/outline";
import SuccessMessage from "./SuccessMessage";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^0[0-9]{9}$/;

interface FormData {
  name: string;
  email: string;
  phone: string;
  province: string;
  storeId: string;
  preferred_date: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  province?: string;
  storeId?: string;
  preferred_date?: string;
}

interface SubmittedData {
  branch: string;
  preferredDate: string;
}

interface Store {
  id: string;
  branch: string;
  province: string;
  display: string;
}

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

const baseInput =
  "w-full border border-[#e0e0e0] rounded-none py-3 text-black text-base " +
  "hover:border-[#999999] focus:border-black focus:outline-none focus:ring-0 " +
  "placeholder:text-[#666666] bg-white disabled:opacity-50";

const iconInputClass = baseInput + " pl-11 pr-4";
const selectClass = iconInputClass + " cursor-pointer";

const labelClass =
  "block text-xs font-medium tracking-[0.15em] uppercase text-[#666666] mb-2";

const EMPTY_FORM: FormData = {
  name: "",
  email: "",
  phone: "",
  province: "",
  storeId: "",
  preferred_date: "",
};

export default function RegistrationForm() {
  const [stores, setStores] = useState<Store[]>([]);
  const [storesLoading, setStoresLoading] = useState(true);

  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isDuplicateEmail, setIsDuplicateEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [submittedData, setSubmittedData] = useState<SubmittedData | null>(
    null,
  );

  const firstInputRef = useRef<HTMLInputElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(new Date().toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    fetch("/api/stores")
      .then((r) => r.json())
      .then(setStores)
      .catch(() => {})
      .finally(() => setStoresLoading(false));
  }, []);

  const provinces = [...new Set(stores.map((s) => s.province))].sort();
  const branchOptions = form.province
    ? stores.filter((s) => s.province === form.province)
    : [];

  function setField(key: keyof FormData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      if (key === "email") setIsDuplicateEmail(false);
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };
  }

  function handleEmail(e: React.ChangeEvent<HTMLInputElement>) {
    const cleaned = e.target.value.replace(/[^a-zA-Z0-9@._+\-]/g, "");
    setIsDuplicateEmail(false);
    setForm((prev) => ({ ...prev, email: cleaned }));
  }

  function handlePhone(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, phone: formatPhone(e.target.value) }));
  }

  function setProvince(e: React.ChangeEvent<HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, province: e.target.value, storeId: "" }));
    setErrors((prev) => ({ ...prev, province: undefined, storeId: undefined }));
  }

  function validate(): FormErrors {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "กรุณากรอกชื่อ-นามสกุล";

    if (!form.email.trim()) e.email = "กรุณากรอกอีเมล";
    else if (!EMAIL_REGEX.test(form.email)) e.email = "รูปแบบอีเมลไม่ถูกต้อง";

    const normalizedPhone = form.phone.replace(/[-\s]/g, "");
    if (!normalizedPhone) e.phone = "กรุณากรอกเบอร์โทรศัพท์";
    else if (!PHONE_REGEX.test(normalizedPhone))
      e.phone = "กรุณากรอกเบอร์โทรศัพท์ 10 หลัก (เช่น 0812345678)";

    if (!form.province) e.province = "กรุณาเลือกจังหวัด";
    if (!form.storeId) e.storeId = "กรุณาเลือกสาขา";

    if (!form.preferred_date) e.preferred_date = "กรุณาเลือกวันที่";
    else if (today && form.preferred_date < today)
      e.preferred_date = "กรุณาเลือกวันที่ในอนาคต";

    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const selectedStore = stores.find((s) => s.id === form.storeId);
    if (!selectedStore) {
      setErrors({ storeId: "กรุณาเลือกสาขา" });
      return;
    }

    setErrors({});
    setIsDuplicateEmail(false);
    setLoading(true);
    setServerError("");

    try {
      const normalizedPhone = form.phone.replace(/[-\s]/g, "");
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: normalizedPhone,
          store_id: selectedStore.id,
          branch: selectedStore.branch,
          province: selectedStore.province,
          preferred_date: form.preferred_date,
        }),
      });

      if (res.status === 409) {
        setIsDuplicateEmail(true);
        return;
      }
      if (!res.ok) {
        const data = await res.json();
        setServerError(data.error ?? "เกิดข้อผิดพลาด กรุณาลองอีกครั้ง");
        return;
      }

      setSubmittedData({
        branch: selectedStore.branch,
        preferredDate: form.preferred_date,
      });
    } catch {
      setServerError("เกิดข้อผิดพลาด กรุณาลองอีกครั้ง");
    } finally {
      setLoading(false);
    }
  }

  function handleModalClose() {
    setSubmittedData(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setIsDuplicateEmail(false);
    setServerError("");
    setTimeout(() => firstInputRef.current?.focus(), 0);
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
        <form
          onSubmit={handleSubmit}
          noValidate
          className="max-w-lg mx-auto flex flex-col gap-5"
        >
          {/* Name */}
          <div>
            <label htmlFor="name" className={labelClass}>
              ชื่อ-นามสกุล
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aaaaaa] pointer-events-none" />
              <input
                ref={firstInputRef}
                id="name"
                type="text"
                placeholder="ชื่อ-นามสกุล"
                className={iconInputClass}
                value={form.name}
                onChange={setField("name")}
              />
            </div>
            {errors.name && (
              <p className="text-xs text-[#cc0000] mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className={labelClass}>
              อีเมล
            </label>
            <div className="relative">
              <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aaaaaa] pointer-events-none" />
              <input
                id="email"
                type="email"
                placeholder="example@email.com"
                className={iconInputClass}
                value={form.email}
                onChange={handleEmail}
              />
            </div>
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

          {/* Phone */}
          <div>
            <label htmlFor="phone" className={labelClass}>
              เบอร์โทรศัพท์
            </label>
            <div className="relative">
              <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aaaaaa] pointer-events-none" />
              <input
                id="phone"
                type="tel"
                placeholder="0xx-xxx-xxxx"
                maxLength={12}
                className={iconInputClass}
                value={form.phone}
                onChange={handlePhone}
              />
            </div>
            {errors.phone && (
              <p className="text-xs text-[#cc0000] mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Province */}
          <div>
            <label htmlFor="province" className={labelClass}>
              จังหวัด
            </label>
            <div className="relative">
              <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aaaaaa] pointer-events-none z-10" />
              <select
                id="province"
                className={selectClass}
                value={form.province}
                onChange={setProvince}
                disabled={storesLoading}
              >
                <option value="">
                  {storesLoading ? "กำลังโหลด..." : "-- เลือกจังหวัด --"}
                </option>
                {provinces.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            {errors.province && (
              <p className="text-xs text-[#cc0000] mt-1">{errors.province}</p>
            )}
          </div>

          {/* Branch */}
          <div>
            <label htmlFor="store" className={labelClass}>
              สาขาที่สะดวก
            </label>
            <div className="relative">
              <BuildingStorefrontIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aaaaaa] pointer-events-none z-10" />
              <select
                id="store"
                className={selectClass}
                value={form.storeId}
                onChange={setField("storeId")}
                disabled={storesLoading || !form.province}
              >
                <option value="">
                  {!form.province ? "กรุณาเลือกจังหวัดก่อน" : "-- เลือกสาขา --"}
                </option>
                {branchOptions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.display}
                  </option>
                ))}
              </select>
            </div>
            {errors.storeId && (
              <p className="text-xs text-[#cc0000] mt-1">{errors.storeId}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label htmlFor="preferred_date" className={labelClass}>
              วันที่สะดวก
            </label>
            <div className="relative">
              <input
                ref={dateInputRef}
                id="preferred_date"
                type="date"
                min={today || undefined}
                className={`${baseInput} pl-3 pr-10 text-left [&::-webkit-calendar-picker-indicator]:hidden`}
                value={form.preferred_date}
                onChange={setField("preferred_date")}
              />

              <div
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-1 cursor-pointer flex items-center justify-center"
                onClick={() => dateInputRef.current?.showPicker()}
              >
                <CalendarDaysIcon className="w-4 h-4 text-[#aaaaaa]" />
              </div>
            </div>
            {errors.preferred_date && (
              <p className="text-xs text-[#cc0000] mt-1">
                {errors.preferred_date}
              </p>
            )}
          </div>

          {serverError && (
            <p className="text-xs text-[#cc0000]">{serverError}</p>
          )}

          <button
            type="submit"
            disabled={loading || storesLoading}
            className="w-full bg-black text-white py-4 text-sm font-medium tracking-widest uppercase
              flex items-center justify-center gap-3
              hover:bg-[#333333] focus:outline-black disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors mt-1"
          >
            <span>{loading ? "กำลังส่ง..." : "ลงทะเบียน"}</span>
            {!loading && <ArrowLongRightIcon className="w-5 h-5" />}
          </button>
        </form>
      </section>
    </>
  );
}
