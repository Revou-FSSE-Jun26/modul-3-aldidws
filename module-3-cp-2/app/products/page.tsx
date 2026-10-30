import Link from "next/link";
import { getProducts } from "@/lib/api";
import ProductCard from "@/components/ui/ProductCard";
import HeroSlider from "@/components/ui/HeroSlider";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * Group products by category, preserving the backend's first-appearance
 * order so featured/popular products keep their natural ordering. Products
 * without a category land in an "Uncategorized" group that is always rendered
 * last so named categories come first.
 */
function groupProductsByCategory(
  products: Product[],
): { category: string; products: Product[] }[] {
  const order: string[] = [];
  const buckets = new Map<string, Product[]>();

  for (const product of products) {
    const category = product.category?.trim() || "Uncategorized";
    if (!buckets.has(category)) {
      buckets.set(category, []);
      order.push(category);
    }
    buckets.get(category)!.push(product);
  }

  const uncategorizedIndex = order.indexOf("Uncategorized");
  if (uncategorizedIndex !== -1) {
    order.splice(uncategorizedIndex, 1);
    order.push("Uncategorized");
  }

  return order.map((category) => ({
    category,
    products: buckets.get(category)!,
  }));
}

export default async function ProductsPage({
  searchParams,
}: PageProps<"/products">) {
  const { q, category } = await searchParams;

  const query = (Array.isArray(q) ? q[0] : q)?.toLowerCase().trim() ?? "";
  const activeCategory =
    (Array.isArray(category) ? category[0] : category)?.trim() ?? "";

  const products = await getProducts();

  const filtered = products.filter((product) => {
    const matchesQuery = query
      ? product.name.toLowerCase().includes(query) ||
        (product.description ?? "").toLowerCase().includes(query)
      : true;

    const matchesCategory = activeCategory
      ? product.category === activeCategory
      : true;

    return matchesQuery && matchesCategory;
  });

  const grouped = groupProductsByCategory(filtered);

  return (
    <div className="flex flex-col gap-0">

      {/* ── Hero slider ── */}
      <HeroSlider productCount={products.length} />

      {/* ── Catalog ── */}
      <div className="mt-8 flex flex-col gap-4">
        {(query || activeCategory) && (
          <p className="text-sm font-medium text-foreground/60">
            Showing {filtered.length} result{filtered.length === 1 ? "" : "s"}
            {query ? ` for "${query}"` : ""}
            {activeCategory ? ` in ${activeCategory}` : ""}
          </p>
        )}

        {grouped.length === 0 ? (
          <p className="rounded-lg border border-black/10 px-4 py-8 text-center text-foreground/60 dark:border-white/15">
            No matching products found.
          </p>
        ) : (
          grouped.map((group) => (
            // Full-bleed each category section (header + scroll row together)
            // so the section header aligns with the first card at the same
            // px-4 sm:px-6 inset on every breakpoint, and the row reaches the
            // viewport edges with no side whitespace.
            <section
              key={group.category}
              className="mt-8"
              style={{
                width: "100vw",
                marginLeft: "calc(-50vw + 50%)",
              }}
            >
              {/* Section header — padded so it aligns with the first card */}
              <div className="px-4 sm:px-6">
                <div className="flex items-center justify-between gap-4 mb-3">
                  <h2 className="text-lg font-bold tracking-tight text-slate-900">
                    {group.category}
                  </h2>
                  <Link
                    href={`/products?category=${encodeURIComponent(group.category)}`}
                    className="shrink-0 text-sm font-semibold text-sky-600 hover:text-sky-700"
                  >
                    View all →
                  </Link>
                </div>
              </div>

              {/* Horizontal scroll row of fixed-width cards */}
              <div className="snap-x snap-mandatory overflow-x-auto pb-3">
                <ol className="flex gap-4 px-4 sm:px-6">
                  {group.products.map((product) => (
                    <li
                      key={product.id}
                      className="w-52 shrink-0 snap-start"
                    >
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
                      />
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          ))
        )}
      </div>

    </div>
  );
}
