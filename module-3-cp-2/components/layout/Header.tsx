"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState, type FormEvent } from "react";
import {
  Search,
  ShoppingCart,
  UserRound,
  ChevronDown,
} from "lucide-react";

import { getCategories } from "@/lib/api";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";

type Category = Awaited<ReturnType<typeof getCategories>>[number];

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About Us" },
] as const;

/**
 * Tiny wrapper that reads useSearchParams() (needs Suspense) and passes
 * the current "q" value to a callback so the parent can seed the search field.
 */
function SearchParamsSync({ onParams }: { onParams: (q: string) => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    onParams(searchParams.get("q") ?? "");
  }, [searchParams, onParams]);
  return null;
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const { totalItems } = useCart();
  const { status, logout, user, isAdmin: isAdminRaw } = useAuth(true);

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const isAdmin = mounted && isAdminRaw;
  const isAuthenticated = mounted && status === "authenticated";

  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [categoriesError, setCategoriesError] = useState(false);

  // Ref for click-outside detection (#1)
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const categoryMenuRef = useRef<HTMLDivElement>(null);

  // Load categories
  useEffect(() => {
    let cancelled = false;
    async function loadCategories() {
      try {
        const data = await getCategories();
        if (!cancelled) {
          setCategories(data);
          setCategoriesError(false);
        }
      } catch (error) {
        console.error("Failed to load categories:", error);
        if (!cancelled) setCategoriesError(true);
      }
    }
    loadCategories();
    return () => { cancelled = true; };
  }, []);

  // Close dropdown on navigation
  useEffect(() => {
    setCategoriesOpen(false);
  }, [pathname]);

  // #1 — Close dropdown when clicking outside both the trigger and the panel
  useEffect(() => {
    if (!categoriesOpen) return;
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      const insideTrigger = categoryDropdownRef.current?.contains(target);
      const insidePanel = categoryMenuRef.current?.contains(target);
      if (!insideTrigger && !insidePanel) {
        setCategoriesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [categoriesOpen]);

  // #5 — Close dropdown on Escape key
  useEffect(() => {
    if (!categoriesOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setCategoriesOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [categoriesOpen]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) {
      router.push("/products");
      return;
    }
    router.push(`/products?q=${encodeURIComponent(query)}`);
  }

  // #3 — Logout with redirect
  function handleLogout() {
    logout();
    router.replace("/auth/login");
  }

  function getCategoryHref(categoryName: string) {
    return `/products?category=${encodeURIComponent(categoryName)}`;
  }

  function isActiveRoute(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  function linkClass(href: string) {
    const active = isActiveRoute(href);
    return `whitespace-nowrap text-sm font-medium transition-colors ${
      active ? "text-blue-700" : "text-slate-600 hover:text-blue-700"
    }`;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white text-slate-800 shadow-sm relative">
      {/* Sync search query from URL params without blocking the header render */}
      <Suspense fallback={null}>
        <SearchParamsSync onParams={setSearchQuery} />
      </Suspense>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        {/* Main row */}
        <div className="flex min-h-[76px] items-center gap-3 lg:gap-4">

          {/* Brand */}
          <Link href="/" aria-label="Revo Otoshop Home" className="shrink-0">
            <span className="block text-2xl font-black tracking-tight">
              REVO<span className="text-blue-500">.</span>
            </span>
            <span className="mt-0.5 block text-[10px] font-semibold tracking-[0.3em] text-slate-400">
              OTOSHOP
            </span>
          </Link>

          {/* Category mega-menu trigger — ref attached for click-outside (#1) */}
          <div
            ref={categoryDropdownRef}
            className="relative hidden shrink-0 sm:block"
          >
            <button
              type="button"
              onClick={() => setCategoriesOpen((open) => !open)}
              aria-expanded={categoriesOpen}
              aria-haspopup="true"
              aria-controls="header-category-menu"
              className="flex items-center gap-2 rounded-lg bg-blue-700 px-3 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 sm:px-4"
            >
              Categories
              <ChevronDown
                size={16}
                className={`transition-transform ${categoriesOpen ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            role="search"
            className="flex min-w-0 flex-1 items-center overflow-hidden rounded-lg border border-slate-300 bg-slate-50 transition focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100"
          >
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, brands, or categories..."
              aria-label="Search products"
              className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 sm:px-4"
            />
            <button
              type="submit"
              aria-label="Search"
              className="flex shrink-0 self-stretch items-center justify-center w-11 bg-amber-400 text-slate-900 transition hover:bg-amber-500 sm:w-12"
            >
              <Search size={19} />
            </button>
          </form>

          {/* Desktop nav */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-4 lg:flex xl:gap-5"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActiveRoute(link.href) ? "page" : undefined}
                className={linkClass(link.href)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Account (desktop) */}
          <div className="hidden shrink-0 sm:block">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <Link
                    href="/dashboard"
                    className={`whitespace-nowrap text-sm font-semibold transition-colors ${
                      isActiveRoute("/dashboard")
                        ? "text-blue-700"
                        : "text-slate-600 hover:text-blue-700"
                    }`}
                  >
                    Dashboard
                  </Link>
                )}
                <Link
                  href="/profile"
                  aria-label="My account"
                  className="flex items-center gap-2 text-sm font-medium text-slate-700 transition hover:text-blue-700"
                >
                  <UserRound size={19} />
                  <span className="max-w-24 truncate">
                    {user?.name || user?.email || "My Account"}
                  </span>
                </Link>
                {/* #3 — logout now redirects */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-sm font-medium text-slate-500 transition hover:text-red-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-slate-700 transition hover:text-blue-700"
              >
                <UserRound size={19} />
                <span>Login / Register</span>
              </Link>
            )}
          </div>

          {/* Cart (desktop only) — hidden for admin, hidden on mobile (mobile nav has its own cart link) */}
          {!isAdmin && (
            <Link
              href="/cart"
              aria-label={`Shopping cart, ${totalItems} item${totalItems !== 1 ? "s" : ""}`}
              className="relative hidden sm:flex shrink-0 items-center justify-center rounded-lg border border-slate-200 p-3 text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              <ShoppingCart size={21} />
              {totalItems > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white"
                >
                  {totalItems}
                </span>
              )}
            </Link>
          )}
        </div>

        {/* Desktop nav secondary row (sm only, not lg — lg uses inline nav above) */}
        <nav
          aria-label="Tablet navigation"
          className="hidden items-center gap-5 overflow-x-auto border-t border-slate-100 py-3 sm:flex lg:hidden"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActiveRoute(link.href) ? "page" : undefined}
              className={linkClass(link.href)}
            >
              {link.label}
            </Link>
          ))}

          {isAuthenticated ? (
            <>
              <Link href="/profile" className={linkClass("/profile")}>
                My Account
              </Link>
              {isAdmin && (
                <Link href="/dashboard" className={linkClass("/dashboard")}>
                  Dashboard
                </Link>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="whitespace-nowrap text-sm font-medium text-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/auth/login" className={linkClass("/auth/login")}>
              Login / Register
            </Link>
          )}
        </nav>

      </div>

      {/* ── Mega menu — full-width, absolutely below header, sm+ only ── */}
      {categoriesOpen && (
        <div
          ref={categoryMenuRef}
          id="header-category-menu"
          role="menu"
          className="absolute left-0 right-0 top-full z-50 hidden border-t border-slate-200 bg-white shadow-2xl sm:block"
        >
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
            {categoriesError ? (
              <p className="text-sm text-red-600" role="alert">
                Unable to load categories. Please try again later.
              </p>
            ) : categories.length === 0 ? (
              /* Skeleton */
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="h-9 animate-pulse rounded-lg bg-slate-100" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={getCategoryHref(category.name)}
                    role="menuitem"
                    className="flex items-center rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="mt-4 border-t border-slate-100 pt-4">
              <Link
                href="/categories"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 transition hover:text-blue-800"
              >
                View all categories →
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
