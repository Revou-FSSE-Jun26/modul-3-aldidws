import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <h2 className="text-xl font-semibold">Product not found</h2>
      <p className="text-foreground/60">
        The product you are looking for is not available or has been removed.
      </p>
      <Link
        href="/products"
        className="rounded-md bg-foreground px-4 py-2 text-sm font-semibold text-background hover:opacity-90"
      >
        Back to catalog
      </Link>
    </div>
  );
}
