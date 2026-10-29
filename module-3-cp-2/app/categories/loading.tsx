// Categories listing loading skeleton
export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page heading */}
      <div className="h-8 w-36 animate-pulse rounded bg-slate-200" />

      {/* Category cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
          >
            {/* Image placeholder — aspect-video to match real card */}
            <div className="aspect-video w-full animate-pulse bg-slate-200" />
            {/* Text placeholders */}
            <div className="flex flex-col gap-2 p-4">
              <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
              <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
              <div className="h-3 w-4/5 animate-pulse rounded bg-slate-100" />
              <div className="mt-2 h-5 w-20 animate-pulse rounded-full bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
