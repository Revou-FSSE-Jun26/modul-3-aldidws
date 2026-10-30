"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createProduct, getCategories, type ProductFitmentInput } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { VEHICLE_DATA, CAR_BRANDS, type VehicleSeries } from "@/lib/vehicle-data";
import { Pencil, Plus, Car, ChevronDown } from "lucide-react";
import DescriptionModal from "./DescriptionModal";

interface FormValues {
  name: string; price: string; stock: string; description: string;
  sku: string; brand: string; imageUrl: string; category: string;
}
interface FormErrors { name?: string; price?: string; stock?: string; }
interface FitmentDraft { brand: string; series: string; model: string; engine: string; }

const EMPTY_FORM: FormValues = { name: "", price: "", stock: "", description: "", sku: "", brand: "", imageUrl: "", category: "" };
const EMPTY_FITMENT: FitmentDraft = { brand: "", series: "", model: "", engine: "" };

function validate(v: FormValues): FormErrors {
  const e: FormErrors = {};
  if (!v.name.trim()) e.name = "Product name is required.";
  const p = Number(v.price);
  if (v.price.trim() === "") e.price = "Price is required.";
  else if (Number.isNaN(p) || p <= 0) e.price = "Price must be greater than 0.";
  const s = Number(v.stock);
  if (v.stock.trim() === "") e.stock = "Stock is required.";
  else if (!Number.isInteger(s) || s < 0) e.stock = "Stock must be 0 or greater.";
  return e;
}

function fitmentLabel(f: ProductFitmentInput) {
  return [f.brand, f.series, f.model, f.engine].filter(Boolean).join(" · ");
}

// Shared styles
const inp = "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15";
const sel = "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 disabled:cursor-not-allowed disabled:opacity-40";
const lbl = "block text-xs font-semibold uppercase tracking-wide text-slate-500";
const fld = "flex flex-col gap-1.5";
const err = "flex items-center gap-1 text-xs text-red-500";

export default function AddProductForm() {
  const { token } = useAuth();
  const router = useRouter();

  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [descOpen, setDescOpen] = useState(false);

  const [fitments, setFitments] = useState<ProductFitmentInput[]>([]);
  const fitmentsRef = useRef<ProductFitmentInput[]>([]);
  const [draft, setDraft] = useState<FitmentDraft>(EMPTY_FITMENT);
  const [fitmentError, setFitmentError] = useState<string | null>(null);

  const [categories, setCategories] = useState<string[]>([]);
  const [categoryOpen, setCategoryOpen] = useState(false);

  useEffect(() => {
    getCategories().then((c) => setCategories(c.map((x) => x.name))).catch(() => setCategories([]));
  }, []);

  const seriesOptions = useMemo<VehicleSeries[]>(() => draft.brand ? (VEHICLE_DATA[draft.brand] ?? []) : [], [draft.brand]);
  const modelOptions = useMemo(() => seriesOptions.find((s) => s.name === draft.series)?.models ?? [], [seriesOptions, draft.series]);
  const engineOptions = useMemo(() => modelOptions.find((m) => m.name === draft.model)?.engines ?? [], [modelOptions, draft.model]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setValues((p) => ({ ...p, [name]: value }));
  }

  function handleDraftChange(field: keyof FitmentDraft, value: string) {
    setFitmentError(null);
    setDraft((p) => {
      const n = { ...p, [field]: value };
      if (field === "brand") { n.series = ""; n.model = ""; n.engine = ""; }
      else if (field === "series") { n.model = ""; n.engine = ""; }
      else if (field === "model") { n.engine = ""; }
      return n;
    });
  }

  function handleAddFitment() {
    if (!draft.brand) { setFitmentError("Select at least a brand."); return; }
    const entry: ProductFitmentInput = { brand: draft.brand };
    if (draft.series) entry.series = draft.series;
    if (draft.model) entry.model = draft.model;
    if (draft.engine) entry.engine = draft.engine;
    const dup = fitments.some((f) => f.brand === entry.brand && (f.series ?? "") === (entry.series ?? "") && (f.model ?? "") === (entry.model ?? "") && (f.engine ?? "") === (entry.engine ?? ""));
    if (dup) { setFitmentError("This fitment is already added."); return; }
    const next = [...fitmentsRef.current, entry];
    fitmentsRef.current = next;
    setFitments(next);
    setDraft(EMPTY_FITMENT);
    setFitmentError(null);
  }

  function handleRemoveFitment(i: number) {
    const next = fitmentsRef.current.filter((_, j) => j !== i);
    fitmentsRef.current = next;
    setFitments(next);
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
      await createProduct({ name: values.name.trim(), price: Number(values.price), stock: Number(values.stock), description: values.description.trim() || undefined, sku: values.sku.trim() || undefined, brand: values.brand.trim() || undefined, imageUrl: values.imageUrl.trim() || undefined, category: values.category.trim() || undefined, fitments: fitmentsRef.current }, token);
      setValues(EMPTY_FORM);
      setErrors({});
      setFitments([]);
      fitmentsRef.current = [];
      setDraft(EMPTY_FITMENT);
      toast.success("Product created");
      router.refresh();
    } catch (ex) {
      const msg = ex instanceof Error ? ex.message : "Failed to create product";
      setSubmitError(msg);
      toast.error(msg);
    } finally { setSubmitting(false); }
  }

  return (
    <>
      {descOpen && <DescriptionModal value={values.description} onSave={(v) => setValues((p) => ({ ...p, description: v }))} onClose={() => setDescOpen(false)} />}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">

        {/* Basic Info */}
        <div className="flex flex-col gap-5 rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Basic Information</p>

          <div className={fld}>
            <label htmlFor="add-name" className={lbl}>Product Name <span className="text-red-400">*</span></label>
            <input id="add-name" name="name" placeholder="e.g. Bosch Oil Filter Premium" value={values.name} onChange={handleChange} required aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "add-name-err" : undefined} className={inp} />
            {errors.name && <p id="add-name-err" className={err} role="alert"><span aria-hidden>⚠</span>{errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className={fld}>
              <label htmlFor="add-sku" className={lbl}>SKU <span className="font-normal normal-case text-slate-400">(optional)</span></label>
              <input id="add-sku" name="sku" placeholder="e.g. BSC-OIL-001" value={values.sku} onChange={handleChange} className={inp} />
            </div>
            <div className={fld}>
              <label htmlFor="add-brand" className={lbl}>Brand <span className="font-normal normal-case text-slate-400">(optional)</span></label>
              <input id="add-brand" name="brand" placeholder="e.g. Bosch" value={values.brand} onChange={handleChange} className={inp} />
            </div>
          </div>

          {/* Category */}
          <div className={fld}>
            <label className={lbl}>Category <span className="font-normal normal-case text-slate-400">(optional)</span></label>
            <div className="relative">
              <button type="button" aria-haspopup="listbox" aria-expanded={categoryOpen} onClick={() => setCategoryOpen((o) => !o)}
                className={`flex w-full items-center gap-2 rounded-xl border bg-white px-3.5 py-2.5 text-left text-sm transition ${categoryOpen ? "border-blue-500 ring-2 ring-blue-500/15" : "border-slate-200 hover:border-slate-300"}`}>
                <span className={values.category ? "text-slate-800" : "text-slate-400"}>{values.category || "Select category"}</span>
                <ChevronDown size={15} className={`ml-auto shrink-0 text-slate-400 transition-transform ${categoryOpen ? "rotate-180" : ""}`} />
              </button>
              {categoryOpen && (
                <div role="listbox" className="absolute left-0 right-0 top-full z-30 mt-1 max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
                  <button type="button" role="option" aria-selected={!values.category} onClick={() => { setValues((p) => ({ ...p, category: "" })); setCategoryOpen(false); }} className="block w-full px-3.5 py-2.5 text-left text-sm text-slate-400 transition hover:bg-slate-50">No category</button>
                  {categories.map((cat) => (
                    <button key={cat} type="button" role="option" aria-selected={values.category === cat} onClick={() => { setValues((p) => ({ ...p, category: cat })); setCategoryOpen(false); }}
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
            <div className={fld}>
              <label htmlFor="add-price" className={lbl}>Price (IDR) <span className="text-red-400">*</span></label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">Rp</span>
                <input id="add-price" name="price" type="number" min="0" placeholder="0" value={values.price} onChange={handleChange} required aria-invalid={Boolean(errors.price)} aria-describedby={errors.price ? "add-price-err" : undefined} className={`${inp} pl-9 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`} />
              </div>
              {errors.price && <p id="add-price-err" className={err} role="alert"><span aria-hidden>⚠</span>{errors.price}</p>}
            </div>
            <div className={fld}>
              <label htmlFor="add-stock" className={lbl}>Stock <span className="text-red-400">*</span></label>
              <input id="add-stock" name="stock" type="number" min="0" placeholder="0" value={values.stock} onChange={handleChange} required aria-invalid={Boolean(errors.stock)} aria-describedby={errors.stock ? "add-stock-err" : undefined} className={`${inp} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`} />
              {errors.stock && <p id="add-stock-err" className={err} role="alert"><span aria-hidden>⚠</span>{errors.stock}</p>}
            </div>
          </div>

          {/* Description */}
          <div className={fld}>
            <label className={lbl}>Description <span className="font-normal normal-case text-slate-400">(optional)</span></label>
            <button type="button" onClick={() => setDescOpen(true)}
              className="flex w-full items-start gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-left text-sm transition hover:border-blue-400 hover:bg-blue-50/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30">
              <span className="flex-1 leading-relaxed">
                {values.description ? <span className="line-clamp-2 text-slate-700">{values.description}</span> : <span className="text-slate-400">Click to write a product description…</span>}
              </span>
              <Pencil size={14} className="mt-0.5 shrink-0 text-slate-400" />
            </button>
          </div>

          {/* Image URL */}
          <div className={fld}>
            <label htmlFor="add-imageUrl" className={lbl}>Image URL <span className="font-normal normal-case text-slate-400">(optional)</span></label>
            <input id="add-imageUrl" name="imageUrl" type="url" placeholder="https://example.com/image.jpg" value={values.imageUrl} onChange={handleChange} className={inp} />
            {values.imageUrl && /^https?:\/\//.test(values.imageUrl) && (
              <div className="mt-1 overflow-hidden rounded-xl border border-slate-200 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={values.imageUrl} alt="Product preview" className="h-32 w-full object-contain p-2" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
              </div>
            )}
          </div>
        </div>

        {/* Vehicle Fitment */}
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Vehicle Fitment</p>
              <p className="mt-0.5 text-xs text-slate-500">Only Brand is required. Leave others empty for general accessories.</p>
            </div>
            {fitments.length > 0 && <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700">{fitments.length} added</span>}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { id: "add-fit-brand", lbl: "Brand", val: draft.brand, dis: false, opts: CAR_BRANDS.map((b) => ({ v: b, l: b })), ph: "Select brand", fn: (v: string) => handleDraftChange("brand", v) },
              { id: "add-fit-series", lbl: "Series", val: draft.series, dis: !draft.brand, opts: seriesOptions.map((s) => ({ v: s.name, l: s.name })), ph: draft.brand ? "Any series" : "Select brand first", fn: (v: string) => handleDraftChange("series", v) },
              { id: "add-fit-model", lbl: "Model", val: draft.model, dis: !draft.series, opts: modelOptions.map((m) => ({ v: m.name, l: m.name })), ph: draft.series ? "Any model" : "Select series first", fn: (v: string) => handleDraftChange("model", v) },
              { id: "add-fit-engine", lbl: "Engine", val: draft.engine, dis: !draft.model, opts: engineOptions.map((e) => ({ v: e, l: e })), ph: draft.model ? "Any engine" : "Select model first", fn: (v: string) => handleDraftChange("engine", v) },
            ].map(({ id, lbl: l, val, dis, opts, ph, fn }) => (
              <div key={id} className={fld}>
                <label htmlFor={id} className={lbl}>{l}</label>
                <select id={id} value={val} disabled={dis} onChange={(e) => fn(e.target.value)} className={sel}>
                  <option value="">{ph}</option>
                  {opts.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            ))}
          </div>

          {fitmentError && <p className={err} role="alert"><span aria-hidden>⚠</span>{fitmentError}</p>}

          <button type="button" onClick={handleAddFitment} className="flex w-fit items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-900">
            <Plus size={15} />Add Fitment
          </button>

          {fitments.length > 0 && (
            <ul className="flex flex-col gap-2" aria-label="Added fitments">
              {fitments.map((f, i) => (
                <li key={i} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2.5">
                  <div className="flex items-center gap-2.5"><Car size={14} className="shrink-0 text-slate-400" /><span className="text-sm text-slate-700">{fitmentLabel(f)}</span></div>
                  <button type="button" onClick={() => handleRemoveFitment(i)} aria-label={`Remove ${fitmentLabel(f)}`} className="rounded-lg px-2 py-1 text-xs font-medium text-slate-400 transition hover:bg-red-50 hover:text-red-600">Remove</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {submitError && <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600" role="alert"><span aria-hidden>⚠</span>{submitError}</div>}

        <button type="submit" disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
          {submitting ? <><svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" /></svg>Saving…</> : "Save Product"}
        </button>
      </form>
    </>
  );
}
