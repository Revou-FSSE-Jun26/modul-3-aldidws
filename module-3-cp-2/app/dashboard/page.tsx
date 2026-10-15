"use client";

import { memo, useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/Card";
import ErrorState from "@/components/ErrorState";
import { getDashboardStats, type DashboardStats } from "@/lib/api";
import { useAuth } from "@/lib/useAuth";

const rupiahFormatter = new Intl.NumberFormat("id-ID");

function formatRupiah(value: number): string {
  return `Rp ${rupiahFormatter.format(value)}`;
}

const StatCard = memo(function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <Card className="flex flex-col gap-1">
      <span className="text-sm text-foreground/60">{label}</span>
      <span className="text-2xl font-bold tracking-tight">{value}</span>
      {hint ? (
        <span className="text-xs text-foreground/50">{hint}</span>
      ) : null}
    </Card>
  );
});

const QuickLinkCard = memo(function QuickLinkCard({
  title,
  description,
  href,
  label,
}: {
  title: string;
  description: string;
  href: string;
  label: string;
}) {
  return (
    <Card className="flex items-center justify-between gap-3">
      <div className="flex flex-col">
        <span className="text-sm text-foreground/60">{title}</span>
        <span className="text-xs text-foreground/50">{description}</span>
      </div>
      <Link
        href={href}
        className="rounded-md bg-foreground px-4 py-2 text-sm font-semibold text-background hover:opacity-90"
      >
        {label}
      </Link>
    </Card>
  );
});

function DashboardContent() {
  const { token } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    async function load(authToken: string) {
      setLoading(true);
      setError(null);
      try {
        const data = await getDashboardStats(authToken);
        if (!cancelled) setStats(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load dashboard data.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load(token);

    return () => {
      cancelled = true;
    };
  }, [token]);

  if (loading) {
    return (
      <p
        className="py-10 text-center text-sm text-foreground/60"
        aria-live="polite"
      >
        Loading dashboard…
      </p>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load dashboard"
        message="The dashboard data could not be loaded. Ensure the API is running and try again."
        detail={error}
      />
    );
  }

  if (!stats) return null;

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Products" value={stats.productCount} />
        <StatCard label="Categories" value={stats.categoryCount} />
        <StatCard label="Orders" value={stats.orderCount} />
        <StatCard
          label="Total revenue"
          value={formatRupiah(stats.totalRevenue)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Low stock items"
          value={stats.lowStockCount}
          hint="Products with 5 or fewer in stock"
        />
        <QuickLinkCard
          title="Manage categories"
          description="Review store categories"
          href="/categories"
          label="Categories"
        />
        <QuickLinkCard
          title="Manage catalog"
          description="Add or review products"
          href="/dashboard/products"
          label="Products"
        />
      </div>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent orders</h2>
          <Link
            href="/dashboard/orders"
            className="text-sm font-medium hover:underline"
          >
            View all &rarr;
          </Link>
        </div>

        {stats.recentOrders.length === 0 ? (
          <Card className="py-8 text-center text-sm text-foreground/60">
            No orders yet.
          </Card>
        ) : (
          <Card className="overflow-x-auto p-0">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-black/10 text-foreground/60 dark:border-white/15">
                <tr>
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-black/5 last:border-0 dark:border-white/10"
                  >
                    <td className="px-4 py-3 font-mono">#{order.id}</td>
                    <td className="px-4 py-3">{order.customerName}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-xs font-medium capitalize">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {formatRupiah(order.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </section>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-foreground/60">
          Overview of your store&apos;s catalog and orders.
        </p>
      </div>

      <DashboardContent />
    </div>
  );
}
