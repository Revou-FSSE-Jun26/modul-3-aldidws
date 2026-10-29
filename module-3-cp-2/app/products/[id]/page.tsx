import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ProductDetailActions from "./ProductDetailActions";
import AdminProductActions from "./AdminProductActions";
import { getProducts, getProduct, type CacheOptions } from "@/lib/api";

export const revalidate = 120;

export async function generateStaticParams() {
try {
const products = await getProducts({ cache: "force-cache" });
return products.map((product) => ({ id: String(product.id) }));
} catch {
return [];
}
}

const productCache = (id: string): CacheOptions => ({
  revalidate: 120,
  tags: ["products", `product:${id}`],
});

export async function generateMetadata({
  params,
}: PageProps<"/products/[id]">): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id, productCache(id));

  if (!product) {
    return { title: "Product not found — Revo Otoshop" };
  }

  return {
    title: `${product.name} — Revo Otoshop`,
    description:
      product.description ??
      `Product details for ${product.name} at Revo Otoshop.`,
  };
}

export default async function ProductDetailPage({
params,
}: PageProps<"/products/[id]">) {
const { id } = await params;
const product = await getProduct(id, productCache(id));

if (!product) {
notFound();
}

const price = Number(product.price);

const formattedPrice = new Intl.NumberFormat("id-ID", {
style: "currency",
currency: "IDR",
maximumFractionDigits: 0,
}).format(price);

// Product type currently uses imageUrl and category.
const imageUrl = product.imageUrl;

return (
<main className="min-h-screen bg-slate-50 px-4 py-8 text-foreground sm:px-6 lg:px-8">
<div className="mx-auto max-w-7xl">
  {/* Breadcrumb */}
  <nav className="mb-8 text-sm text-slate-500" aria-label="Breadcrumb">
    <Link href="/" className="hover:text-blue-600">
      Home
    </Link>
    <span className="mx-2">›</span>
    <Link href="/products" className="hover:text-blue-600">
      Products
    </Link>
    <span className="mx-2">›</span>
    <span className="text-[#17365d] font-medium">
      {product.name}
    </span>
  </nav>

  {/* Product detail */}
  <section className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-10">

    {/* Main image */}
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl border-2 border-[#17365d]/20 bg-white p-4 shadow-[0_4px_24px_rgba(23,54,93,0.12)] sm:p-8">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain p-4 sm:p-8"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">
            Product image not available
          </div>
        )}
      </div>

      <p className="mt-3 text-center text-xs text-slate-400">
        Revo Otoshop product image
      </p>
    </div>

    {/* Product information */}
    <div className="flex flex-col gap-5">

      {/* Info card */}
      <div className="rounded-2xl border-2 border-[#17365d]/20 bg-white p-6 shadow-[0_4px_24px_rgba(23,54,93,0.10)]">

        {product.category && (
          <span className="inline-block w-fit rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 mb-4">
            {product.category}
          </span>
        )}

        <h1 className="text-2xl font-bold leading-tight tracking-tight text-[#17365d] sm:text-3xl">
          {product.name}
        </h1>

        <p
          className={`mt-3 flex items-center gap-2 text-sm font-semibold ${
            product.stock > 0 ? "text-emerald-600" : "text-red-600"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              product.stock > 0 ? "bg-emerald-500" : "bg-red-500"
            }`}
          />
          {product.stock > 0 ? "In Stock" : "Out of Stock"}
        </p>

        <div className="mt-5 border-y-2 border-[#17365d]/15 py-5">
          <p className="text-3xl font-bold text-[#17365d]">
            {formattedPrice}
          </p>
        </div>

        {/* Quantity selector and cart button */}
        <div className="mt-5">
          <ProductDetailActions
            id={product.id}
            name={product.name}
            price={price}
            stock={product.stock}
          />
        </div>
      </div>

      {/* Description card */}
      <div className="overflow-hidden rounded-2xl border-2 border-[#17365d]/20 bg-white shadow-[0_4px_24px_rgba(23,54,93,0.10)]">
        <div className="border-b-2 border-[#17365d]/15 bg-[#17365d]/[0.03] px-5 py-4">
          <h2 className="text-base font-bold text-[#17365d]">
            Description
          </h2>
        </div>
        <div className="px-5 py-4">
          <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
            {product.description ||
              "No description available for this product."}
          </p>
        </div>
      </div>

      {/* Admin-only actions */}
          <AdminProductActions product={product} />
        </div>
      </section>
    </div>
  </main>
);
}