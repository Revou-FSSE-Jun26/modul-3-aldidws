"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ErrorState from "@/components/ui/ErrorState";
import { getAdminOrders } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import type { Order } from "@/lib/types";

const rupiahFormatter = new Intl.NumberFormat("id-ID");

function formatRupiah(value: number): string {
  return `Rp ${rupiahFormatter.format(value)}`;
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
  return STATUS_STYLES[status.toLowerCase()] ?? "bg-foreground/10 text-foreground/70";
}

export default function DashboardOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    async function load(authToken: string) {
      setLoading(true);
      setError(null);
      try {
        const data = await getAdminOrders(authToken);
        if (!cancelled) setOrders(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load orders.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load(token);

    return () => { cancelled = true; };
  }, [token]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
        {orders && (
          <p className="text-sm text-foreground/50">
            {orders.length} order{orders.length !== 1 ? "s" : ""} total
          </p>
        )}
      </div>

      {loading ? (
        <p className="py-10 text-center text-sm text-foreground/60" aria-live="polite">
          Loading orders…
        </p>
      ) : error ? (
        <ErrorState
          title="Failed to load orders"
          message="The orders could not be loaded. Ensure the API is running and try again."
          detail={error}
        />
      ) : !orders || orders.length === 0 ? (
        <p className="rounded-lg border border-black/10 px-4 py-8 text-center text-foreground/60 dark:border-white/15">
          No orders yet.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/dashboard/orders/${order.id}`}
                className="group block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
              >
                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-background p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold">Order #{order.id}</span>
                    {order.orderNumber && (
                      <span className="text-xs text-foreground/50">{order.orderNumber}</span>
                    )}
                    <span className="px-5 py-3 font-medium text-slate-800">{order.customerName}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="font-bold">{formatRupiah(order.total)}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
