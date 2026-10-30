"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, LayoutGrid, LayoutDashboard, ShoppingCart, UserRound, X } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import { getCategories } from "@/lib/api";

type Category = Awaited<ReturnType<typeof getCategories>>[number];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems } = useCart();
  const { status, logout, isAdmin: isAdminRaw } = useAuth(true);

  const [mounted, setMounted] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  // For swipe-to-close
  const sheetRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);

  useEffect(() => { setMounted(true); }, []);

  // Close sheet on route change
  useEffect(() => { setSheetOpen(false); }, [pathname]);

  // Load categories lazily on first open
  useEffect(() => {
    if (!sheetOpen || categories.length > 0) return;
    setCategoriesLoading(true);
    getCategories()
      .then(setCategories)
      .catch(() => {})
      .finally(() => setCategoriesLoading(false));
  }, [sheetOpen, categories.length]);

  // Lock body scroll when sheet is open
  useEffect(() => {
    document.body.style.overflow = sheetOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sheetOpen]);

  const isAdmin = mounted && isAdminRaw;
  const isAuthenticated = mounted && status === "authenticated";

  function handleLogout() {
    logout();
    router.replace("/auth/login");
  }

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  function itemClass(active: boolean) {
    return `flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors ${
      active ? "text-blue-700" : "text-slate-500"
    }`;
  }

  function getCategoryHref(categoryName: string) {
    return `/products?category=${encodeURIComponent(categoryName)}`;
  }

  // Swipe down to close
  function onTouchStart(e: React.TouchEvent) {
    touchStartY.current = e.touches[0].clientY;
  }
  function onTouchEnd(e: React.TouchEvent) {
    const delta = e.changedTouches[0].clientY - touchStartY.current;
    if (delta > 60) setSheetOpen(false);
  }

  const iconSize = 22;

  return (
    <>
      {/* ── Bottom nav bar — phones only (< md) ───────────────── */}
      <nav
        aria-label="Mobile bottom navigation"
        className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-slate-200 bg-white px-2 md:hidden"
      >
        <Link href="/" className={itemClass(isActive("/"))}>
          <Home size={iconSize} />
          <span>Home</span>
        </Link>

        <div
          role="button"
          tabIndex={0}
          onClick={() => setSheetOpen(true)}
          onKeyDown={(e) => e.key === "Enter" && setSheetOpen(true)}
          className={`cursor-pointer select-none ${itemClass(sheetOpen || isActive("/categories"))}`}
          aria-label="Open categories"
          aria-expanded={sheetOpen}
        >
          <LayoutGrid size={iconSize} />
          <span>Categories</span>
        </div>

        {isAdmin ? (
          <Link href="/dashboard" className={itemClass(isActive("/dashboard"))}>
            <LayoutDashboard size={iconSize} />
            <span>Dashboard</span>
          </Link>
        ) : (
          <Link href="/cart" aria-label={`Cart (${totalItems})`} className={itemClass(isActive("/cart"))}>
            <span className="relative">
              <ShoppingCart size={iconSize} />
              {totalItems > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white"
                >
                  {totalItems}
                </span>
              )}
            </span>
            <span>Cart</span>
          </Link>
        )}

        {isAuthenticated ? (
          <Link href="/profile" className={itemClass(isActive("/profile"))}>
            <UserRound size={iconSize} />
            <span>Account</span>
          </Link>
        ) : (
          <Link href="/auth/login" className={itemClass(isActive("/auth/login"))}>
            <UserRound size={iconSize} />
            <span>Login</span>
          </Link>
        )}
      </nav>

      {/* ── Backdrop ───────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        onClick={() => setSheetOpen(false)}
        className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 md:hidden ${
          sheetOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* ── Category bottom sheet ──────────────────────────────── */}
      <div
        ref={sheetRef}
        aria-label="Categories"
        aria-hidden={!sheetOpen}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className={`fixed bottom-0 left-0 right-0 z-[70] flex max-h-[75vh] flex-col rounded-t-2xl bg-white shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          sheetOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-slate-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-800">All Categories</h2>
          <button
            type="button"
            onClick={() => setSheetOpen(false)}
            aria-label="Close categories"
            className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        {/* Category grid */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {categoriesLoading ? (
            <div className="grid grid-cols-3 gap-2">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="h-10 animate-pulse rounded-lg bg-slate-100" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <p className="py-4 text-center text-sm text-slate-500">No categories found.</p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={getCategoryHref(cat.name)}
                  className="flex items-center justify-center rounded-lg border border-slate-200 px-2 py-2.5 text-center text-xs font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 active:bg-blue-100"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Footer link */}
        <div className="border-t border-slate-100 px-5 py-3">
          <Link
            href="/categories"
            className="flex w-full items-center justify-center rounded-lg bg-slate-50 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
          >
            View all categories →
          </Link>
        </div>
      </div>
    </>
  );
}
