"use client";

import { useState } from "react";
import EditProductForm from "@/components/dashboard/EditProductForm";
import DeleteProductForm from "@/components/dashboard/DeleteProductForm";
import type { Product } from "@/lib/types";

interface ProductEditSectionProps {
  product: Product;
}

export default function ProductEditSection({ product: initialProduct }: ProductEditSectionProps) {
  const [product, setProduct] = useState<Product>(initialProduct);

  return (
    <section className="mt-6 flex flex-col border-t border-black/10 pt-6 dark:border-white/15">
      <EditProductForm product={product} onSubmit={setProduct} />
      <div className="mt-16 border-t border-black/10 pt-10 dark:border-white/15">
        <DeleteProductForm product={product} />
      </div>
    </section>
  );
}
