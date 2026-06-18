import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <header className="relative overflow-hidden bg-white text-center py-20 px-6 md:px-12">
      {/* Lens circle — optometry reference, the signature element */}
      <div
        aria-hidden="true"
        className="absolute rounded-full border border-[#ececec] pointer-events-none"
        style={{
          width: "min(88vw, 680px)",
          height: "min(88vw, 680px)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute rounded-full border border-[#f4f4f4] pointer-events-none"
        style={{
          width: "min(60vw, 460px)",
          height: "min(60vw, 460px)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      <div className="relative max-w-2xl mx-auto flex flex-col items-center">
        <div className="mb-10">
          <Link href="/" className="cursor-pointer">
            <Image
              src="/owndays.svg"
              alt="OWNDAYS"
              width={160}
              height={40}
              priority
              unoptimized
              style={{ height: "30px", width: "auto" }}
              className="transition-opacity hover:opacity-70"
            />
          </Link>
        </div>

        <p className="text-[10px] tracking-[0.3em] uppercase text-[#aaaaaa] mb-7 font-normal">
          Free Eye Exam &nbsp;·&nbsp; Thailand
        </p>

        <h1 className="text-3xl md:text-5xl font-medium tracking-tight leading-snug mb-6">
          ตรวจวัดสายตาฟรี
          <br />
          จองคิวเลยวันนี้
        </h1>

        <p className="text-base md:text-lg font-light text-[#666666]">
          มองชัดขึ้น ใช้ชีวิตได้เต็มที่ขึ้น
          <br />
          ลงทะเบียนเลือกสาขาและวันที่สะดวก
          <br className="2xl:hidden" /> OWNDAYS พร้อมดูแลคุณ
        </p>

        <div className="mt-10 w-10 h-px bg-[#cccccc]" />
      </div>
    </header>
  );
}
