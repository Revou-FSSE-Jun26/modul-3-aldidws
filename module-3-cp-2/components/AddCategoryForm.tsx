"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createCategory } from "@/lib/api";
import { useAuth } from "@/lib/useAuth";

interface FormValues {
  name: string;
  description: string;
  imageUrl: string;
}

interface FormErrors {
  name?: string;
}

const EMPTY_FORM: FormValues = {
  name: "",
  description: "",
  imageUrl: "",
};

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) {
    errors.name = "The category name is required.";
  }
  return errors;
}

export default function AddCategoryForm() {
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
    if (Object.keys(nextErrors).length > 0) return;

    if (!token) {
      setSubmitError("You must be signed in.");
      return;
    }

    setSubmitting(true);
    try {
      await createCategory(
        {
          name: values.name.trim(),
          description: values.description.trim() || undefined,
          imageUrl: values.imageUrl.trim() || undefined,
        },
        token,
      );
      setValues(EMPTY_FORM);
      setErrors({});
      toast.success("Category created");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create category";
      setSubmitError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "rounded-lg border border-slate-300 bg-background px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:focus:border-blue-400";
  const labelClass = "text-sm font-medium text-foreground/80";
  const fieldClass = "flex flex-col gap-1.5";

  return (
    <div className="flex flex-col gap-2">
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-foreground">Add New Category</h2>
        <p className="text-xs text-foreground/50">Fill in category details below</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-2 flex flex-col gap-6">
        {/* Section card */}
        <section className="rounded-xl border border-slate-300 bg-background p-5 shadow-sm dark:border-slate-600">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-foreground/40">
            Basic Information
          </h3>

          <div className="flex flex-col gap-4">
            {/* Name */}
            <div className={fieldClass}>
              <label htmlFor="add-category-name" className={labelClass}>
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                id="add-category-name"
                name="name"
                placeholder="e.g. Engine Parts"
                value={values.name}
                onChange={handleChange}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "add-category-name-error" : undefined}
                required
                className={inputClass}
              />
              {errors.name && (
                <p id="add-category-name-error" className="flex items-center gap-1 text-xs text-red-500" role="alert">
                  <span aria-hidden>⚠</span> {errors.name}
                </p>
              )}
            </div>

            {/* Description */}
            <div className={fieldClass}>
              <label htmlFor="add-category-description" className={labelClass}>
                Description{" "}
                <span className="font-normal text-foreground/40">(optional)</span>
              </label>
              <textarea
                id="add-category-description"
                name="description"
                placeholder="Brief category description…"
                value={values.description}
                onChange={handleChange}
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Image URL */}
            <div className={fieldClass}>
              <label htmlFor="add-category-imageUrl" className={labelClass}>
                Image URL{" "}
                <span className="font-normal text-foreground/40">(optional)</span>
              </label>
              <input
                id="add-category-imageUrl"
                name="imageUrl"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={values.imageUrl}
                onChange={handleChange}
                className={inputClass}
              />
              {values.imageUrl && (
                <div className="mt-1 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={values.imageUrl}
                    alt="Category preview"
                    className="h-32 w-full object-contain bg-slate-50 p-2 dark:bg-slate-900"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Submit error */}
        {submitError && (
          <div
            className="flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-700 dark:bg-red-950 dark:text-red-400"
            role="alert"
          >
            <span aria-hidden>⚠</span> {submitError}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
                </svg>
                Saving…
              </>
            ) : (
              "Save Category"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
