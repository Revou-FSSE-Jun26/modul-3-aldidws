import type { ReactNode } from "react";
import Link from "next/link";

interface ErrorStateProps {
  title?: string;
  message?: string;
  detail?: string;
  action?: ReactNode;
}

export default function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load the data you were looking for. Please try again or go back to the homepage.",
  detail,
  action,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center"
    >
      {/* Icon */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-red-500"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>

      {/* Heading */}
      <h1 className="mb-3 font-poppins text-2xl font-bold text-slate-800 sm:text-3xl">
        {title}
      </h1>

      {/* Message */}
      <p className="mb-2 max-w-md text-base text-slate-500">{message}</p>

      {/* Technical detail (collapsed, monospace) */}
      {detail && (
        <p className="mb-6 max-w-sm break-words rounded-lg bg-slate-100 px-4 py-2 font-mono text-xs text-slate-400">
          {detail}
        </p>
      )}

      {/* Actions */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {action}
        <Link
          href="/"
          className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
