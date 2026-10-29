import { getProducts } from "@/lib/api";
import ProductCard from "@/components/ui/ProductCard";
import HeroSlider from "@/components/ui/HeroSlider";

export const dynamic = "force-dynamic";

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

      {filtered.length === 0 ? (
        <p className="rounded-lg border border-black/10 px-4 py-8 text-center text-foreground/60 dark:border-white/15">
          No matching products found.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
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
          ))}
        </div>
      )}
    </div>

  </div>
)}