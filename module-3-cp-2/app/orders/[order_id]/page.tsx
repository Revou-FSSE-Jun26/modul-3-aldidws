"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Card from "@/components/ui/Card";
import ErrorState from "@/components/ui/ErrorState";
import { getOrder } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import type { Order } from "@/lib/types";

export default function OrdersDetailPage() {
  const router = useRouter();
  const params = useParams<{ order_id: string }>();
  const orderId = params.order_id;
  const { status, token } = useAuth(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

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
      }
    }

    void load(token);

    return () => {
      cancelled = true;
    };
  }, [status, token, orderId]);

  const loading =
    status === "loading" ||
    (status === "authenticated" &&
      !!token &&
      order === null &&
      error === null &&
      !notFound);

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/orders"
        className="text-sm text-foreground/60 hover:underline"
      >
        &larr; Back to orders
      </Link>

      <h1 className="text-2xl font-bold tracking-tight">
        Order #{orderId}
      </h1>

      {status === "loading" || loading ? (
        <p
          className="py-10 text-center text-sm text-foreground/60"
          aria-live="polite"
        >
          Loading order…
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
              <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-xs font-medium">
                {order.status}
              </span>
            </div>
            {order.createdAt && (
              <span className="text-sm text-foreground/60">
                Placed on{" "}
                {new Date(order.createdAt).toLocaleString("id-ID")}
              </span>
            )}
            <div className="flex items-center justify-between border-t border-black/10 pt-3 dark:border-white/15">
              <span className="text-sm text-foreground/60">Total</span>
              <span className="text-lg font-bold">
                Rp {order.total.toLocaleString("id-ID")}
              </span>
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
                          {item.quantity} &times; Rp{" "}
                          {item.price.toLocaleString("id-ID")}
                        </span>
                      </div>
                      <span className="font-semibold">
                        Rp{" "}
                        {(item.price * item.quantity).toLocaleString("id-ID")}
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
