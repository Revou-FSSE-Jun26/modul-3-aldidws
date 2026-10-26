"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "./Card";
import { updateProduct } from "@/lib/api";
import { useAuth } from "@/lib/useAuth";
import type { Product } from "@/lib/types";

interface FormValues {
  name: string;
  price: string;
  stock: string;
  description: string;
}

interface FormErrors {
  name?: string;
  price?: string;
  stock?: string;
}

interface EditProductFormProps {
  product: Product;
  onSubmit?: (product: Product) => void;
  onCancel?: () => void;
}

function toFormValues(product: Product): FormValues {
  return {
    name: product.name,
    price: String(product.price),
    stock: String(product.stock),
    description: product.description ?? "",
  };
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.name.trim()) {
    errors.name = "The product name is required.";
  }

  const price = Number(values.price);
  if (values.price.trim() === "") {
    errors.price = "The price field is mandatory.";
  } else if (Number.isNaN(price) || price <= 0) {
    errors.price = "Price must be a number greater than 0.";
  }

  const stock = Number(values.stock);
  if (values.stock.trim() === "") {
    errors.stock = "The stock field is mandatory.";
  } else if (!Number.isInteger(stock) || stock < 0) {
    errors.stock = "Stock must be an integer of 0 or greater.";
  }

  return errors;
}

export default function EditProductForm({
  product,
  onSubmit,
  onCancel,
}: EditProductFormProps) {
  const { token } = useAuth();
  const router = useRouter();
  const [values, setValues] = useState<FormValues>(() =>
    toFormValues(product),
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [saved, setSaved] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Reset the form during render when a different product is passed in,
  // instead of synchronising with an effect.
  const [currentId, setCurrentId] = useState(product.id);
  if (product.id !== currentId) {
    setCurrentId(product.id);
    setValues(toFormValues(product));
    setErrors({});
    setSaved(false);
    setSubmitError(null);
  }

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    if (!token) {
      setSubmitError("You must be signed in.");
      return;
    }

    setSubmitting(true);
    try {
      const updatedProduct = await updateProduct(
        product.id,
        {
          name: values.name.trim(),
          price: Number(values.price),
          stock: Number(values.stock),
          description: values.description.trim() || undefined,
        },
        token,
      );
      onSubmit?.(updatedProduct);
      setErrors({});
      setSaved(true);
      router.refresh();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to update product",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Edit Product</h2>

          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              name="name"
              value={values.name}
              onChange={handleChange}
              aria-invalid={Boolean(errors.name)}
              className="rounded-md border border-black/15 bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40 dark:border-white/20"
            />
            {errors.name && (
              <p className="text-xs text-red-500" aria-live="polite">
                {errors.name}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="price" className="text-sm font-medium">
                Price
              </label>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                value={values.price}
                onChange={handleChange}
                aria-invalid={Boolean(errors.price)}
                className="rounded-md border border-black/15 bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40 dark:border-white/20"
              />
              {errors.price && (
                <p className="text-xs text-red-500" aria-live="polite">
                  {errors.price}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="stock" className="text-sm font-medium">
                Stock
              </label>
              <input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={values.stock}
                onChange={handleChange}
                aria-invalid={Boolean(errors.stock)}
                className="rounded-md border border-black/15 bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40 dark:border-white/20"
              />
              {errors.stock && (
                <p className="text-xs text-red-500" aria-live="polite">
                  {errors.stock}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="description" className="text-sm font-medium">
              Description (optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={values.description}
              onChange={handleChange}
              rows={3}
              className="rounded-md border border-black/15 bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40 dark:border-white/20"
            />
          </div>

          {submitError && (
            <p className="text-xs text-red-500" aria-live="polite">
              {submitError}
            </p>
          )}

          {saved && (
            <p className="text-xs text-green-600" aria-live="polite">
              Changes saved.
            </p>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-md bg-foreground px-4 py-2 text-sm font-semibold text-background hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Saving…" : "Save Changes"}
            </button>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="rounded-md border border-black/15 px-4 py-2 text-sm font-semibold hover:bg-foreground/5 dark:border-white/20"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
