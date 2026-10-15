"use client";

import { useState } from "react";
import Card from "./Card";
import type { Category } from "@/lib/types";

interface FormValues {
  name: string;
  description: string;
}

interface FormErrors {
  name?: string;
}

const EMPTY_FORM: FormValues = {
  name: "",
  description: "",
};

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.name.trim()) {
    errors.name = "The category name is required.";
  }

  return errors;
}

export default function AddCategoryForm() {
  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [categories, setCategories] = useState<Category[]>([]);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const newCategory: Category = {
      id: Date.now(),
      name: values.name.trim(),
      description: values.description.trim() || undefined,
    };

    setCategories((prev) => [...prev, newCategory]);
    setValues(EMPTY_FORM);
    setErrors({});
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Add Category</h2>

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

          <button
            type="submit"
            className="w-full rounded-md bg-foreground px-4 py-2 text-sm font-semibold text-background hover:opacity-90"
          >
            Save Category
          </button>
        </form>
      </Card>

      {categories.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-foreground/70">
            Category added ({categories.length})
          </h3>
          <ul className="flex flex-col gap-2">
            {categories.map((category) => (
              <li key={category.id}>
                <Card className="flex items-center justify-between py-3">
                  <span className="font-medium">{category.name}</span>
                  {category.description && (
                    <span className="text-sm text-foreground/60">
                      {category.description}
                    </span>
                  )}
                </Card>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
