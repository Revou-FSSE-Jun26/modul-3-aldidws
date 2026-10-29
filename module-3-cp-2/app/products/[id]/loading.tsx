// Product detail loading skeleton
export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Breadcrumb */}
      <div className="mb-6 flex gap-2">
        <div className="h-4 w-16 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-4 animate-pulse rounded bg-slate-100" />
        <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Product image */}
        <div className="aspect-square w-full animate-pulse rounded-2xl bg-slate-200" />

        {/* Product info */}
        <div className="flex flex-col gap-4">
          {/* Category badge */}
          <div className="h-5 w-24 animate-pulse rounded-full bg-slate-200" />
          {/* Title */}
          <div className="flex flex-col gap-2">
            <div className="h-7 w-full animate-pulse rounded bg-slate-200" />
            <div className="h-7 w-3/4 animate-pulse rounded bg-slate-200" />
          </div>
          {/* Price */}
          <div className="h-9 w-36 animate-pulse rounded bg-slate-200" />
          {/* Description lines */}
          <div className="flex flex-col gap-2 pt-2">
            <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
          </div>
          {/* Add to cart button */}
          <div className="mt-4 h-11 w-full animate-pulse rounded-xl bg-slate-200 sm:w-48" />
        </div>
      </div>
    </div>
  );
}
