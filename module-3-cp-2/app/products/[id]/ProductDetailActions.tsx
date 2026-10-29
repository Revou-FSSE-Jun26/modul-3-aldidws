"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useCart } from "@/hooks/useCart";

interface ProductDetailActionsProps {
id: number | string;
name: string;
price: number;
stock: number;
}

export default function ProductDetailActions({
id,
name,
price,
stock,
}: ProductDetailActionsProps) {
const [quantity, setQuantity] = useState(1);
const [added, setAdded] = useState(false);
const { addItem } = useCart();

const isOutOfStock = stock <= 0;

function handleAddToCart() {
if (isOutOfStock) {
toast.error("Product is out of stock");
return;
}

addItem({ id, name, price }, quantity);
toast.success(`${name} added to cart`);

setAdded(true);
window.setTimeout(() => setAdded(false), 1500);

}

return (
<div className="flex flex-col gap-4">
<div>
<label className="mb-2 block text-sm font-medium">
Quantity
</label>

    <div className="flex h-11 w-fit items-center overflow-hidden rounded-lg border border-slate-300 bg-white dark:border-slate-700">
      <button
        type="button"
        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
        disabled={isOutOfStock || quantity <= 1}
        aria-label="Decrease quantity"
        className="h-full w-11 text-lg bg-white text-slate-800 hover:bg-slate-100 disabled:opacity-30"
      >
        −
      </button>

      <span
        aria-live="polite"
        className="min-w-12 bg-white text-center text-sm font-semibold text-slate-800"
      >
        {quantity}
      </span>

      <button
        type="button"
        onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
        disabled={isOutOfStock || quantity >= stock}
        aria-label="Increase quantity"
        className="h-full w-11 text-lg bg-white text-slate-800 hover:bg-slate-100 disabled:opacity-30"
      >
        +
      </button>
    </div>
  </div>

  <button
    type="button"
    onClick={handleAddToCart}
    disabled={isOutOfStock}
    className={`flex min-h-12 w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition ${
      isOutOfStock
        ? "cursor-not-allowed bg-slate-200 text-slate-400"
        : added
          ? "bg-emerald-600 text-white"
          : "bg-blue-700 text-white hover:bg-blue-800"
    }`}
  >
    {isOutOfStock
      ? "Out of Stock"
      : added
        ? "Added to Cart ✓"
        : "🛒 Add to Cart"}
  </button>
</div>

);
}