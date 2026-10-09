import type { ReactNode } from "react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  detail?: string;
  action?: ReactNode;
}

export default function ErrorState({
  title = "An error occurred",
  message = "Data cannot be loaded at this time. Please try again later.",
  detail,
  action,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center dark:border-red-900/40 dark:bg-red-950/20"
    >
      <div
        aria-hidden="true"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-2xl text-red-600 dark:bg-red-900/40 dark:text-red-400"
      >
        !
      </div>
      <h2 className="text-lg font-semibold text-red-800 dark:text-red-300">
        {title}
      </h2>
      <p className="max-w-md text-sm text-red-700/80 dark:text-red-300/70">
        {message}
      </p>
      {detail ? (
        <p className="max-w-md break-words font-mono text-xs text-red-600/60 dark:text-red-400/50">
          {detail}
        </p>
      ) : null}
      {action}
    </div>
  );
}
