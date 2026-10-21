"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";

export default function ProfilePage() {
  const { status, user } = useAuth(true);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <p className="text-foreground/60">Loading your profile...</p>;
  }

  if (status === "unauthenticated" || !user) {
    return <p className="text-foreground/60">Loading your profile...</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-foreground/60">Name</span>
          <span className="font-medium">{user.name}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm text-foreground/60">Email</span>
          <span className="font-medium">{user.email}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm text-foreground/60">Role</span>
          <span className="font-medium">{user.role}</span>
        </div>
      </section>
    </div>
  );
}
