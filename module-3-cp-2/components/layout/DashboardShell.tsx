"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LayoutDashboard, Package, Tag, ClipboardList, Store, LogOut } from "lucide-react";

const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/dashboard/products",
    label: "Products",
    icon: Package,
    exact: false,
  },
  {
    href: "/dashboard/categories",
    label: "Categories",
    icon: Tag,
    exact: false,
  },
  {
    href: "/dashboard/orders",
    label: "Orders",
    icon: ClipboardList,
    exact: false,
  },
] as const;

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const initial = user?.name?.trim().charAt(0).toUpperCase() ?? "A";

  function handleLogout() {
    logout();
    router.replace("/auth/login");
  }

  function isActive(href: string, exact: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* ── Sidebar ── */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex sticky top-0 h-screen overflow-y-auto">
        {/* Brand */}
        <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-5">
          <Link href="/dashboard" aria-label="Dashboard home" className="shrink-0">
            <span className="block text-2xl font-black tracking-tight">
              REVO<span className="text-blue-500">.</span>
            </span>
            <span className="mt-0.5 block text-[10px] font-semibold tracking-[0.3em] text-slate-400">
              OTOSHOP
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-1 px-3 py-4" aria-label="Dashboard navigation">
          {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon
                  size={17}
                  className={active ? "text-blue-600" : "text-slate-400"}
                  aria-hidden
                />
                {label}
              </Link>
            );
          })}

          {/* Divider */}
          <div className="my-2 border-t border-slate-100" />

          {/* Back to store */}
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            <Store size={17} className="text-slate-400" aria-hidden />
            View Store
          </Link>
        </nav>

        {/* User footer */}
        <div className="border-t border-slate-100 px-3 py-4">
          {user && (
            <div className="flex items-center gap-3 rounded-lg px-2 py-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#17365d] text-xs font-bold text-white">
                {initial}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-slate-800">
                  {user.name || user.email}
                </p>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-blue-600">
                  Admin
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                aria-label="Logout"
                className="rounded-md p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
              >
                <LogOut size={15} aria-hidden />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ── Mobile top bar ── */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center gap-3 border-b border-slate-200 bg-white px-4 lg:hidden">
        {/* Brand */}
        <Link href="/dashboard" aria-label="Dashboard home" className="shrink-0">
          <span className="block text-2xl font-black leading-none tracking-tight">
            REVO<span className="text-blue-500">.</span>
          </span>
          <span className="block text-[9px] font-semibold tracking-[0.3em] text-slate-400">
            OTOSHOP
          </span>
        </Link>

        {/* Mobile nav pills */}
        <nav
          className="flex flex-1 items-center gap-1 overflow-x-auto"
          aria-label="Dashboard navigation"
        >
          {NAV_ITEMS.map(({ href, label, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {label}
              </Link>
            );
          })}
          <Link
            href="/"
            className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Store
          </Link>
        </nav>

        {/* Mobile logout */}
        <button
          type="button"
          onClick={handleLogout}
          aria-label="Logout"
          className="shrink-0 rounded-md p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={17} aria-hidden />
        </button>
      </div>

      {/* ── Main content ── */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Spacer for mobile top bar */}
        <div className="h-14 lg:hidden" aria-hidden />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
