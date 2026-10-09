export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="h-8 w-64 animate-pulse rounded bg-foreground/10" />
        <div className="h-6 w-24 animate-pulse rounded-full bg-foreground/10" />
        <div className="h-5 w-full max-w-lg animate-pulse rounded bg-foreground/10" />
      </div>
      <div className="h-48 w-full max-w-sm animate-pulse rounded-xl border border-black/10 bg-foreground/5 dark:border-white/15" />
    </div>
  );
}
