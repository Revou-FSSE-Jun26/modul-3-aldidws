
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProduct } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import ProductEditSection from "@/components/ProductEditSection";

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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight">{product.name}</h2>
        {product.category && (
          <span className="w-fit rounded-full bg-foreground/10 px-3 py-1 text-xs font-medium">
            {product.category}
          </span>
        )}
        <p className="text-foreground/70">
          {product.description ?? "There is no description for this product."}
        </p>
      </div>

      <div className="max-w-sm">
        <ProductCard
          id={product.id}
          name={product.name}
          price={product.price}
          stock={product.stock}
          description={product.description}
        />
      </div>

      <ProductEditSection product={product} />
    </div>
  );
}
