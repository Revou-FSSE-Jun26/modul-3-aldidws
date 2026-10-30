"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { ShoppingCart, Eye } from "lucide-react";

export interface ProductCardProps {
  id: number | string;
  name: string;
  price: number | string;
  stock: number;
  description?: string;
  brand?: string;
  sku?: string;
  image_url?: string | null;
  is_featured?: boolean;
  showCartButton?: boolean;
  detailHref?: string;
  imageSizes?: string;
}

export default function ProductCard({
  id,
  name,
  price,
  stock,
  description,
  brand,
  sku,
  image_url,
  is_featured,
  showCartButton = true,
  detailHref,
  imageSizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { status } = useAuth();

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const isAuthenticated = mounted && status === "authenticated";

  const numericPrice = Number(price) || 0;
  const productUrl = detailHref ?? `/products/${id}`;
  const outOfStock = stock <= 0;

  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(numericPrice);

  function handleAddToCart() {
    if (outOfStock) {
      toast.error("Product is out of stock");
      return;
    }
    addItem({ id, name, price: numericPrice }, quantity);
    toast.success(`${name} added to cart`);
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:border-slate-200">

      {/* ── Image ── */}
      <Link
        href={productUrl}
        aria-label={`View details of ${name}`}
        className="relative block aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100"
      >
        {image_url && (image_url.startsWith("http://") || image_url.startsWith("https://") || image_url.startsWith("/")) ? (
          <Image
            src={image_url}
            alt={name}
            fill
            sizes={imageSizes}
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-[1.07]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-xs text-slate-400">No image</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {is_featured && (
            <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-slate-900 shadow-sm">
              ★ FEATURED
            </span>
          )}
          {outOfStock && (
            <span className="rounded-full bg-red-500/90 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-white shadow-sm">
              SOLD OUT
            </span>
          )}
        </div>
      </Link>

      {/* ── Info ── */}
      <div className="flex flex-1 flex-col gap-1 p-3">

        {/* Brand */}
        {brand && (
          <p className="text-[10px] font-bold uppercase tracking-widest text-sky-600">
            {brand}
          </p>
        )}

        {/* Name */}
        <Link href={productUrl} className="group/name">
          <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug text-slate-800 transition-colors group-hover/name:text-sky-700">
            {name}
          </h3>
        </Link>

        {/* Price + stock */}
        <div className="mt-auto pt-2">
          <p className="text-base font-extrabold text-slate-900 tracking-tight">
            {formattedPrice}
          </p>
          <div className="mt-0.5 flex items-center gap-1.5">
            <span
              className={`inline-block h-1.5 w-1.5 rounded-full ${
                outOfStock ? "bg-red-400" : "bg-emerald-500"
              }`}
            />
            <span
              className={`text-[11px] font-medium ${
                outOfStock ? "text-red-500" : "text-emerald-600"
              }`}
            >
              {outOfStock ? "Out of stock" : "In stock"}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-3 space-y-2">
          {/* Primary: View Product */}
          <Link
            href={productUrl}
            className="flex h-8 w-full items-center justify-center gap-1.5 rounded-lg bg-sky-600 text-[12px] font-semibold text-white transition hover:bg-sky-700 active:scale-95"
          >
            <Eye className="h-3.5 w-3.5" />
            View Product
          </Link>

          {/* Secondary: Cart / Login */}
          {showCartButton && (
            isAuthenticated ? (
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={outOfStock}
                className="flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 text-[12px] font-semibold text-slate-700 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 active:scale-95"
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                {outOfStock ? "Out of Stock" : "Add to Cart"}
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="flex h-8 w-full items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-[12px] font-semibold text-slate-600 transition hover:bg-slate-100 active:scale-95"
              >
                Login to buy
              </Link>
            )
          )}
        </div>
      </div>
    </article>
  );
}
