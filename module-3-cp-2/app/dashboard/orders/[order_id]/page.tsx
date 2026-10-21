"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Card from "@/components/Card";
import ErrorState from "@/components/ErrorState";
import { getOrder } from "@/lib/api";
import { useAuth } from "@/lib/useAuth";
import type { Order } from "@/lib/types";

const rupiahFormatter = new Intl.NumberFormat("id-ID");

function formatRupiah(value: number): string {
  return `Rp ${rupiahFormatter.format(value)}`;
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs uppercase tracking-wide text-foreground/50">
        {label}
      </span>
      <span className="text-sm">{value && value.trim() ? value : "—"}</span>
    </div>
  );
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
          setError(
            err instanceof Error ? err.message : "Failed to load order.",
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
  }, [token, orderId]);

  const cityLine = order
    ? [order.shippingCity, order.shippingProvince, order.shippingPostalCode]
        .filter(Boolean)
        .join(", ")
    : "";

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
        {order?.orderNumber && (
          <span className="text-sm text-foreground/60">
            {order.orderNumber}
          </span>
        )}
      </div>

      {loading ? (
        <p
          className="py-10 text-center text-sm text-foreground/60"
          aria-live="polite"
        >
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
        <div className="flex flex-col gap-4">
          <Card className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{order.customerName}</span>
              <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-xs font-medium capitalize">
                {order.status}
              </span>
            </div>
            {order.createdAt && (
              <span className="text-sm text-foreground/60">
                Placed on {new Date(order.createdAt).toLocaleString("id-ID")}
              </span>
            )}
            <div className="flex items-center justify-between border-t border-black/10 pt-3 dark:border-white/15">
              <span className="text-sm text-foreground/60">Total</span>
              <span className="text-lg font-bold">
                {formatRupiah(order.total)}
              </span>
            </div>
          </Card>

          <Card className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Recipient &amp; shipping</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DetailRow label="Recipient name" value={order.recipientName} />
              <DetailRow label="Recipient phone" value={order.recipientPhone} />
              <div className="sm:col-span-2">
                <DetailRow
                  label="Shipping address"
                  value={order.shippingAddress}
                />
              </div>
              {cityLine && (
                <div className="sm:col-span-2">
                  <DetailRow label="City / province / postal" value={cityLine} />
                </div>
              )}
              {order.customerNote && (
                <div className="sm:col-span-2">
                  <DetailRow label="Customer note" value={order.customerNote} />
                </div>
              )}
            </div>
          </Card>

          {order.items && order.items.length > 0 && (
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold">Items</h2>
              <ul className="flex flex-col gap-2">
                {order.items.map((item) => (
                  <li key={item.productId}>
                    <Card className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="font-medium">{item.productName}</span>
                        <span className="text-sm text-foreground/60">
                          {item.quantity} &times; {formatRupiah(item.price)}
                        </span>
                      </div>
                      <span className="font-semibold">
                        {formatRupiah(item.price * item.quantity)}
                      </span>
                    </Card>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
