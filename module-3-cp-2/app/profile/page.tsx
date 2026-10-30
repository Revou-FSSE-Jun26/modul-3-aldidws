"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LayoutDashboard, Package, Tag, ClipboardList, ShoppingCart, Store, ArrowRight, LogOut } from "lucide-react";

export default function ProfilePage() {
  const { status, user, logout, isAdmin: isAdminRaw } = useAuth(true);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/login");
    }
  }, [status, router]);

  function handleLogout() {
    logout();
    router.replace("/auth/login");
  }

  if (status === "loading" || status === "unauthenticated" || !user) {
    return (
      <main className="min-h-[60vh] bg-slate-50 px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-4xl animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-slate-200" />
          <div className="h-4 w-72 max-w-full rounded bg-slate-200" />
          <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
            <div className="h-64 rounded-xl bg-slate-200" />
            <div className="h-80 rounded-xl bg-slate-200" />
          </div>
        </div>
      </main>
    );
  }

  const isAdmin = isAdminRaw;
  const initial = user.name?.trim().charAt(0).toUpperCase() || "U";

  /* ── Admin profile ── */
  if (isAdmin) {
    return (
      <main className="min-h-[60vh] px-4 py-10 sm:px-6 lg:py-14">
        <div className="mx-auto max-w-4xl space-y-6">

          {/* Header */}
          <header>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600">Admin Panel</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              My Account
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Manage your store from the dashboard.
            </p>
          </header>

          <div className="grid gap-6 lg:grid-cols-[260px_1fr]">

            {/* Sidebar */}
            <aside className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="bg-[#17365d] px-5 py-7 text-white">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/30 bg-white/15 text-xl font-bold">
                  {initial}
                </div>
                <h2 className="mt-4 break-words text-base font-bold">{user.name}</h2>
                <p className="mt-0.5 break-all text-xs text-blue-200">{user.email}</p>
                <span className="mt-2 inline-block rounded-full bg-blue-500/30 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-blue-100">
                  Admin
                </span>
              </div>

              <nav className="space-y-1 p-3" aria-label="Account menu">
                <Link
                  href="/profile"
                  aria-current="page"
                  className="flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700"
                >
                  My Profile
                </Link>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-blue-700"
                >
                  <LayoutDashboard size={15} className="text-slate-400" />
                  Dashboard
                </Link>
                
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut size={15} className="shrink-0 text-red-400" />
                  Sign Out
                </button>
              </nav>
            </aside>

            {/* Main */}
            <div className="space-y-5">
              {/* Account info */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-base font-bold text-slate-800">Account Information</h2>
                <p className="mt-0.5 text-xs text-slate-500">Your Revo Otoshop admin account details.</p>
                <dl className="mt-4 divide-y divide-slate-100">
                  <div className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-[140px_1fr]">
                    <dt className="text-xs text-slate-500">Full Name</dt>
                    <dd className="text-sm font-semibold text-slate-800">{user.name || "-"}</dd>
                  </div>
                  <div className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-[140px_1fr]">
                    <dt className="text-xs text-slate-500">Email Address</dt>
                    <dd className="break-all text-sm font-semibold text-slate-800">{user.email || "-"}</dd>
                  </div>
                  <div className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-[140px_1fr]">
                    <dt className="text-xs text-slate-500">Role</dt>
                    <dd>
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700">
                        Administrator
                      </span>
                    </dd>
                  </div>
                </dl>
              </section>

              {/* Quick access */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-base font-bold text-slate-800">Quick Access</h2>
                <p className="mt-0.5 text-xs text-slate-500">Jump to any section of the dashboard.</p>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {[
                    { href: "/dashboard/products",   icon: Package,       label: "Products",   desc: "Manage product catalog" },
                    { href: "/dashboard/categories", icon: Tag,           label: "Categories", desc: "Manage product categories" },
                    { href: "/dashboard/orders",     icon: ClipboardList, label: "Orders",     desc: "View and manage orders" },
                    { href: "/dashboard",            icon: LayoutDashboard, label: "Overview", desc: "Store statistics" },
                  ].map(({ href, icon: Icon, label, desc }) => (
                    <Link
                      key={href}
                      href={href}
                      className="group flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/40"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 transition group-hover:bg-blue-100">
                        <Icon size={18} className="text-slate-500 group-hover:text-blue-600" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-700">{label}</p>
                        <p className="text-xs text-slate-500">{desc}</p>
                      </div>
                      <ArrowRight size={14} className="ml-auto shrink-0 text-slate-300 group-hover:text-blue-500" />
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ── Regular user profile ── */
  return (
    <main className="min-h-[60vh] bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 lg:py-14">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">MY ACCOUNT</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#17365d] sm:text-4xl">
            My Profile
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
            Manage your account information and access Revo Otoshop services.
          </p>
        </header>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-[#17365d] px-5 py-7 text-white">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/30 bg-white/15 text-2xl font-bold">
                {initial}
              </div>
              <h2 className="mt-4 break-words text-lg font-bold">{user.name}</h2>
              <p className="mt-1 break-all text-sm text-blue-100">{user.email}</p>
            </div>

            <nav className="space-y-1 p-3" aria-label="Account menu">
              <Link
                href="/profile"
                aria-current="page"
                className="flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700"
              >
                My Profile
              </Link>
              
              <div className="my-1 border-t border-slate-100" />

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 font-[inherit] text-sm font-semibold text-red-500 transition hover:bg-red-50 hover:text-red-600"
              >
                <LogOut size={15} className="shrink-0 text-red-400" />
                Sign Out
              </button>
            </nav>
          </aside>

          {/* Main content */}
          <div className="min-w-0 space-y-6">
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="border-b border-slate-100 pb-5">
                <h2 className="text-lg font-bold text-[#17365d]">Account Information</h2>
                <p className="mt-1 text-sm text-slate-500">Basic information for your Revo Otoshop account.</p>
              </div>
              <dl className="mt-2 divide-y divide-slate-100">
                <div className="grid grid-cols-1 gap-2 py-5 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-5">
                  <dt className="text-sm text-slate-500">Full Name</dt>
                  <dd className="break-words text-sm font-semibold text-slate-800">{user.name || "-"}</dd>
                </div>
                <div className="grid grid-cols-1 gap-2 py-5 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-5">
                  <dt className="text-sm text-slate-500">Email Address</dt>
                  <dd className="break-all text-sm font-semibold text-slate-800">{user.email || "-"}</dd>
                </div>
              </dl>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <h2 className="text-lg font-bold text-[#17365d]">Quick Actions</h2>
              <p className="mt-1 text-sm text-slate-500">Quickly access store features.</p>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Link
                  href="/products"
                  className="group rounded-lg border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50/50"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-xl">🛍️</span>
                  <h3 className="mt-3 text-sm font-bold text-slate-800 group-hover:text-blue-700">Explore Products</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">Find car parts and accessories.</p>
                  <span className="mt-3 inline-block text-xs font-semibold text-blue-600">Browse products →</span>
                </Link>

                <Link
                  href="/cart"
                  className="group rounded-lg border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50/50"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-xl">🛒</span>
                  <h3 className="mt-3 text-sm font-bold text-slate-800 group-hover:text-blue-700">Shopping Cart</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">Check the products you want to purchase.</p>
                  <span className="mt-3 inline-block text-xs font-semibold text-blue-600">View cart →</span>
                </Link>
              </div>
            </section>

            <section className="flex flex-col gap-3 rounded-xl border border-blue-100 bg-blue-50 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#17365d]">Need Help?</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">Find the parts that fit your car's needs.</p>
              </div>
              <Link
                href="/products"
                className="inline-flex w-fit shrink-0 items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Explore Store
              </Link>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
