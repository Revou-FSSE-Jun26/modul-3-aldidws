import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({ children }: LayoutProps<"/auth">) {
  return (
    <div className="flex min-h-screen">

      {/* ── Left panel — hero image (hidden on mobile) ── */}
      <div className="relative hidden w-1/2 flex-col lg:flex">
        <Image
          src="https://ik.imagekit.io/3xk2xnjekw/photo-1616455263449-0bd3aac04029.avif"
          alt="BMW M3 on an open road"
          fill
          priority
          sizes="50vw"
          className="object-cover object-center"
        />
        {/* dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#17365d]/80 via-[#17365d]/50 to-[#17365d]/80" />

        {/* Branding */}
        <div className="absolute inset-0 flex flex-col justify-between p-10">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight text-white">
              REVO <span className="text-amber-400">OTOSHOP</span>
            </span>
          </Link>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Premium Auto Parts
            </p>
            <h2 className="mt-2 text-3xl font-black leading-tight text-white">
              The Right Parts <br /> for Your BMW
            </h2>
            <p className="mt-3 max-w-xs text-sm leading-6 text-white/70">
              OEM-quality components, performance upgrades, and expert fitment
              guidance — all in one place.
            </p>
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex w-full flex-col items-center justify-center bg-white px-6 py-12 lg:w-1/2">

        {/* Mobile-only logo */}
        <div className="mb-8 lg:hidden">
          <Link href="/" className="text-xl font-black tracking-tight text-[#17365d]">
            REVO <span className="text-amber-400">OTOSHOP</span>
          </Link>
        </div>

        <div className="w-full max-w-sm">
          {children}
        </div>
      </div>

    </div>
  );
}
