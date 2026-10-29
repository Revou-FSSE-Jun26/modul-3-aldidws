"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Thin client wrapper that hides its children on specific routes.
 * Used to conditionally show/hide Header and Footer without putting
 * them inside a Suspense boundary (which causes usePathname to return
 * null on the initial server render).
 */
export function ConditionalHeader({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDashboard =
    pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  if (isDashboard) return null;
  return <>{children}</>;
}

export function ConditionalFooter({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDashboard =
    pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  if (isDashboard) return null;
  return <>{children}</>;
}

/**
 * Wraps page content with the standard max-width/padding shell for public
 * pages. Dashboard pages opt out because DashboardShell provides its own
 * full-bleed layout.
 */
export function ConditionalMain({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDashboard =
    pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  if (isDashboard) {
    // Render children directly — DashboardShell owns the layout
    return <>{children}</>;
  }

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
      {children}
    </main>
  );
}
