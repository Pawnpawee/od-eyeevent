import Image from 'next/image'
import Link from 'next/link'

export default function HeroSection() {
  return (
    <header className="py-16 px-6 md:px-12 bg-white text-center">
      <div className="max-w-2xl mx-auto">
        <div className="mb-12 flex justify-center">
          <Link href="/">
            <Image
              src="/owndays.svg"
              alt="OWNDAYS"
              width={160}
              height={40}
              priority
              unoptimized
              style={{ height: '30px', width: 'auto' }}
              className="transition-opacity hover:opacity-70"
            />
          </Link>
        </div>
        <h1 className="text-3xl md:text-5xl font-medium tracking-tight mb-6 leading-snug">
          ตรวจวัดสายตาฟรี <br />
          จองคิวเลยวันนี้
        </h1>
        <p className="text-base md:text-lg font-light text-[#666666]">
          มองชัดขึ้น ใช้ชีวิตได้เต็มที่ขึ้น ลงทะเบียนเลือกสาขาและวันที่สะดวก <br />
          OWNDAYS พร้อมดูแลคุณ
        </p>
      </div>
    </header>
  );
}
