"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface SearchBarProps {
  placeholder?: string;
  paramKey?: string;
}

export default function SearchBar({
  placeholder = "Search for products, brands, or categories...",
  paramKey = "q",
}: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [value, setValue] = useState(searchParams.get(paramKey) ?? "");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams(searchParams.toString());
    const trimmed = value.trim();

    if (trimmed) {
      params.set(paramKey, trimmed);
    } else {
      params.delete(paramKey);
    }

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  }

  function handleClear() {
    setValue("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete(paramKey);
    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  }

  return (
    <form onSubmit={handleSubmit} role="search" className="flex gap-2">
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        aria-label="Find Products"
        className="flex-1 rounded-md border border-black/15 bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40 dark:border-white/20"
      />
      <button
        type="submit"
        className="rounded-md bg-foreground px-4 py-2 text-sm font-semibold text-background hover:opacity-90"
      >
        Search
      </button>
      {searchParams.get(paramKey) && (
        <button
          type="button"
          onClick={handleClear}
          className="rounded-md border border-black/15 px-4 py-2 text-sm font-medium hover:bg-foreground/10 dark:border-white/20"
        >
          Reset
        </button>
      )}
    </form>
  );
}
