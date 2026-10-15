"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/useAuth";

const emptySubscribe = () => () => {};

function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/categories", label: "Categories" },
  { href: "/orders", label: "Orders" },
] as const;

export default function Header() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { isAdmin, status, logout } = useAuth();

  const mounted = useMounted();
  const isAuthenticated = mounted && status === "authenticated";
  const showLogout = isAuthenticated && isAdmin;

  const linkClass = (active: boolean) =>
    `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      active
        ? "bg-foreground text-background"
        : "text-foreground/70 hover:bg-foreground/10 hover:text-foreground"
    }`;

  return (
    <header className="border-b border-black/10 dark:border-white/15">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          Revo Otoshop
        </Link>

        <nav aria-label="Primary">
          <ul className="flex items-center gap-1">
            <li>
              {showLogout ? (
                <button
                  type="button"
                  onClick={logout}
                  className={linkClass(false)}
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/auth/login"
                  aria-current={pathname.startsWith("/auth/login") ? "page" : undefined}
                  className={linkClass(pathname.startsWith("/auth/login"))}
                >
                  Login
                </Link>
              )}
            </li>
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={linkClass(isActive)}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
            {mounted && isAdmin && (
              <li>
                <Link
                  href="/dashboard"
                  aria-current={
                    pathname.startsWith("/dashboard") ? "page" : undefined
                  }
                  className={linkClass(pathname.startsWith("/dashboard"))}
                >
                  Dashboard
                </Link>
              </li>
            )}
            <li>
              <Link
                href="/cart"
                aria-current={pathname.startsWith("/cart") ? "page" : undefined}
                className={`relative ${linkClass(pathname.startsWith("/cart"))}`}
              >
                Cart
                {mounted && totalItems > 0 && (
                  <span className="ml-1 inline-flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-semibold text-white">
                    {totalItems}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
