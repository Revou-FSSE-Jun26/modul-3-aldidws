"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/Card";
import ErrorState from "@/components/ErrorState";
import { getAdminOrders } from "@/lib/api";
import { useAuth } from "@/lib/useAuth";
import type { Order } from "@/lib/types";

const rupiahFormatter = new Intl.NumberFormat("id-ID");

function formatRupiah(value: number): string {
  return `Rp ${rupiahFormatter.format(value)}`;
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
          setError(
            err instanceof Error ? err.message : "Failed to load orders.",
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
        <p className="text-sm text-foreground/60">
          Customer orders with recipient and shipping details.
        </p>
      </div>

      {loading ? (
        <p
          className="py-10 text-center text-sm text-foreground/60"
          aria-live="polite"
        >
          Loading orders…
        </p>
      ) : error ? (
        <ErrorState
          title="Failed to load orders"
          message="The orders could not be loaded. Ensure the API is running and try again."
          detail={error}
        />
      ) : !orders || orders.length === 0 ? (
        <Card className="py-8 text-center text-sm text-foreground/60">
          No orders yet.
        </Card>
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/10 text-foreground/60 dark:border-white/15">
              <tr>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Recipient</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Shipping address</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const cityLine = [order.shippingCity, order.shippingProvince]
                  .filter(Boolean)
                  .join(", ");
                return (
                  <tr
                    key={order.id}
                    className="border-b border-black/5 align-top last:border-0 dark:border-white/10"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/dashboard/orders/${order.id}`}
                        className="font-mono font-medium hover:underline"
                      >
                        #{order.id}
                      </Link>
                      {order.orderNumber && (
                        <div className="text-xs text-foreground/50">
                          {order.orderNumber}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {order.recipientName ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      {order.recipientPhone ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="max-w-xs">
                        <div>{order.shippingAddress ?? "—"}</div>
                        {cityLine && (
                          <div className="text-xs text-foreground/50">
                            {cityLine}
                            {order.shippingPostalCode
                              ? ` ${order.shippingPostalCode}`
                              : ""}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-xs font-medium capitalize">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {formatRupiah(order.total)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
