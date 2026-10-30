import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories, getCategory, getProducts } from "@/lib/api";
import ProductCard from "@/components/ui/ProductCard";
export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const categories = await getCategories({ cache: "force-cache" });
    return categories.map((category) => ({
      categories_id: String(category.id),
    }));
  } catch {
    return [];
  }
}

export default async function CategoriesDetailPage({
  params,
}: PageProps<"/categories/[categories_id]">) {
  const { categories_id } = await params;

  const [category, allProducts] = await Promise.all([
    getCategory(categories_id),
    getProducts(),
  ]);

  if (!category) {
    notFound();
  }

  const products = allProducts.filter(
    (p) => p.category?.trim() === category.name.trim(),
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Back link */}
      <Link
        href="/categories"
        className="text-sm text-foreground/60 hover:underline"
      >
        &larr; Back to categories
      </Link>

      {/* Category header */}
      <div className="flex flex-col gap-1">
        <p className="text-xs font-bold uppercase tracking-widest text-sky-600">
          Category
        </p>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-sm text-slate-500">{category.description}</p>
        )}
        <p className="text-sm text-slate-400">
          {products.length} product{products.length === 1 ? "" : "s"}
        </p>
      </div>

      {/* Product grid — vertical layout */}
      {products.length === 0 ? (
        <p className="rounded-lg border border-black/10 px-4 py-8 text-center text-foreground/60">
          No products in this category yet.
        </p>
      ) : (
        <ol className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {products.map((product) => (
            <li key={product.id}>
              <ProductCard
                id={product.id}
                name={product.name}
                price={product.price}
                stock={product.stock}
                description={product.description}
                brand={product.brand}
                sku={product.sku}
                image_url={product.imageUrl}
                is_featured={product.is_featured}
                imageSizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              />
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
