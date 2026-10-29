"use client";

import { useState, type InputHTMLAttributes } from "react";

type PasswordInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
>;

export default function PasswordInput({
  className,
  ...inputProps
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        {...inputProps}
        type={visible ? "text" : "password"}
        className={
          className ??
          "w-full rounded-md border border-black/15 bg-background px-3 py-2 pr-20 text-sm outline-none focus:border-foreground/40 dark:border-white/20"
        }
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-pressed={visible}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute inset-y-0 right-2 my-auto h-fit rounded px-2 py-1 text-xs font-medium text-foreground/60 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40"
      >
        {visible ? "Hide" : "Show"}
      </button>
    </div>
  );
}
