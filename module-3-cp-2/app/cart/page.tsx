"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Card from "@/components/ui/Card";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";

export default function CartPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clear } =
    useCart();
  const { status } = useAuth();
  const router = useRouter();

  function handleCheckout() {
    if (status !== "authenticated") {
      router.push(`/auth/login?redirect=${encodeURIComponent("/checkout")}`);
      return;
    }
    router.push("/checkout");
  }

  function handleRemove(id: number | string) {
    removeItem(id);
    toast.success("Item removed");
  }

  function handleClear() {
    clear();
    toast.success("Cart cleared");
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Cart</h1>
        {items.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
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
          <Card className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/10 text-left text-foreground/60 dark:border-white/15">
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Qty</th>
                  <th className="px-4 py-3 text-right font-medium">Subtotal</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-black/5 last:border-b-0 dark:border-white/10"
                  >
                    <td className="px-4 py-3 font-semibold">{item.name}</td>
                    <td className="px-4 py-3 text-foreground/60">
                      Rp {item.price.toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex w-fit items-center rounded-md border border-black/15 dark:border-white/20">
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
                          disabled={item.stock != null && item.quantity >= item.stock}
                          aria-label={`Increase quantity of ${item.name}`}
                          className="px-3 py-1 text-lg leading-none disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemove(item.id)}
                        aria-label={`Remove ${item.name} from cart`}
                        className="text-sm font-medium text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Card className="flex items-center justify-between">
            <span className="text-sm text-foreground/60">
              {totalItems} item{totalItems === 1 ? "" : "s"}
            </span>
            <span className="text-lg font-bold">
              Total: Rp {totalPrice.toLocaleString("id-ID")}
            </span>
          </Card>
        </>
      )}

      <button
        type="button"
        onClick={handleCheckout}
        disabled={items.length === 0}
        className="rounded-md bg-foreground px-4 py-3 text-center text-sm font-semibold text-background hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Proceed to checkout
      </button>
    </div>
  );
}
