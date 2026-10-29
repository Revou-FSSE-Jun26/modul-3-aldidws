"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { deleteProduct } from "@/lib/api";
import { useAuth } from "@/lib/useAuth";
import type { Product } from "@/lib/types";

interface DeleteProductFormProps {
  product: Product;
  onDelete?: (product: Product) => void;
  onCancel?: () => void;
}

export default function DeleteProductForm({
  product,
  onDelete,
  onCancel,
}: DeleteProductFormProps) {
  const { token } = useAuth();
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentId, setCurrentId] = useState(product.id);
  if (product.id !== currentId) {
    setCurrentId(product.id);
    setConfirming(false);
    setDeleted(false);
    setError(null);
  }

  function handleRequestDelete() {
    setConfirming(true);
  }

  function handleCancel() {
    setConfirming(false);
    onCancel?.();
  }

  async function handleConfirmDelete() {
    setError(null);

    if (!token) {
      setError("You must be signed in.");
      return;
    }

    setDeleting(true);
    try {
      await deleteProduct(product.id, token);
      onDelete?.(product);
      setDeleted(true);
      toast.success("Product deleted");
      router.push("/dashboard/products");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Delete failed";
      setError(message);
      toast.error(message);
      setConfirming(false);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-base font-bold text-foreground">Delete Product</h2>
          <p className="text-xs text-foreground/50">Permanently remove this product from the catalog</p>
        </div>
      </div>

      {/* Card */}
      <div className="mt-2 rounded-xl border border-red-300/60 bg-background p-5 shadow-sm dark:border-red-800/50">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-foreground/40">
          Danger Zone
        </h3>

        <p className="mb-5 text-sm text-foreground/70">
          You are about to permanently delete{" "}
          <span className="font-semibold text-foreground">{product.name}</span>.
          This action <span className="font-semibold text-red-600 dark:text-red-500">cannot be undone</span>.
        </p>

        {deleted ? (
          <p className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400" aria-live="polite">
            <span aria-hidden>✓</span> Product deleted successfully.
          </p>
        ) : confirming ? (
          <div className="flex flex-col gap-4">
            <p
              className="flex items-center gap-2 rounded-lg border border-red-300/60 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-800/50 dark:bg-red-950 dark:text-red-400"
              aria-live="polite"
            >
              <span aria-hidden>⚠</span> Are you sure you want to delete this product?
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
                    </svg>
                    Deleting…
                  </>
                ) : (
                  "Yes, delete product"
                )}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold transition hover:bg-foreground/5 dark:border-slate-600"
              >
                Cancel
              </button>
            </div>
            {error && (
              <div
                className="flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-700 dark:bg-red-950 dark:text-red-400"
                role="alert"
              >
                <span aria-hidden>⚠</span> {error}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handleRequestDelete}
              className="flex w-full items-center justify-center rounded-xl border border-red-400/60 px-6 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-500/10 dark:border-red-700 dark:text-red-500"
            >
              Delete Product
            </button>
            {error && (
              <div
                className="flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-700 dark:bg-red-950 dark:text-red-400"
                role="alert"
              >
                <span aria-hidden>⚠</span> {error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
