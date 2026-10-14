"use client";


import type { ReactNode } from "react";
import Link from "next/link";
import Card from "@/components/Card";
import { useAuth } from "@/lib/useAuth";

interface AdminGuardProps {
  children: ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { status, isAdmin } = useAuth(true);

  if (status === "loading") {
    return (
      <div
        className="flex min-h-[40vh] items-center justify-center text-sm text-foreground/60"
        aria-live="polite"
      >
        Checking access…
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <Card className="mx-auto flex max-w-md flex-col items-center gap-3 py-10 text-center">
        <h1 className="text-xl font-bold">Sign in required</h1>
        <p className="text-sm text-foreground/60">
          You need to be signed in as an administrator to view this page.
        </p>
        <Link
          href="/auth/login"
          className="rounded-md bg-foreground px-4 py-2 text-sm font-semibold text-background hover:opacity-90"
        >
          Go to login
        </Link>
      </Card>
    );
  }

  if (!isAdmin) {
    return (
      <Card className="mx-auto max-w-md">
        <div
          role="alert"
          className="flex flex-col items-center gap-3 py-10 text-center"
        >
          <h1 className="text-xl font-bold text-red-600 dark:text-red-400">
            Access denied
          </h1>
          <p className="text-sm text-foreground/60">
            This area is restricted to administrators. Your account does not
            have the required permissions.
          </p>
          <Link
            href="/"
            className="rounded-md border border-black/15 px-4 py-2 text-sm font-semibold hover:bg-foreground/5 dark:border-white/20"
          >
            Back to home
          </Link>
        </div>
      </Card>
    );
  }

  return <>{children}</>;
}
