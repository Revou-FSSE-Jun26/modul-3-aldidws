// Products listing loading skeleton
export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page heading + filter bar */}
      <div className="flex flex-col gap-3">
        <div className="h-8 w-40 animate-pulse rounded bg-slate-200" />
        <div className="flex gap-2">
          <div className="h-9 w-48 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-9 w-32 animate-pulse rounded-lg bg-slate-200" />
        </div>
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
