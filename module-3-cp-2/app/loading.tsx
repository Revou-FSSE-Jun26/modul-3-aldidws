export default function Loading() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="h-9 w-72 animate-pulse rounded bg-foreground/10" />
        <div className="h-5 w-96 max-w-full animate-pulse rounded bg-foreground/10" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-48 animate-pulse rounded-xl border border-black/10 bg-foreground/5 dark:border-white/15"
          />
        ))}
      </div>
    </div>
  );
}
