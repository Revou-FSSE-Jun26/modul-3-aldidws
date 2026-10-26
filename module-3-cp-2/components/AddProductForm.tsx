"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "./Card";
import { createProduct } from "@/lib/api";
import { useAuth } from "@/lib/useAuth";

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

const EMPTY_FORM: FormValues = {
  name: "",
  price: "",
  stock: "",
  description: "",
};

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

export default function AddProductForm() {
  const { token } = useAuth();
  const router = useRouter();
  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
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
      await createProduct(
        {
          name: values.name.trim(),
          price: Number(values.price),
          stock: Number(values.stock),
          description: values.description.trim() || undefined,
        },
        token,
      );
      setValues(EMPTY_FORM);
      setErrors({});
      router.refresh();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to create product",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Add Product</h2>

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

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-foreground px-4 py-2 text-sm font-semibold text-background hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Saving…" : "Save Product"}
          </button>
        </form>
      </Card>
    </div>
  );
}
