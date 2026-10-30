"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { updateCategory } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import type { Category } from "@/lib/types";
import { Pencil } from "lucide-react";
import DescriptionModal from "./DescriptionModal";

interface FormValues {
  name: string;
  description: string;
  imageUrl: string;
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
    imageUrl: category.imageUrl ?? "",
  };
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) errors.name = "Category name is required.";
  return errors;
}

const inp = "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15";
const lbl = "block text-xs font-semibold uppercase tracking-wide text-slate-500";
const fld = "flex flex-col gap-1.5";
const errTxt = "flex items-center gap-1 text-xs text-red-500";

export default function EditCategoryForm({ category, onSubmit, onCancel }: EditCategoryFormProps) {
  const { token } = useAuth();
  const router = useRouter();

  const [values, setValues] = useState<FormValues>(() => toFormValues(category));
  const [errors, setErrors] = useState<FormErrors>({});
  const [saved, setSaved] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [descOpen, setDescOpen] = useState(false);

  const [currentId, setCurrentId] = useState(category.id);
  if (category.id !== currentId) {
    setCurrentId(category.id);
    setValues(toFormValues(category));
    setErrors({});
    setSaved(false);
    setSubmitError(null);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setValues((p) => ({ ...p, [name]: value }));
    setSaved(false);
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
      const updated = await updateCategory(category.id, {
        name: values.name.trim(),
        description: values.description.trim() || undefined,
        imageUrl: values.imageUrl.trim() || undefined,
      }, token);
      onSubmit?.(updated);
      setErrors({});
      setSaved(true);
      toast.success("Category updated");
      router.refresh();
    } catch (ex) {
      const msg = ex instanceof Error ? ex.message : "Failed to update category";
      setSubmitError(msg);
      toast.error(msg);
    } finally { setSubmitting(false); }
  }

  return (
    <>
      {descOpen && (
        <DescriptionModal
          value={values.description}
          onSave={(v) => { setValues((p) => ({ ...p, description: v })); setSaved(false); }}
          onClose={() => setDescOpen(false)}
        />
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">

        <div className="flex flex-col gap-5 rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Category Details</p>

          {/* Name */}
          <div className={fld}>
            <label htmlFor="edit-cat-name" className={lbl}>
              Category Name <span className="text-red-400">*</span>
            </label>
            <input
              id="edit-cat-name"
              name="name"
              placeholder="e.g. Engine Parts"
              value={values.name}
              onChange={handleChange}
              required
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "edit-cat-name-err" : undefined}
              className={inp}
            />
            {errors.name && (
              <p id="edit-cat-name-err" className={errTxt} role="alert">
                <span aria-hidden>⚠</span>{errors.name}
              </p>
            )}
          </div>

          {/* Description */}
          <div className={fld}>
            <label className={lbl}>
              Description <span className="font-normal normal-case text-slate-400">(optional)</span>
            </label>
            <button
              type="button"
              onClick={() => setDescOpen(true)}
              className="flex w-full items-start gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-left text-sm transition hover:border-blue-400 hover:bg-blue-50/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30"
            >
              <span className="flex-1 leading-relaxed">
                {values.description
                  ? <span className="line-clamp-2 text-slate-700">{values.description}</span>
                  : <span className="text-slate-400">Click to write a description…</span>
                }
              </span>
              <Pencil size={14} className="mt-0.5 shrink-0 text-slate-400" />
            </button>
          </div>

          {/* Image URL */}
          <div className={fld}>
            <label htmlFor="edit-cat-imageUrl" className={lbl}>
              Image URL <span className="font-normal normal-case text-slate-400">(optional)</span>
            </label>
            <input
              id="edit-cat-imageUrl"
              name="imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={values.imageUrl}
              onChange={handleChange}
              className={inp}
            />
            {values.imageUrl && (
              <div className="mt-1 overflow-hidden rounded-xl border border-slate-200 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={values.imageUrl}
                  alt="Category preview"
                  className="h-32 w-full object-contain p-2"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />
              </div>
            )}
          </div>
        </div>

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

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? (
              <><svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
              </svg>Saving…</>
            ) : "Save Changes"}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </>
  );
}
