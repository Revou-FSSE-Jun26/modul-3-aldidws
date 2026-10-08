import { Suspense } from "react";
import SearchBar from "@/components/SearchBar";

export default function ProductsLayout({
  children,
}: LayoutProps<"/products">) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Product Catalog</h1>
        <Suspense
          fallback={
            <div className="h-10 w-full animate-pulse rounded-md bg-foreground/10" />
          }
        >
          <SearchBar />
        </Suspense>
      </div>

      {children}
    </div>
  );
}
