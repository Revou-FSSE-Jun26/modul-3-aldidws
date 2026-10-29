"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ErrorState from "@/components/ErrorState";
import { getOrder } from "@/lib/api";
import { useAuth } from "@/lib/useAuth";
import type { Order } from "@/lib/types";

const rupiahFormatter = new Intl.NumberFormat("id-ID");

function formatRupiah(value: number): string {
  return `Rp ${rupiahFormatter.format(value)}`;
}

const STATUS_STYLES: Record<string, string> = {
  pending:   "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  paid:      "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  shipped:   "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400",
  delivered: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
};

function statusStyle(status: string): string {
  return STATUS_STYLES[status.toLowerCase()] ?? "bg-foreground/10 text-foreground/70";
}

export default function DashboardOrderDetailPage() {
  const params = useParams<{ order_id: string }>();
  const orderId = params.order_id;
  const { token } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    async function load(authToken: string) {
      setLoading(true);
      setError(null);
      setOrder(null);
      setNotFound(false);
      try {
        const data = await getOrder(orderId, authToken);
        if (cancelled) return;
        if (!data) {
          setNotFound(true);
        } else {
          setOrder(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load order.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load(token);

    return () => { cancelled = true; };
  }, [token, orderId]);

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/dashboard/orders"
        className="text-sm text-foreground/60 hover:underline"
      >
        &larr; Back to orders
      </Link>

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Order #{orderId}</h1>
      </div>

      {loading ? (
        <p className="py-10 text-center text-sm text-foreground/60" aria-live="polite">
          Loading order…
        </p>
      ) : error ? (
        <ErrorState
          title="Failed to load order"
          message="The order could not be loaded. Ensure the API is running and try again."
          detail={error}
        />
      ) : notFound || !order ? (
        <ErrorState
          title="Order not found"
          message="This order does not exist or you do not have access to it."
        />
      ) : (
        <div className="flex flex-col gap-6">
          {/* Order summary card */}
          <section className="rounded-xl border border-slate-200 bg-background p-5 shadow-sm dark:border-slate-700">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-foreground/40">
              Order Summary
            </h2>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/60">Customer</span>
                <span className="font-semibold">{order.customerName}</span>
              </div>

              {order.orderNumber && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground/60">Order number</span>
                  <span className="text-sm font-medium">{order.orderNumber}</span>
                </div>
              )}

              {order.createdAt && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground/60">Placed on</span>
                  <span className="text-sm">
                    {new Date(order.createdAt).toLocaleString("id-ID")}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/60">Status</span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyle(order.status)}`}>
                  {order.status}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-black/10 pt-3 dark:border-white/15">
                <span className="text-sm text-foreground/60">Total</span>
                <span className="text-lg font-bold">{formatRupiah(order.total)}</span>
              </div>
            </div>
          </section>

          {/* Order items */}
          {order.items && order.items.length > 0 && (
            <section className="flex flex-col gap-3">
              <h2 className="text-xs font-bold uppercase tracking-widest text-foreground/40">
                Items
              </h2>
              <ul className="flex flex-col gap-2">
                {order.items.map((item) => (
                  <li
                    key={item.productId}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-background p-4 shadow-sm dark:border-slate-700"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium">{item.productName}</span>
                      <span className="text-sm text-foreground/60">
                        {item.quantity} &times; {formatRupiah(item.price)}
                      </span>
                    </div>
                    <span className="font-semibold">
                      {formatRupiah(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
