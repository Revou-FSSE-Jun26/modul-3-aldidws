import type { Metadata } from "next";
import Card from "@/components/Card";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "About — Revo Otoshop",
  description: "Learn about Revo Otoshop, your trusted automotive parts store.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold tracking-tight">About Revo Otoshop</h1>

      <Card className="flex flex-col gap-3">
        <p className="text-foreground/70">
          Revo Otoshop is your trusted destination for quality automotive parts
          and accessories. We curate a catalog of reliable products so you can
          keep your ride running smoothly.
        </p>
        <p className="text-foreground/70">
          This page is fully static. It contains no request-specific data, so
          Next.js prerenders it once at build time and serves the same HTML to
          everyone, instantly.
        </p>
      </Card>

      <Card className="flex flex-col gap-1">
        <h2 className="text-base font-semibold">Rendering strategy</h2>
        <span className="text-sm text-foreground/60">
          Static (prerendered at build time)
        </span>
      </Card>
    </div>
  );
}
