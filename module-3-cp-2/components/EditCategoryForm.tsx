"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Card from "./Card";
import { updateCategory } from "@/lib/api";
import { useAuth } from "@/lib/useAuth";
import type { Category } from "@/lib/types";

interface FormValues {
  name: string;
  description: string;
}

interface FormErrors {
  name?: string;
}

interface EditCategoryFormProps {
  category: Category;
  onSubmit?: (category: Category) => void;
  onCancel?: () => void;
}

function toFormValues(category: Category): FormValues {
  return {
    name: category.name,
    description: category.description ?? "",
  };
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.name.trim()) {
    errors.name = "The category name is required.";
  }

  return errors;
}

export default function EditCategoryForm({
  category,
  onSubmit,
  onCancel,
}: EditCategoryFormProps) {
  const { token } = useAuth();
  const router = useRouter();
  const [values, setValues] = useState<FormValues>(() =>
    toFormValues(category),
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [saved, setSaved] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Reset the form during render when a different category is passed in,
  // instead of synchronising with an effect.
  const [currentId, setCurrentId] = useState(category.id);
  if (category.id !== currentId) {
    setCurrentId(category.id);
    setValues(toFormValues(category));
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
      const updatedCategory = await updateCategory(
        category.id,
        {
          name: values.name.trim(),
          description: values.description.trim() || undefined,
        },
        token,
      );
      onSubmit?.(updatedCategory);
      setErrors({});
      setSaved(true);
      toast.success("Category updated");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update category";
      setSubmitError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Edit Category</h2>

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
