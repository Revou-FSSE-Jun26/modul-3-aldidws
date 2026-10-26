"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "./Card";
import { deleteCategory } from "@/lib/api";
import { useAuth } from "@/lib/useAuth";
import type { Category } from "@/lib/types";

interface DeleteCategoryFormProps {
  category: Category;
  onDelete?: (category: Category) => void;
  onCancel?: () => void;
}

export default function DeleteCategoryForm({
  category,
  onDelete,
  onCancel,
}: DeleteCategoryFormProps) {
  const { token } = useAuth();
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentId, setCurrentId] = useState(category.id);
  if (category.id !== currentId) {
    setCurrentId(category.id);
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
      await deleteCategory(category.id, token);
      onDelete?.(category);
      setDeleted(true);
      router.push("/dashboard/categories");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
      setConfirming(false);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="border-red-500/30">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-red-600 dark:text-red-500">
              Delete Category
            </h2>
            <p className="text-sm text-foreground/70">
              Permanently remove{" "}
              <span className="font-medium text-foreground">
                {category.name}
              </span>{" "}
              from the catalog. This action cannot be undone.
            </p>
          </div>

          {deleted ? (
            <p className="text-xs text-green-600" aria-live="polite">
              Category deleted.
            </p>
          ) : confirming ? (
            <div className="flex flex-col gap-3">
              <p
                className="text-sm font-medium text-red-600 dark:text-red-500"
                aria-live="polite"
              >
                Are you sure you want to delete this category?
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={deleting}
                  className="flex-1 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deleting ? "Deleting…" : "Yes, delete"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-md border border-black/15 px-4 py-2 text-sm font-semibold hover:bg-foreground/5 dark:border-white/20"
                >
                  Cancel
                </button>
              </div>
              {error && (
                <p className="text-xs text-red-500" aria-live="polite">
                  {error}
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleRequestDelete}
                className="w-full rounded-md border border-red-500/50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-500/10 dark:text-red-500"
              >
                Delete Category
              </button>
              {error && (
                <p className="text-xs text-red-500" aria-live="polite">
                  {error}
                </p>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
