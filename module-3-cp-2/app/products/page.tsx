import { getProducts } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import AddProductForm from "@/components/AddProductForm";

export default async function ProductsPage({
  searchParams,
}: PageProps<"/products">) {
  const { q } = await searchParams;
  const query = (Array.isArray(q) ? q[0] : q)?.toLowerCase().trim() ?? "";

  const products = await getProducts();
  const filtered = query
    ? products.filter((product) =>
        product.name.toLowerCase().includes(query),
      )
    : products;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-foreground/60">
        {query
          ? `Displaying  ${filtered.length} results for "${query}"`
          : `${products.length} product available`}
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
