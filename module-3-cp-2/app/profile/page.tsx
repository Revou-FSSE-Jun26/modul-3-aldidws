"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function ProfilePage() {
  const { status, user } = useAuth(true);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/login");
    }
  }, [status, router]);

  if (status === "loading" || status === "unauthenticated" || !user) {
    return (
      <main className="min-h-[60vh] bg-slate-50 px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="h-8 w-48 rounded bg-slate-200" />
          <div className="mt-3 h-4 w-72 max-w-full rounded bg-slate-200" />

          <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
            <div className="h-64 rounded-xl bg-slate-200" />
            <div className="h-80 rounded-xl bg-slate-200" />
          </div>
        </div>
      </main>
    );
  }

  const initial = user.name?.trim().charAt(0).toUpperCase() || "U";

  return (
    <main className="min-h-[60vh] bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 lg:py-14">
      <div className="mx-auto max-w-6xl">
        {/* Page heading */}
        <header className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
            MY ACCOUNT
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#17365d] sm:text-4xl">
            My Profile
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
            Manage your account information and access Revo Otoshop
            services through your profile page.
          </p>
        </header>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* Account sidebar */}
          <aside className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-[#17365d] px-5 py-7 text-white">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/30 bg-white/15 text-2xl font-bold">
                {initial}
              </div>

              <h2 className="mt-4 break-words text-lg font-bold">
                {user.name}
              </h2>

              <p className="mt-1 break-all text-sm text-blue-100">
                {user.email}
              </p>

            </div>

            <nav className="space-y-1 p-3" aria-label="Account menu">
              <Link
                href="/profile"
                aria-current="page"
                className="flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700"
              >
                My Profile
              </Link>

              <Link
                href="/products"
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-blue-700"
              >
                Browse Products
              </Link>

              <Link
                href="/cart"
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-blue-700"
              >
                Shopping Cart
              </Link>

              <Link
                href="/"
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-blue-700"
              >
                <span aria-hidden="true">🏠︎</span>
                Back to Home
              </Link>
            </nav>
          </aside>

          {/* Main content */}
          <div className="min-w-0 space-y-6">
            {/* Account information */}
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="border-b border-slate-100 pb-5">
                <h2 className="text-lg font-bold text-[#17365d]">
                  Account Information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Basic information for your Revo Otoshop account.
                </p>
              </div>

              <dl className="mt-2 divide-y divide-slate-100">
                <div className="grid grid-cols-1 gap-2 py-5 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-5">
                  <dt className="text-sm text-slate-500">
                    Full Name
                  </dt>

                  <dd className="break-words text-sm font-semibold text-slate-800">
                    {user.name || "-"}
                  </dd>
                </div>

                <div className="grid grid-cols-1 gap-2 py-5 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-5">
                  <dt className="text-sm text-slate-500">
                    Email Address
                  </dt>

                  <dd className="break-all text-sm font-semibold text-slate-800">
                    {user.email || "-"}
                  </dd>
                </div>
              </dl>
            </section>

            {/* Quick actions */}
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <h2 className="text-lg font-bold text-[#17365d]">
                Quick Actions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Quickly access store features.
              </p>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Link
                  href="/products"
                  className="group rounded-lg border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50/50"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-xl">
                    🛍️
                  </span>

                  <h3 className="mt-3 text-sm font-bold text-slate-800 group-hover:text-blue-700">
                    Explore Products
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Find Car parts and accessories.
                  </p>

                  <span className="mt-3 inline-block text-xs font-semibold text-blue-600">
                    Browse products →
                  </span>
                </Link>

                <Link
                  href="/cart"
                  className="group rounded-lg border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50/50"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-xl">
                    🛒
                  </span>

                  <h3 className="mt-3 text-sm font-bold text-slate-800 group-hover:text-blue-700">
                    Shopping Cart
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Check the products you want to purchase.
                  </p>

                  <span className="mt-3 inline-block text-xs font-semibold text-blue-600">
                    View cart →
                  </span>
                </Link>
              </div>
            </section>

            {/* Help panel */}
            <section className="flex flex-col gap-3 rounded-xl border border-blue-100 bg-blue-50 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#17365d]">
                  Need Help?
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Find the parts or accessories that fit
                  your car's needs.
                </p>
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