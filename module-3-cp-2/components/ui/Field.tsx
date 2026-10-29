"use client";

import type React from "react";

export const FIELD_CLASS =
  "rounded-md border border-black/15 bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40 dark:border-white/20";

export type FieldName = keyof { name: string; email: string; address: string };

export interface FieldConfig {
  name: FieldName;
  label: string;
  type?: string;
  multiline?: boolean;
}

export interface FieldProps {
  config: FieldConfig;
  value: string;
  error?: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

export function Field({ config, value, error, onChange }: FieldProps) {
  const { name, label, type, multiline } = config;
  const shared = {
    id: name,
    name,
    value,
    onChange,
    "aria-invalid": Boolean(error),
    className: FIELD_CLASS,
  };

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      {multiline ? (
        <textarea {...shared} rows={3} />
      ) : (
        <input {...shared} type={type} />
      )}
      {error && (
        <p className="text-xs text-red-500" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  );
}
