// Orders listing loading skeleton
export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page heading */}
      <div className="h-8 w-32 animate-pulse rounded bg-slate-200" />

      {/* Order rows */}
      <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            {/* Left: order info */}
            <div className="flex flex-col gap-2">
              <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
              <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
            </div>
            {/* Right: status + total */}
            <div className="flex flex-col items-end gap-2">
              <div className="h-5 w-20 animate-pulse rounded-full bg-slate-200" />
              <div className="h-4 w-16 animate-pulse rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
