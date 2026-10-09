import Link from "next/link";
import { getCategories, getProducts } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import AddProductForm from "@/components/AddProductForm";

export default async function ProductsPage({
  searchParams,
}: PageProps<"/products">) {
  const { q, category } = await searchParams;
  const query = (Array.isArray(q) ? q[0] : q)?.toLowerCase().trim() ?? "";
  const activeCategory =
    (Array.isArray(category) ? category[0] : category)?.trim() ?? "";

  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const filtered = products.filter((product) => {
    const matchesQuery = query
      ? product.name.toLowerCase().includes(query)
      : true;
    const matchesCategory = activeCategory
      ? product.category === activeCategory
      : true;
    return matchesQuery && matchesCategory;
  });

  const buildHref = (categoryName?: string) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (categoryName) params.set("category", categoryName);
    const qs = params.toString();
    return qs ? `/products?${qs}` : "/products";
  };

  const chipClass = (active: boolean) =>
    `rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
      active
        ? "border-foreground bg-foreground text-background"
        : "border-black/15 text-foreground/70 hover:bg-foreground/10 dark:border-white/20"
    }`;

  return (
    <div className="flex flex-col gap-4">
      {/* Category filter */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        <Link href={buildHref()} className={chipClass(activeCategory === "")}>
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={buildHref(cat.name)}
            aria-current={activeCategory === cat.name ? "true" : undefined}
            className={chipClass(activeCategory === cat.name)}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <p className="text-sm text-foreground/60">
        {query || activeCategory
          ? `Showing ${filtered.length} result${filtered.length === 1 ? "" : "s"}${
              query ? ` for "${query}"` : ""
            }${activeCategory ? ` in ${activeCategory}` : ""}`
          : `${products.length} products available`}
      </p>

      {filtered.length === 0 ? (
        <p className="rounded-lg border border-black/10 px-4 py-8 text-center text-foreground/60 dark:border-white/15">
          No matching products found.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              stock={product.stock}
              description={product.description}
            />
          ))}
        </div>
      )}

      <section className="mt-6 border-t border-black/10 pt-6 dark:border-white/15">
        <AddProductForm />
      </section>
    </div>
  );
}
