"use client";

import { memo, useEffect, useState } from "react";
import Link from "next/link";
import ErrorState from "@/components/ErrorState";
import { getDashboardStats, type DashboardStats } from "@/lib/api";
import { useAuth } from "@/lib/useAuth";

const rupiahFormatter = new Intl.NumberFormat("id-ID");

function formatRupiah(value: number): string {
  return `Rp ${rupiahFormatter.format(value)}`;
}

function formatDate(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-emerald-100 text-emerald-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-600",
};

function statusStyle(status: string): string {
  return STATUS_STYLES[status.toLowerCase()] ?? "bg-slate-100 text-slate-600";
}

// ─── Stat card ────────────────────────────────────────────────────────────────
const StatCard = memo(function StatCard({
  label,
  value,
  hint,
  icon,
  href,
  accent = "blue",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: string;
  href?: string;
  accent?: "blue" | "emerald" | "amber" | "rose";
}) {
  const accentMap = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
  };

  const inner = (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {label}
          </span>
          <span className="text-2xl font-bold tracking-tight text-[#17365d]">
            {value}
          </span>
          {hint && (
            <span className="text-xs text-slate-400">{hint}</span>
          )}
        </div>
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xl ${accentMap[accent]}`}
          aria-hidden="true"
        >
          {icon}
        </span>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
        {inner}
      </Link>
    );
  }

  return inner;
});

// ─── Quick action card ────────────────────────────────────────────────────────
const QuickActionCard = memo(function QuickActionCard({
  icon,
  title,
  description,
  href,
  cta,
}: {
  icon: string;
  title: string;
  description: string;
  href: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-xl">
        {icon}
      </span>
      <h3 className="mt-3 text-sm font-bold text-slate-800 group-hover:text-blue-700">
        {title}
      </h3>
      <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
      <span className="mt-3 inline-block text-xs font-semibold text-blue-600">
        {cta} →
      </span>
    </Link>
  );
});

// ─── Dashboard data ───────────────────────────────────────────────────────────
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
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-slate-200" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 rounded-xl bg-slate-200" />
          ))}
        </div>
        <div className="h-64 rounded-xl bg-slate-200" />
      </div>
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
      {/* KPI stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Products"
          value={stats.productCount}
          icon="📦"
          accent="blue"
          href="/dashboard/products"
        />
        <StatCard
          label="Categories"
          value={stats.categoryCount}
          icon="🗂️"
          accent="blue"
          href="/dashboard/categories"
        />
        <StatCard
          label="Total Orders"
          value={stats.orderCount}
          icon="🧾"
          accent="emerald"
          href="/dashboard/orders"
        />
        <StatCard
          label="Total Revenue"
          value={formatRupiah(stats.totalRevenue)}
          icon="💰"
          accent="emerald"
        />
      </div>

      {/* Secondary stats + quick actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Low Stock Items"
          value={stats.lowStockCount}
          hint="Products with ≤ 5 units remaining"
          icon="⚠️"
          accent="amber"
          href="/dashboard/products"
        />
        <QuickActionCard
          icon="🗂️"
          title="Manage Categories"
          description="Create, edit, or remove store categories."
          href="/dashboard/categories"
          cta="Go to Categories"
        />
        <QuickActionCard
          icon="📦"
          title="Manage Products"
          description="Add new products or update existing stock."
          href="/dashboard/products"
          cta="Go to Products"
        />
      </div>

      {/* Recent orders table */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#17365d]">Recent Orders</h2>
          <Link
            href="/dashboard/orders"
            className="text-sm font-semibold text-blue-600 hover:underline"
          >
            View all →
          </Link>
        </div>

        {stats.recentOrders.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white py-10 text-center text-sm text-slate-400 shadow-sm">
            No orders yet.
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3">Order</th>
                    <th className="px-5 py-3">Customer</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats.recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-3 font-mono text-xs text-slate-500">
                        <Link
                          href={`/dashboard/orders/${order.id}`}
                          className="font-semibold text-blue-600 hover:underline"
                        >
                          #{order.id}
                        </Link>
                      </td>
                      <td className="px-5 py-3 font-medium text-slate-800">
                        {order.customerName}
                      </td>
                      <td className="px-5 py-3 text-slate-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyle(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right font-semibold text-slate-800">
                        {formatRupiah(order.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Page header */}
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
          ADMIN PANEL
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#17365d] sm:text-4xl">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Overview of your store&apos;s catalog, inventory, and orders.
        </p>
      </header>

      {/* Dashboard data */}
      <DashboardContent />
    </div>
  );
}
