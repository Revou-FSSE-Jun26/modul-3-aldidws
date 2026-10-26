"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import Card from "./Card";
import { useCart } from "@/lib/cart";

export interface ProductCardProps {
  id: number | string;
  name: string;
  price: number;
  stock: number;
  description?: string;
  currency?: string;
  linkToDetail?: boolean;
}

export default function ProductCard({
  id,
  name,
  price,
  stock,
  description = "No description available.",
  currency = "Rp",
  linkToDetail = true,
}: ProductCardProps) {
  const isOutOfStock = stock <= 0;

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const decrease = () => setQuantity((q) => Math.max(1, q - 1));
  const increase = () => setQuantity((q) => Math.min(stock, q + 1));

  const formattedPrice = `${currency} ${price.toLocaleString("id-ID")}`;

  function handleAddToCart() {
    addItem({ id, name, price }, quantity);
    toast.success(`${name} added to cart`);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        {linkToDetail ? (
          <Link
            href={`/products/${id}`}
            className="text-base font-semibold hover:underline"
          >
            {name}
          </Link>
        ) : (
          <h3 className="text-base font-semibold">{name}</h3>
        )}
        <p className="line-clamp-2 text-sm text-foreground/60">{description}</p>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-lg font-bold">{formattedPrice}</span>
        <span
          className={`text-xs font-medium ${
            isOutOfStock ? "text-red-500" : "text-foreground/50"
          }`}
        >
          {isOutOfStock ? "Out of stock" : `Stock: ${stock}`}
        </span>
      </div>

      {/* Quantity stepper — hidden entirely when out of stock. */}
      {!isOutOfStock && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-foreground/70">Qty</span>
          <div className="flex items-center rounded-md border border-black/15 dark:border-white/20">
            <button
              type="button"
              onClick={decrease}
              disabled={quantity <= 1}
              aria-label="Reduce the quantity"
              className="px-3 py-1 text-lg leading-none disabled:opacity-40"
            >
              &minus;
            </button>
            <span
              aria-live="polite"
              className="min-w-8 text-center text-sm font-medium"
            >
              {quantity}
            </span>
            <button
              type="button"
              onClick={increase}
              disabled={quantity >= stock}
              aria-label="Increase quantity"
              className="px-3 py-1 text-lg leading-none disabled:opacity-40"
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* Conditional rendering: a disabled grey "Out of Stock" button when
          stock is zero, otherwise an active "Add to Cart" button. */}
      <button
        type="button"
        disabled={isOutOfStock}
        onClick={handleAddToCart}
        className={`mt-1 w-full rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
          isOutOfStock
            ? "cursor-not-allowed bg-gray-300 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
            : added
              ? "bg-green-600 text-white"
              : "bg-foreground text-background hover:opacity-90"
        }`}
      >
        {isOutOfStock
          ? "Out of Stock"
          : added
            ? "Added \u2713"
            : `Add to Cart (${quantity})`}
      </button>
    </Card>
  );
}
