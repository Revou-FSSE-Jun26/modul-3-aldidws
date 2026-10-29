"use client";


import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface AdminGuardProps {
  children: ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const { status, isAdmin } = useAuth(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/login");
    } else if (status === "authenticated" && !isAdmin) {
      router.replace("/");
    }
  }, [status, isAdmin, router]);

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

  if (status !== "authenticated" || !isAdmin) {
    return null;
  }

  return <>{children}</>;
}
