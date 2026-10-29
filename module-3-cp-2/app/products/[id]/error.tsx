"use client";

import { useEffect } from "react";
import ErrorState from "@/components/ErrorState";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      title="Failed to load product"
      message="We couldn't fetch the product details. Please try again or browse other products."
      detail={error.message}
      action={
        <button
          onClick={reset}
          className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
        >
          Try again
        </button>
      }
    />
  );
}
