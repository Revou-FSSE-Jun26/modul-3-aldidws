"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { updateProduct, getCategories, type ProductFitmentInput } from "@/lib/api";
import { useAuth } from "@/lib/useAuth";
import {
  VEHICLE_DATA,
  CAR_BRANDS,
  type VehicleSeries,
} from "@/components/vehicle-data";
import type { Product } from "@/lib/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FormValues {
  name: string;
  price: string;
  stock: string;
  description: string;
  sku: string;
  brand: string;
  imageUrl: string;
  category: string;
}

interface FormErrors {
  name?: string;
  price?: string;
  stock?: string;
}

interface FitmentDraft {
  brand: string;
  series: string;
  model: string;
  engine: string;
}

interface EditProductFormProps {
  product: Product;
  onSubmit?: (product: Product) => void;
  onCancel?: () => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const EMPTY_FITMENT: FitmentDraft = {
  brand: "",
  series: "",
  model: "",
  engine: "",
};

function toFormValues(product: Product): FormValues {
  return {
    name: product.name,
    price: String(product.price),
    stock: String(product.stock),
    description: product.description ?? "",
    sku: product.sku ?? "",
    brand: product.brand ?? "",
    imageUrl: product.imageUrl ?? "",
    category: product.category ?? "",
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

function fitmentLabel(f: ProductFitmentInput): string {
  return [f.brand, f.series, f.model, f.engine].filter(Boolean).join(" › ");
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function EditProductForm({
  product,
  onSubmit,
  onCancel,
}: EditProductFormProps) {
  const { token } = useAuth();
  const router = useRouter();

  // Product fields
  const [values, setValues] = useState<FormValues>(() => toFormValues(product));
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  const [fitments, setFitments] = useState<ProductFitmentInput[]>(
    () => product.fitments ?? [],
  );

  const [draft, setDraft] = useState<FitmentDraft>(EMPTY_FITMENT);
  const [fitmentError, setFitmentError] = useState<string | null>(null);

  // Categories
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryOpen, setCategoryOpen] = useState(false);

  useEffect(() => {
    getCategories().then((cats) =>
      setCategories(cats.map((c) => c.name))
    );
  }, []);

  const [currentId, setCurrentId] = useState(product.id);
  if (product.id !== currentId) {
    setCurrentId(product.id);
    setValues(toFormValues(product));
    setErrors({});
    setSaved(false);
    setSubmitError(null);
    setFitments(product.fitments ?? []);
    setDraft(EMPTY_FITMENT);
  }

  const seriesOptions = useMemo<VehicleSeries[]>(    () => (draft.brand ? (VEHICLE_DATA[draft.brand] ?? []) : []),
    [draft.brand],
  );

  const modelOptions = useMemo(
    () => seriesOptions.find((s) => s.name === draft.series)?.models ?? [],
    [seriesOptions, draft.series],
  );

  const engineOptions = useMemo(
    () => modelOptions.find((m) => m.name === draft.model)?.engines ?? [],
    [modelOptions, draft.model],
  );

  // -------------------------------------------------------------------------
  // Handlers — product fields
  // -------------------------------------------------------------------------

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  }

  // -------------------------------------------------------------------------
  // Handlers — fitment draft
  // -------------------------------------------------------------------------

  function handleDraftChange(field: keyof FitmentDraft, value: string) {
    setFitmentError(null);
    setDraft((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "brand") {
        next.series = "";
        next.model = "";
        next.engine = "";
      } else if (field === "series") {
        next.model = "";
        next.engine = "";
      } else if (field === "model") {
        next.engine = "";
      }
      return next;
    });
  }

  function handleAddFitment() {
    if (!draft.brand) {
      setFitmentError("Select at least a brand before adding.");
      return;
    }

    const entry: ProductFitmentInput = { brand: draft.brand };
    if (draft.series) entry.series = draft.series;
    if (draft.model) entry.model = draft.model;
    if (draft.engine) entry.engine = draft.engine;

    const isDuplicate = fitments.some(
      (f) =>
        f.brand === entry.brand &&
        (f.series ?? "") === (entry.series ?? "") &&
        (f.model ?? "") === (entry.model ?? "") &&
        (f.engine ?? "") === (entry.engine ?? ""),
    );

    if (isDuplicate) {
      setFitmentError("This fitment is already in the list.");
      return;
    }

    setFitments((prev) => [...prev, entry]);
    setDraft(EMPTY_FITMENT);
    setFitmentError(null);
  }

  function handleRemoveFitment(index: number) {
    setFitments((prev) => prev.filter((_, i) => i !== index));
  }

  // -------------------------------------------------------------------------
  // Submit
  // -------------------------------------------------------------------------

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
      const updatedProduct = await updateProduct(
        product.id,
        {
          name: values.name.trim(),
          price: Number(values.price),
          stock: Number(values.stock),
          description: values.description.trim() || undefined,
          sku: values.sku.trim() || undefined,
          brand: values.brand.trim() || undefined,
          imageUrl: values.imageUrl.trim() || undefined,
          category: values.category.trim() || undefined,
          fitments: fitments,
        },
        token,
      );
      onSubmit?.(updatedProduct);
      setErrors({});
      setSaved(true);
      toast.success("Product updated");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update product";
      setSubmitError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  const inputClass =
    "rounded-lg border border-slate-300 bg-background px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:focus:border-blue-400";
  const selectClass =
    "rounded-lg border border-slate-300 bg-background px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600";
  const labelClass = "text-sm font-medium text-foreground/80";
  const fieldClass = "flex flex-col gap-1.5";

  return (
    <div className="flex flex-col gap-2">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-base font-bold text-foreground">Edit Product</h2>
          <p className="text-xs text-foreground/50">Update the product details below</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-2 flex flex-col gap-6">
        {/* ── Section 1: Basic Info ── */}
        <section className="rounded-xl border border-slate-300 bg-background p-5 shadow-sm dark:border-slate-600">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-foreground/40">
            Basic Information
          </h3>

          <div className="flex flex-col gap-4">
            {/* Name */}
            <div className={fieldClass}>
              <label htmlFor="edit-name" className={labelClass}>
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                id="edit-name"
                name="name"
                placeholder="e.g. Bosch Oil Filter Premium"
                value={values.name}
                onChange={handleChange}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "edit-name-error" : undefined}
                required
                className={inputClass}
              />
              {errors.name && (
                <p id="edit-name-error" className="flex items-center gap-1 text-xs text-red-500" role="alert">
                  <span aria-hidden>⚠</span> {errors.name}
                </p>
              )}
            </div>

            {/* SKU + Brand */}
            <div className="grid grid-cols-2 gap-4">
              <div className={fieldClass}>
                <label htmlFor="edit-sku" className={labelClass}>
                  SKU{" "}
                  <span className="font-normal text-foreground/40">(optional)</span>
                </label>
                <input
                  id="edit-sku"
                  name="sku"
                  placeholder="e.g. BSC-OIL-001"
                  value={values.sku}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div className={fieldClass}>
                <label htmlFor="edit-brand" className={labelClass}>
                  Brand{" "}
                  <span className="font-normal text-foreground/40">(optional)</span>
                </label>
                <input
                  id="edit-brand"
                  name="brand"
                  placeholder="e.g. Bosch"
                  value={values.brand}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Category */}
            <div className={fieldClass}>
              <label className={labelClass}>
                Category{" "}
                <span className="font-normal text-foreground/40">(optional)</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  aria-haspopup="listbox"
                  aria-expanded={categoryOpen}
                  onClick={() => setCategoryOpen((o) => !o)}
                  className={`flex w-full items-center gap-3 border bg-white px-3 py-2.5 text-left text-sm transition ${
                    categoryOpen
                      ? "border-[#17365d] ring-1 ring-[#17365d]"
                      : values.category
                      ? "border-[#17365d]"
                      : "border-slate-200 hover:border-slate-400"
                  }`}
                >
                  <span className={values.category ? "text-slate-900" : "text-slate-500"}>
                    {values.category || "Select category"}
                  </span>
                  <svg
                    className={`ml-auto h-4 w-4 shrink-0 text-slate-600 transition-transform ${categoryOpen ? "rotate-180" : ""}`}
                    viewBox="0 0 20 20"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {categoryOpen && (
                  <div
                    role="listbox"
                    aria-label="Category"
                    className="absolute left-0 right-0 top-full z-30 max-h-60 overflow-y-auto border-x border-b border-slate-300 bg-white shadow-lg"
                  >
                    {categories.map((cat) => {
                      const isSelected = values.category === cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => {
                            setValues((prev) => ({ ...prev, category: cat }));
                            setSaved(false);
                            setCategoryOpen(false);
                          }}
                          className={`block w-full border-b border-slate-200 px-3 py-2.5 text-left text-sm transition last:border-b-0 ${
                            isSelected
                              ? "bg-[#202020] font-medium text-[#f2d21b]"
                              : "text-slate-800 hover:bg-[#202020] hover:text-[#f2d21b]"
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Price + Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div className={fieldClass}>
                <label htmlFor="edit-price" className={labelClass}>
                  Price (IDR) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-foreground/40">
                    Rp
                  </span>
                  <input
                    id="edit-price"
                    name="price"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={values.price}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.price)}
                    aria-describedby={errors.price ? "edit-price-error" : undefined}
                    required
                    className={`${inputClass} pl-9`}
                  />
                </div>
                {errors.price && (
                  <p id="edit-price-error" className="flex items-center gap-1 text-xs text-red-500" role="alert">
                    <span aria-hidden>⚠</span> {errors.price}
                  </p>
                )}
              </div>

              <div className={fieldClass}>
                <label htmlFor="edit-stock" className={labelClass}>
                  Stock <span className="text-red-500">*</span>
                </label>
                <input
                  id="edit-stock"
                  name="stock"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={values.stock}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.stock)}
                  aria-describedby={errors.stock ? "edit-stock-error" : undefined}
                  required
                  className={inputClass}
                />
                {errors.stock && (
                  <p id="edit-stock-error" className="flex items-center gap-1 text-xs text-red-500" role="alert">
                    <span aria-hidden>⚠</span> {errors.stock}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className={fieldClass}>
              <label htmlFor="edit-description" className={labelClass}>
                Description{" "}
                <span className="font-normal text-foreground/40">(optional)</span>
              </label>
              <textarea
                id="edit-description"
                name="description"
                placeholder="Brief product description…"
                value={values.description}
                onChange={handleChange}
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Image URL */}
            <div className={fieldClass}>
              <label htmlFor="edit-imageUrl" className={labelClass}>
                Image URL{" "}
                <span className="font-normal text-foreground/40">(optional)</span>
              </label>
              <input
                id="edit-imageUrl"
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
                    alt="Product preview"
                    className="h-32 w-full object-contain bg-slate-50 p-2 dark:bg-slate-900"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Section 2: Vehicle Fitment ── */}
        <section className="rounded-xl border border-slate-300 bg-background p-5 shadow-sm dark:border-slate-600">
          <div className="mb-4 flex items-start justify-between gap-2">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-foreground/40">
                Vehicle Fitment
              </h3>
              <p className="mt-1 text-xs text-foreground/50">
                Only Brand is required. Leave Series, Model, or Engine empty for general accessories.
              </p>
            </div>
            {fitments.length > 0 && (
              <span className="shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                {fitments.length} added
              </span>
            )}
          </div>

          {/* Draft selectors */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className={fieldClass}>
              <label htmlFor="edit-fitment-brand" className="text-xs font-medium text-foreground/70">
                Brand
              </label>
              <select
                id="edit-fitment-brand"
                value={draft.brand}
                onChange={(e) => handleDraftChange("brand", e.target.value)}
                className={selectClass}
              >
                <option value="">Select brand</option>
                {CAR_BRANDS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div className={fieldClass}>
              <label htmlFor="edit-fitment-series" className="text-xs font-medium text-foreground/70">
                Series{" "}
                <span className="font-normal text-foreground/40">(optional)</span>
              </label>
              <select
                id="edit-fitment-series"
                value={draft.series}
                disabled={!draft.brand}
                onChange={(e) => handleDraftChange("series", e.target.value)}
                className={selectClass}
              >
                <option value="">
                  {draft.brand ? "Select series (or skip)" : "Select brand first"}
                </option>
                {seriesOptions.map((s) => (
                  <option key={s.name} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className={fieldClass}>
              <label htmlFor="edit-fitment-model" className="text-xs font-medium text-foreground/70">
                Model{" "}
                <span className="font-normal text-foreground/40">(optional)</span>
              </label>
              <select
                id="edit-fitment-model"
                value={draft.model}
                disabled={!draft.series}
                onChange={(e) => handleDraftChange("model", e.target.value)}
                className={selectClass}
              >
                <option value="">
                  {draft.series ? "Select model (or skip)" : "Select series first"}
                </option>
                {modelOptions.map((m) => (
                  <option key={m.name} value={m.name}>{m.name}</option>
                ))}
              </select>
            </div>

            <div className={fieldClass}>
              <label htmlFor="edit-fitment-engine" className="text-xs font-medium text-foreground/70">
                Engine{" "}
                <span className="font-normal text-foreground/40">(optional)</span>
              </label>
              <select
                id="edit-fitment-engine"
                value={draft.engine}
                disabled={!draft.model}
                onChange={(e) => handleDraftChange("engine", e.target.value)}
                className={selectClass}
              >
                <option value="">
                  {draft.model ? "Select engine (or skip)" : "Select model first"}
                </option>
                {engineOptions.map((e) => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            </div>
          </div>

          {fitmentError && (
            <p className="mt-2 flex items-center gap-1 text-xs text-red-500" role="alert">
              <span aria-hidden>⚠</span> {fitmentError}
            </p>
          )}

          <button
            type="button"
            onClick={handleAddFitment}
            className="mt-3 flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
          Add Fitment
          </button>

          {/* Confirmed fitment list */}
          {fitments.length > 0 && (
            <ul className="mt-3 flex flex-col gap-2" aria-label="Added fitments">
              {fitments.map((f, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-slate-600 dark:bg-white/5"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base" aria-hidden>🚗</span>
                    <span className="text-foreground/80">{fitmentLabel(f)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFitment(i)}
                    aria-label={`Remove fitment ${fitmentLabel(f)}`}
                    className="ml-3 rounded px-2 py-0.5 text-xs font-medium text-red-500 transition hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
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

        {saved && (
          <div className="flex items-center gap-2 rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-700 dark:bg-green-950 dark:text-green-400">
            <span aria-hidden>✓</span> Changes saved successfully.
          </div>
        )}

        <div className="flex gap-3 pb-8">
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
              <>
                Save Changes
              </>
            )}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold transition hover:bg-foreground/5 dark:border-slate-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
