"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import DeleteProductForm from "@/components/dashboard/DeleteProductForm";
import EditProductForm from "@/components/dashboard/EditProductForm";
import type { Product } from "@/lib/types";

interface AdminProductActionsProps {
  product: Product;
}

export default function AdminProductActions({
  product,
}: AdminProductActionsProps) {
  const { isAdmin } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isAdmin) return null;

  return (
    <section className="mt-6 border-t border-black/10 pt-6 dark:border-white/15">
      <EditProductForm product={product} />
      <DeleteProductForm product={product} />
    </section>
  );
}
