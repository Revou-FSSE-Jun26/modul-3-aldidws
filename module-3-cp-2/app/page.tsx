import Link from "next/link";
import { getProducts } from "@/lib/api";
import ProductCard from "@/components/ProductCard";

export default async function Home() {
  const products = await getProducts();
  const featured = products.slice(0, 3);

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome to Revo Otoshop
        </h1>
        <p className="text-foreground/60">
          Featured Products
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Featured product</h2>
          <Link href="/products" className="text-sm font-medium hover:underline">
            View all &rarr;
          </Link>
        </div>

        {featured.length === 0 ? (
          <p className="text-foreground/60">No products are available yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product) => (
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
      </section>
    </div>
  );
}
