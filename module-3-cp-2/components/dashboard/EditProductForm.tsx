"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { updateProduct, getCategories, type ProductFitmentInput } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import {
  VEHICLE_DATA,
  CAR_BRANDS,
  type VehicleSeries,
} from "@/lib/vehicle-data";
import type { Product } from "@/lib/types";
import { Pencil, X, Plus, Car, ChevronDown } from "lucide-react";

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

const EMPTY_FITMENT: FitmentDraft = { brand: "", series: "", model: "", engine: "" };

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
  if (!values.name.trim()) errors.name = "Product name is required.";
  const price = Number(values.price);
  if (values.price.trim() === "") errors.price = "Price is required.";
  else if (Number.isNaN(price) || price <= 0) errors.price = "Price must be greater than 0.";
  const stock = Number(values.stock);
  if (values.stock.trim() === "") errors.stock = "Stock is required.";
  else if (!Number.isInteger(stock) || stock < 0) errors.stock = "Stock must be 0 or greater.";
  return errors;
}

function fitmentLabel(f: ProductFitmentInput): string {
  return [f.brand, f.series, f.model, f.engine].filter(Boolean).join(" · ");
}

// ---------------------------------------------------------------------------
// Description Modal
// ---------------------------------------------------------------------------

function DescriptionModal({
  value,
  onSave,
  onClose,
}: {
  value: string;
  onSave: (val: string) => void;
  onClose: () => void;
}) {
  const [text, setText] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
    // Close on Escape
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Edit description">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      {/* Panel */}
      <div className="relative flex w-full max-w-2xl flex-col gap-4 rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Product Description</h2>
            <p className="mt-0.5 text-xs text-slate-500">Write a detailed description for this product.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={12}
          placeholder="Write a detailed product description…"
          className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
        />

        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-slate-400">{text.length} characters</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => { onSave(text); onClose(); }}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Save Description
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function EditProductForm({ product, onSubmit, onCancel }: EditProductFormProps) {
  const { token } = useAuth();
  const router = useRouter();

  const [values, setValues] = useState<FormValues>(() => toFormValues(product));
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [descModalOpen, setDescModalOpen] = useState(false);

  const [fitments, setFitments] = useState<ProductFitmentInput[]>(() => product.fitments ?? []);
  const [draft, setDraft] = useState<FitmentDraft>(EMPTY_FITMENT);
  const [fitmentError, setFitmentError] = useState<string | null>(null);

  const [categories, setCategories] = useState<string[]>([]);
  const [categoryOpen, setCategoryOpen] = useState(false);

  useEffect(() => {
    getCategories().then((cats) => setCategories(cats.map((c) => c.name)));
  }, []);

  // Reset when product changes
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

  const seriesOptions = useMemo<VehicleSeries[]>(
    () => (draft.brand ? (VEHICLE_DATA[draft.brand] ?? []) : []),
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

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  }

  function handleDraftChange(field: keyof FitmentDraft, value: string) {
    setFitmentError(null);
    setDraft((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "brand") { next.series = ""; next.model = ""; next.engine = ""; }
      else if (field === "series") { next.model = ""; next.engine = ""; }
      else if (field === "model") { next.engine = ""; }
      return next;
    });
  }

  function handleAddFitment() {
    if (!draft.brand) { setFitmentError("Select at least a brand."); return; }
    const entry: ProductFitmentInput = { brand: draft.brand };
    if (draft.series) entry.series = draft.series;
    if (draft.model) entry.model = draft.model;
    if (draft.engine) entry.engine = draft.engine;
    const isDuplicate = fitments.some(
      (f) => f.brand === entry.brand && (f.series ?? "") === (entry.series ?? "") &&
        (f.model ?? "") === (entry.model ?? "") && (f.engine ?? "") === (entry.engine ?? ""),
    );
    if (isDuplicate) { setFitmentError("This fitment is already added."); return; }
    setFitments((prev) => [...prev, entry]);
    setDraft(EMPTY_FITMENT);
    setFitmentError(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    if (!token) { setSubmitError("You must be signed in."); return; }
    setSubmitting(true);
    try {
      const updated = await updateProduct(product.id, {
        name: values.name.trim(),
        price: Number(values.price),
        stock: Number(values.stock),
        description: values.description.trim() || undefined,
        sku: values.sku.trim() || undefined,
        brand: values.brand.trim() || undefined,
        imageUrl: values.imageUrl.trim() || undefined,
        category: values.category.trim() || undefined,
        fitments,
      }, token);
      onSubmit?.(updated);
      setErrors({});
      setSaved(true);
      toast.success("Product updated");
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update product";
      setSubmitError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  // Shared styles
  const input = "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15";
  const select = "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 disabled:cursor-not-allowed disabled:opacity-40";
  const label = "block text-xs font-semibold uppercase tracking-wide text-slate-500";
  const field = "flex flex-col gap-1.5";
  const errText = "flex items-center gap-1 text-xs text-red-500";

  return (
    <>
      {/* Description modal */}
      {descModalOpen && (
        <DescriptionModal
          value={values.description}
          onSave={(val) => { setValues((p) => ({ ...p, description: val })); setSaved(false); }}
          onClose={() => setDescModalOpen(false)}
        />
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">

        {/* ── Basic Info ── */}
        <div className="flex flex-col gap-5 rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Basic Information</p>

          {/* Name */}
          <div className={field}>
            <label htmlFor="edit-name" className={label}>Product Name <span className="text-red-400">*</span></label>
            <input id="edit-name" name="name" placeholder="e.g. Bosch Oil Filter Premium"
              value={values.name} onChange={handleChange}
              aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "edit-name-err" : undefined}
              required className={input} />
            {errors.name && <p id="edit-name-err" className={errText} role="alert"><span aria-hidden>⚠</span>{errors.name}</p>}
          </div>

          {/* SKU + Brand */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className={field}>
              <label htmlFor="edit-sku" className={label}>SKU <span className="font-normal normal-case text-slate-400">(optional)</span></label>
              <input id="edit-sku" name="sku" placeholder="e.g. BSC-OIL-001"
                value={values.sku} onChange={handleChange} className={input} />
            </div>
            <div className={field}>
              <label htmlFor="edit-brand" className={label}>Brand <span className="font-normal normal-case text-slate-400">(optional)</span></label>
              <input id="edit-brand" name="brand" placeholder="e.g. Bosch"
                value={values.brand} onChange={handleChange} className={input} />
            </div>
          </div>

          {/* Category */}
          <div className={field}>
            <label className={label}>Category <span className="font-normal normal-case text-slate-400">(optional)</span></label>
            <div className="relative">
              <button type="button" aria-haspopup="listbox" aria-expanded={categoryOpen}
                onClick={() => setCategoryOpen((o) => !o)}
                className={`flex w-full items-center gap-2 rounded-xl border bg-white px-3.5 py-2.5 text-left text-sm transition ${categoryOpen ? "border-blue-500 ring-2 ring-blue-500/15" : "border-slate-200 hover:border-slate-300"}`}
              >
                <span className={values.category ? "text-slate-800" : "text-slate-400"}>
                  {values.category || "Select category"}
                </span>
                <ChevronDown size={15} className={`ml-auto shrink-0 text-slate-400 transition-transform ${categoryOpen ? "rotate-180" : ""}`} />
              </button>
              {categoryOpen && (
                <div role="listbox" className="absolute left-0 right-0 top-full z-30 mt-1 max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
                  <button type="button" role="option" aria-selected={!values.category}
                    onClick={() => { setValues((p) => ({ ...p, category: "" })); setSaved(false); setCategoryOpen(false); }}
                    className="block w-full px-3.5 py-2.5 text-left text-sm text-slate-400 transition hover:bg-slate-50">
                    No category
                  </button>
                  {categories.map((cat) => (
                    <button key={cat} type="button" role="option" aria-selected={values.category === cat}
                      onClick={() => { setValues((p) => ({ ...p, category: cat })); setSaved(false); setCategoryOpen(false); }}
                      className={`block w-full border-t border-slate-100 px-3.5 py-2.5 text-left text-sm transition hover:bg-blue-50 hover:text-blue-700 ${values.category === cat ? "bg-blue-50 font-semibold text-blue-700" : "text-slate-700"}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Price + Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div className={field}>
              <label htmlFor="edit-price" className={label}>Price (IDR) <span className="text-red-400">*</span></label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">Rp</span>
                <input id="edit-price" name="price" type="number" min="0" placeholder="0"
                  value={values.price} onChange={handleChange} required
                  aria-invalid={Boolean(errors.price)} aria-describedby={errors.price ? "edit-price-err" : undefined}
                  className={`${input} pl-9 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`} />
              </div>
              {errors.price && <p id="edit-price-err" className={errText} role="alert"><span aria-hidden>⚠</span>{errors.price}</p>}
            </div>
            <div className={field}>
              <label htmlFor="edit-stock" className={label}>Stock <span className="text-red-400">*</span></label>
              <input id="edit-stock" name="stock" type="number" min="0" placeholder="0"
                value={values.stock} onChange={handleChange} required
                aria-invalid={Boolean(errors.stock)} aria-describedby={errors.stock ? "edit-stock-err" : undefined}
                className={`${input} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`} />
              {errors.stock && <p id="edit-stock-err" className={errText} role="alert"><span aria-hidden>⚠</span>{errors.stock}</p>}
            </div>
          </div>

          {/* Description — click to open modal */}
          <div className={field}>
            <label className={label}>Description <span className="font-normal normal-case text-slate-400">(optional)</span></label>
            <button type="button" onClick={() => setDescModalOpen(true)}
              className="flex w-full items-start gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-left text-sm transition hover:border-blue-400 hover:bg-blue-50/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30"
            >
              <span className="flex-1 text-sm leading-relaxed">
                {values.description
                  ? <span className="line-clamp-2 text-slate-700">{values.description}</span>
                  : <span className="text-slate-400">Click to write a product description…</span>
                }
              </span>
              <Pencil size={14} className="mt-0.5 shrink-0 text-slate-400" />
            </button>
          </div>

          {/* Image URL */}
          <div className={field}>
            <label htmlFor="edit-imageUrl" className={label}>Image URL <span className="font-normal normal-case text-slate-400">(optional)</span></label>
            <input id="edit-imageUrl" name="imageUrl" type="url"
              placeholder="https://example.com/image.jpg"
              value={values.imageUrl} onChange={handleChange} className={input} />
            {values.imageUrl && (
              <div className="mt-1 overflow-hidden rounded-xl border border-slate-200 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={values.imageUrl} alt="Product preview"
                  className="h-32 w-full object-contain p-2"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
              </div>
            )}
          </div>
        </div>

        {/* ── Vehicle Fitment ── */}
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Vehicle Fitment</p>
              <p className="mt-0.5 text-xs text-slate-500">Only Brand is required. Leave others empty for general accessories.</p>
            </div>
            {fitments.length > 0 && (
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700">
                {fitments.length} added
              </span>
            )}
          </div>

          {/* Selectors */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { id: "edit-fit-brand", label: "Brand", value: draft.brand, disabled: false,
                options: CAR_BRANDS.map((b) => ({ value: b, label: b })),
                placeholder: "Select brand", onChange: (v: string) => handleDraftChange("brand", v) },
              { id: "edit-fit-series", label: "Series", value: draft.series, disabled: !draft.brand,
                options: seriesOptions.map((s) => ({ value: s.name, label: s.name })),
                placeholder: draft.brand ? "Any series" : "Select brand first", onChange: (v: string) => handleDraftChange("series", v) },
              { id: "edit-fit-model", label: "Model", value: draft.model, disabled: !draft.series,
                options: modelOptions.map((m) => ({ value: m.name, label: m.name })),
                placeholder: draft.series ? "Any model" : "Select series first", onChange: (v: string) => handleDraftChange("model", v) },
              { id: "edit-fit-engine", label: "Engine", value: draft.engine, disabled: !draft.model,
                options: engineOptions.map((e) => ({ value: e, label: e })),
                placeholder: draft.model ? "Any engine" : "Select model first", onChange: (v: string) => handleDraftChange("engine", v) },
            ].map(({ id, label: lbl, value, disabled, options, placeholder, onChange }) => (
              <div key={id} className={field}>
                <label htmlFor={id} className={label}>{lbl}</label>
                <select id={id} value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)} className={select}>
                  <option value="">{placeholder}</option>
                  {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            ))}
          </div>

          {fitmentError && (
            <p className={errText} role="alert"><span aria-hidden>⚠</span>{fitmentError}</p>
          )}

          <button type="button" onClick={handleAddFitment}
            className="flex w-fit items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-900">
            <Plus size={15} />
            Add Fitment
          </button>

          {/* Fitment list */}
          {fitments.length > 0 && (
            <ul className="flex flex-col gap-2" aria-label="Added fitments">
              {fitments.map((f, i) => (
                <li key={i} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <Car size={14} className="shrink-0 text-slate-400" />
                    <span className="text-sm text-slate-700">{fitmentLabel(f)}</span>
                  </div>
                  <button type="button" onClick={() => setFitments((p) => p.filter((_, j) => j !== i))}
                    aria-label={`Remove ${fitmentLabel(f)}`}
                    className="rounded-lg px-2 py-1 text-xs font-medium text-slate-400 transition hover:bg-red-50 hover:text-red-600">
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Feedback */}
        {submitError && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600" role="alert">
            <span aria-hidden>⚠</span>{submitError}
          </div>
        )}
        {saved && (
          <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            <span aria-hidden>✓</span> Changes saved successfully.
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button type="submit" disabled={submitting}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
            {submitting ? (
              <><svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
              </svg>Saving…</>
            ) : "Save Changes"}
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
              Cancel
            </button>
          )}
        </div>
      </form>
    </>
  );
}
