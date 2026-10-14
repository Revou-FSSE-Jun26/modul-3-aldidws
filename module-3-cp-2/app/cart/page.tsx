"use client";

import Link from "next/link";
import Card from "@/components/Card";
import { useCart } from "@/lib/cart";

export default function CartPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clear } =
    useCart();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Cart</h1>
        {items.length > 0 && (
          <button
            type="button"
            onClick={clear}
            className="text-sm font-medium text-red-500 hover:underline"
          >
            Clear cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 py-10 text-center">
          <p className="text-foreground/60">Your cart is empty.</p>
          <Link
            href="/products"
            className="rounded-md bg-foreground px-4 py-2 text-sm font-semibold text-background hover:opacity-90"
          >
            Browse products
          </Link>
        </Card>
      ) : (
        <>
          <ul className="flex flex-col gap-3">
            {items.map((item) => (
              <li key={item.id}>
                <Card className="flex items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="font-semibold">{item.name}</span>
                    <span className="text-sm text-foreground/60">
                      Rp {item.price.toLocaleString("id-ID")}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center rounded-md border border-black/15 dark:border-white/20">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        aria-label={`Reduce quantity of ${item.name}`}
                        className="px-3 py-1 text-lg leading-none"
                      >
                        &minus;
                      </button>
                      <span className="min-w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        aria-label={`Increase quantity of ${item.name}`}
                        className="px-3 py-1 text-lg leading-none"
                      >
                        +
                      </button>
                    </div>

                    <span className="w-28 text-right font-semibold">
                      Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                    </span>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${item.name} from cart`}
                      className="text-sm font-medium text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </Card>
              </li>
            ))}
          </ul>

          <Card className="flex items-center justify-between">
            <span className="text-sm text-foreground/60">
              {totalItems} item{totalItems === 1 ? "" : "s"}
            </span>
            <span className="text-lg font-bold">
              Total: Rp {totalPrice.toLocaleString("id-ID")}
            </span>
          </Card>

          <Link
            href="/checkout"
            className="rounded-md bg-foreground px-4 py-3 text-center text-sm font-semibold text-background hover:opacity-90"
          >
            Proceed to checkout
          </Link>
        </>
      )}
    </div>
  );
}
