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
    <div className="flex flex-col gap-8">
      <EditProductForm product={product} onSubmit={setProduct} />

      {/* Delete */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <DeleteProductForm product={product} />
      </div>
    </div>
  );
}
