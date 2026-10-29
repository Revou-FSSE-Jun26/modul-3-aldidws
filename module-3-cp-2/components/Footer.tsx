import Link from "next/link";

export default function Footer() {
return (
<footer className="mt-16 w-full border-t border-slate-200 bg-[#10243e] text-white">
<div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
{/* Brand */}
<div>
<Link href="/" className="inline-block">
<span className="text-2xl font-black tracking-tight">
REVO<span className="text-blue-400">.</span>
</span>
<span className="mt-0.5 block text-[10px] font-semibold tracking-[0.3em] text-slate-400">
OTOSHOP
</span>
</Link>

      <p className="mt-5 max-w-xs text-sm leading-7 text-slate-300">
        Your destination for automotive parts, replacement
        components, and performance accessories.
      </p>
    </div>

    {/* Navigation */}
    <div>
      <h3 className="text-sm font-bold uppercase tracking-wider">
        Quick Links
      </h3>

      <ul className="mt-5 space-y-3 text-sm text-slate-300">
        <li>
          <Link href="/" className="transition hover:text-white">
            Home
          </Link>
        </li>
        <li>
          <Link href="/products" className="transition hover:text-white">
            Products
          </Link>
        </li>
        <li>
          <Link href="/categories" className="transition hover:text-white">
            Categories
          </Link>
        </li>
        <li>
          <Link href="/about" className="transition hover:text-white">
            About Us
          </Link>
        </li>
      </ul>
    </div>

    {/* Customer Service */}
    <div>
      <h3 className="text-sm font-bold uppercase tracking-wider">
        Customer Service
      </h3>

      <ul className="mt-5 space-y-3 text-sm text-slate-300">
        <li>
          <Link href="/profile" className="transition hover:text-white">
            My Account
          </Link>
        </li>
        <li>
          <Link href="/orders" className="transition hover:text-white">
            My Orders
          </Link>
        </li>
        <li>
          <Link href="/cart" className="transition hover:text-white">
            Shopping Cart
          </Link>
        </li>
        <li>
          <Link href="/login" className="transition hover:text-white">
            Login / Register
          </Link>
        </li>
      </ul>
    </div>

    {/* Store information */}
    <div>
      <h3 className="text-sm font-bold uppercase tracking-wider">
        Revo-Otoshop
      </h3>

      <p className="mt-5 text-sm leading-7 text-slate-300">
        Quality automotive parts for your next upgrade.
      </p>

      <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-xs text-slate-300">
        <span className="h-2 w-2 rounded-full bg-green-400" />
        Online Store
      </div>
    </div>
  </div>

  {/* Copyright */}
  <div className="border-t border-white/10">
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-xs text-slate-400 sm:flex-row">
      <p>
        © {new Date().getFullYear()} Revo-Otoshop. All rights reserved.
      </p>

      <p>Built for automotive enthusiasts.</p>
    </div>
  </div>
</footer>

);
}