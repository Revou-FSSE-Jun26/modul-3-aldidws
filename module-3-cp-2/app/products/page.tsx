import type { Metadata } from "next";
import { getProducts } from "@/lib/api";
import ProductGrid from "@/components/ui/ProductGrid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Products" };

export default async function ProductsPage({
  searchParams,
}: PageProps<"/products">) {
  const { q, category } = await searchParams;

  const query = (Array.isArray(q) ? q[0] : q)?.trim() ?? "";
  const activeCategory =
    (Array.isArray(category) ? category[0] : category)?.trim() ?? "";

  // Forward the filters to the Flask API; getProducts also keeps an in-memory
  // fallback so the page still filters if the server ignores a param.
  const filtered = await getProducts({
    search: query,
    category: activeCategory,
  });

  return (
    <div className="flex flex-col gap-0">

      {/* ── Catalog ── */}
      <div className="mt-8 flex flex-col gap-4">
        {(query || activeCategory) && (
          <p className="text-sm font-medium text-foreground/60">
            Showing {filtered.length} result{filtered.length === 1 ? "" : "s"}
            {query ? ` for "${query}"` : ""}
            {activeCategory ? ` in ${activeCategory}` : ""}
          </p>
        )}

        {filtered.length === 0 ? (
          <p className="rounded-lg border border-black/10 px-4 py-8 text-center text-foreground/60 dark:border-white/15">
            No matching products found.
          </p>
        ) : (
          <ProductGrid products={filtered} />
        )}
      </div>

    </div>
  );
}
