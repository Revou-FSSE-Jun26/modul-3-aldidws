// Root loading — shown while the homepage fetches data
export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Hero skeleton */}
      <div className="mb-10 h-64 w-full animate-pulse rounded-2xl bg-slate-200 sm:h-80 lg:h-96" />

      {/* Section heading */}
      <div className="mb-6 flex flex-col gap-2">
        <div className="h-7 w-48 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-64 animate-pulse rounded bg-slate-100" />
      </div>

      {/* Product card grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="aspect-square w-full animate-pulse bg-slate-200" />
            <div className="flex flex-col gap-2 p-4">
              <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
              <div className="mt-2 h-5 w-1/3 animate-pulse rounded bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
