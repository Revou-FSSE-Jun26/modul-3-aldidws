import type { Metadata } from "next";
import Image from "next/image";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "About — Revo Otoshop",
  description: "Learn about Revo Otoshop, your trusted automotive parts store.",
};

const STATS = [
  { value: "10,000+", label: "Parts in Catalog" },
  { value: "5,000+", label: "Happy Customers" },
  { value: "500+", label: "Trusted Brands" },
  { value: "24/7", label: "Customer Support" },
];

const VALUES = [
  {
    icon: "🔩",
    title: "Genuine Quality",
    description:
      "Every part in our catalog is sourced from trusted manufacturers and meets OEM specifications.",
  },
  {
    icon: "🚀",
    title: "Fast Delivery",
    description:
      "We partner with reliable couriers to ensure your parts arrive quickly and safely.",
  },
  {
    icon: "🛡️",
    title: "Warranty Guaranteed",
    description:
      "All products come with manufacturer warranties so you can shop with confidence.",
  },
  {
    icon: "🔍",
    title: "Expert Fitment",
    description:
      "Our fitment system helps you find the exact part for your vehicle — no guesswork needed.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col">

      {/* ── Hero ── */}
      <section
        className="relative -mt-8 mb-16 overflow-hidden"
        style={{
          width: "100vw",
          marginLeft: "calc(-50vw + 50%)",
        }}
      >
        {/* BMW hero image */}
        <div className="relative h-[420px] w-full sm:h-[520px] lg:h-[600px]">
          <Image
            src="https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1600&q=85&auto=format&fit=crop"
            alt="BMW M3 on an empty road — precision engineering at its finest"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />

          {/* Hero text */}
          <div className="absolute inset-0 flex flex-col items-start justify-end px-6 pb-12 sm:px-10 lg:px-16">
            <span className="mb-3 inline-block rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-300 backdrop-blur-sm">
              Since 2026
            </span>
            <h1 className="max-w-2xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Built for Those Who{" "}
              <span className="text-blue-400">Drive with Purpose</span>
            </h1>
            <p className="mt-4 max-w-xl text-base text-slate-300 sm:text-lg">
              Revo Otoshop is Indonesia&apos;s premier destination for genuine
              automotive parts, performance upgrades, and expert fitment guidance.
            </p>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="mb-16">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-1 rounded-2xl border border-slate-200 bg-white px-4 py-6 text-center shadow-sm"
            >
              <span className="text-3xl font-black tracking-tight text-[#17365d]">
                {stat.value}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Story ── */}
      <section className="mb-16 grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Text */}
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Our Story
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#17365d]">
              From Passion to Platform
            </h2>
          </div>
          <p className="leading-7 text-slate-600">
            Revo Otoshop started as a small workshop in Jakarta, run by a group
            of BMW enthusiasts who were frustrated by the lack of genuine parts
            available locally. What began as a side project quickly grew into
            a full-scale e-commerce platform serving customers across Indonesia.
          </p>
          <p className="leading-7 text-slate-600">
            Today we carry over 10,000 SKUs — from OEM replacement components to
            performance upgrades — all verified for fitment and backed by
            manufacturer warranties. Whether you&apos;re maintaining a daily driver
            or building a track car, we have what you need.
          </p>
          <div className="flex items-center gap-4 pt-2">
            <div className="h-1 w-12 rounded-full bg-blue-500" />
            <span className="text-sm font-semibold text-slate-500">
              Jakarta, Indonesia
            </span>
          </div>
        </div>

        {/* Secondary image */}
        <div className="relative h-72 overflow-hidden rounded-2xl shadow-xl lg:h-96">
          <Image
            src="https://ik.imagekit.io/3xk2xnjekw/bmw-m-motorsport-bmw-m3-touring-24h-2026-fj-1366x768.jpg"
            alt="BMW M4 in a garage — attention to detail"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/10" />
        </div>
      </section>

      {/* ── Values ── */}
      <section className="mb-16">
        <div className="mb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
            Why Choose Us
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#17365d]">
            Our Core Values
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <div
              key={v.title}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                {v.icon}
              </span>
              <h3 className="text-sm font-bold text-slate-800">{v.title}</h3>
              <p className="text-sm leading-6 text-slate-500">{v.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section
        className="relative overflow-hidden"
        style={{
          width: "100vw",
          marginLeft: "calc(-50vw + 50%)",
        }}
      >
        <div className="relative h-56 w-full sm:h-64">
          <Image
            src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1400&q=80&auto=format&fit=crop"
            alt="BMW on a winding mountain road"
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[#17365d]/80" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <h2 className="text-2xl font-black text-white sm:text-3xl">
              Ready to Find Your Parts?
            </h2>
            <p className="max-w-md text-sm text-slate-300">
              Browse our full catalog and use our vehicle fitment guide to get
              exactly what your car needs.
            </p>
            <a
              href="/products"
              className="mt-1 inline-flex items-center gap-2 rounded-full bg-blue-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-400"
            >
              Browse Products →
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
