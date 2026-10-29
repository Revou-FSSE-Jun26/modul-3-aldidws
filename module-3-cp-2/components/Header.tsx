"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  Search,
  ShoppingCart,
  UserRound,
  ChevronDown,
} from "lucide-react";

import { getCategories } from "@/lib/api";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/useAuth";

type Category = Awaited<ReturnType<typeof getCategories>>[number];

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About Us" },
] as const;

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { totalItems } = useCart();
  const { status, logout, user, isAdmin: isAdminRaw } = useAuth(true);

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const isAdmin = mounted && isAdminRaw;
  const isAuthenticated = mounted && status === "authenticated";

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") ?? "");
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [categoriesError, setCategoriesError] = useState(false);

  // Ref for click-outside detection (#1)
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

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

  // Sync search with URL
  useEffect(() => {
    setSearchQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  // #1 — Close dropdown when clicking outside
  useEffect(() => {
    if (!categoriesOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(e.target as Node)
      ) {
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
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white text-slate-800 shadow-sm">
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

          {/* Category dropdown — ref attached for click-outside (#1) */}
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

            {categoriesOpen && (
              <div
                id="header-category-menu"
                role="menu"
                className="absolute left-0 top-full mt-2 max-h-96 w-64 overflow-y-auto rounded-xl border border-slate-200 bg-white py-2 shadow-xl"
              >
                <Link
                  href="/categories"
                  role="menuitem"
                  className="block border-b border-slate-100 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 hover:text-blue-700"
                >
                  All Categories
                </Link>

                {categoriesError ? (
                  <p className="px-4 py-3 text-sm text-red-600" role="alert">
                    Unable to load categories. Please try again later.
                  </p>
                ) : categories.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-slate-500">
                    Loading categories…
                  </p>
                ) : (
                  categories.map((category) => (
                    <Link
                      key={category.id}
                      href={getCategoryHref(category.name)}
                      role="menuitem"
                      className="block px-4 py-3 text-sm text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
                    >
                      {category.name}
                    </Link>
                  ))
                )}
              </div>
            )}
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

          {/* Cart (desktop) — hidden for admin */}
          {!isAdmin && (
            <Link
              href="/cart"
              aria-label={`Shopping cart, ${totalItems} item${totalItems !== 1 ? "s" : ""}`}
              className="relative flex shrink-0 items-center justify-center rounded-lg border border-slate-200 p-3 text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
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

        {/* Mobile nav */}
        <nav
          aria-label="Mobile navigation"
          className="flex items-center gap-5 overflow-x-auto border-t border-slate-100 py-3 lg:hidden"
        >
          <Link href="/categories" className={linkClass("/categories")}>
            Categories
          </Link>

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

          {/* Cart link on mobile — hidden for admin */}
          {!isAdmin && (
            <Link
              href="/cart"
              aria-label={`Cart (${totalItems})`}
              className="relative flex items-center gap-1.5 whitespace-nowrap text-sm font-medium text-slate-600 transition hover:text-blue-700"
            >
              <ShoppingCart size={15} />
              <span>Cart</span>
              {totalItems > 0 && (
                <span
                  aria-hidden="true"
                  className="flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white"
                >
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {isAuthenticated ? (
            <>
              <Link href="/profile" className={linkClass("/profile")}>
                My Account
              </Link>
              {isAdmin && (
                <Link
                  href="/dashboard"
                  className={linkClass("/dashboard")}
                >
                  Dashboard
                </Link>
              )}
              {/* #3 — logout redirects on mobile too */}
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
    </header>
  );
}
