"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Card from "@/components/ui/Card";
import ErrorState from "@/components/ui/ErrorState";
import { getMyOrders } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import type { Order } from "@/lib/types";

export default function OrdersPage() {
  const router = useRouter();
  const { status, token } = useAuth(true);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "loading" || status === "unauthenticated" || !token) {
      return;
    }

    let cancelled = false;

    async function load(authToken: string) {
      setError(null);
      setOrders(null);
      try {
        const data = await getMyOrders(authToken);
        if (!cancelled) setOrders(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load orders.",
          );
        }
      }
    }

    void load(token);

    return () => {
      cancelled = true;
    };
  }, [status, token]);

  const loading =
    status === "loading" ||
    (status === "authenticated" &&
      !!token &&
      orders === null &&
      error === null);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold tracking-tight">Orders</h1>

      {status === "loading" || loading ? (
        <p
          className="py-10 text-center text-sm text-foreground/60"
          aria-live="polite"
        >
          Loading orders…
        </p>
      ) : status === "unauthenticated" || !token ? (
        <p
          className="py-10 text-center text-sm text-foreground/60"
          aria-live="polite"
        >
          Redirecting to login…
        </p>
      ) : error ? (
        <ErrorState
          title="Failed to load orders"
          message="The orders could not be loaded. Ensure the API is running and try again."
          detail={error}
        />
      ) : !orders || orders.length === 0 ? (
        <p className="text-foreground/60">No orders yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/orders/${order.id}`}
                className="block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40"
              >
                <Card className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-semibold">Order #{order.id}</span>
                    <span className="text-sm text-foreground/60">
                      {order.customerName}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="font-bold">
                      Rp {order.total.toLocaleString("id-ID")}
                    </span>
                    <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-xs font-medium">
                      {order.status}
                    </span>
                  </div>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
