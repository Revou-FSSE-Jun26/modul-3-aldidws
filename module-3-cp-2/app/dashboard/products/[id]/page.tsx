import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProduct } from "@/lib/api";
import ProductEditSection from "@/components/dashboard/ProductEditSection";
import { ArrowLeft, ImageIcon, Tag, Package, Layers, Hash } from "lucide-react";

export async function generateMetadata({
  params,
}: PageProps<"/products/[id]">): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return { title: "Product not found — RevoShop" };
  }

  return {
    title: `${product.name} — RevoShop`,
    description:
      product.description ?? `Product details ${product.name} at RevoShop.`,
  };
}

export default async function ProductDetailPage({
  params,
}: PageProps<"/products/[id]">) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(product.price) || 0);

  const outOfStock = product.stock <= 0;

  return (
    <div className="flex flex-col gap-8">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link
          href="/dashboard/products"
          className="flex items-center gap-1.5 font-medium transition hover:text-blue-700"
        >
          <ArrowLeft size={15} />
          Products
        </Link>
        <span className="text-slate-300">/</span>
        <span className="line-clamp-1 font-semibold text-slate-800">{product.name}</span>
      </div>

      {/* Hero card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col sm:flex-row">

          {/* Image */}
          <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-slate-50 sm:w-56 md:w-72">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, 288px"
                className="object-contain p-4"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <ImageIcon size={40} className="text-slate-300" />
              </div>
            )}

            {/* Badges */}
            <div className="absolute left-3 top-3 flex flex-col gap-1.5">
              {product.is_featured && (
                <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-slate-900 shadow-sm">
                  ★ FEATURED
                </span>
              )}
              {outOfStock && (
                <span className="rounded-full bg-red-500 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-white shadow-sm">
                  SOLD OUT
                </span>
              )}
            </div>
          </div>

          {/* Meta */}
          <div className="flex flex-1 flex-col justify-between gap-4 p-6">
            <div className="flex flex-col gap-3">
              {product.brand && (
                <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                  {product.brand}
                </p>
              )}
              <h1 className="text-2xl font-black tracking-tight text-slate-900">
                {product.name}
              </h1>

              {product.description && (
                <p className="line-clamp-3 text-sm leading-relaxed text-slate-500">
                  {product.description}
                </p>
              )}

              {/* Price + stock */}
              <div>
                <p className="text-2xl font-extrabold tracking-tight text-slate-900">
                  {formattedPrice}
                </p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${outOfStock ? "bg-red-400" : "bg-emerald-500"}`} />
                  <span className={`text-xs font-medium ${outOfStock ? "text-red-500" : "text-emerald-600"}`}>
                    {outOfStock ? "Out of stock" : `${product.stock} in stock`}
                  </span>
                </div>
              </div>

              {/* Meta badges */}
              <div className="flex flex-wrap gap-2">
                {product.category && (
                  <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700">
                    <Layers size={11} />
                    {product.category}
                  </div>
                )}
                {product.sku && (
                  <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700">
                    <Hash size={11} />
                    {product.sku}
                  </div>
                )}
                <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700">
                  <Tag size={11} />
                  ID #{product.id}
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700">
                  <Package size={11} />
                  Stock: {product.stock}
                </div>
              </div>
            </div>

            <Link
              href={`/products/${product.id}`}
              target="_blank"
              className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
            >
              View in store →
            </Link>
          </div>
        </div>
      </div>

      {/* Edit + Delete */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="p-6">
          <ProductEditSection product={product} />
        </div>
      </div>

    </div>
  );
}
