import ProductCard from "@/components/ui/ProductCard";
import type { Product } from "@/lib/types";

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div
      data-testid="product-grid"
      className="grid grid-cols-2 gap-3 lg:grid-cols-4"
    >
      {products.map((product) => (
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
  );
}
