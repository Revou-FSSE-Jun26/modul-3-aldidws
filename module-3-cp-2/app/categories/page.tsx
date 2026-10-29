import Link from "next/link";
import Image from "next/image";
import { getCategories } from "@/lib/api";

export const revalidate = 60;

export const metadata = {
  title: "Category — Revo Otoshop",
};

export default async function CategoriesPage() {
  const categories = await getCategories({
    revalidate: 60,
    tags: ["categories"],
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold tracking-tight">Category</h1>

      {categories.length === 0 ? (
        <p className="text-foreground/60">No categories yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${encodeURIComponent(category.name)}`}
              aria-label={`View products in ${category.name}`}
              className="group rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-foreground/40"
            >
              <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                {/* Image */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                  {category.imageUrl ? (
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-400">
                      No image
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col gap-1 p-4">
                  <h2 className="text-base font-semibold">{category.name}</h2>
                  {category.description && (
                    <p className="line-clamp-2 text-sm text-foreground/60">
                      {category.description}
                    </p>
                  )}
                  {typeof category.productCount === "number" && (
                    <span className="mt-1 w-fit rounded-full bg-foreground/10 px-2.5 py-0.5 text-xs font-medium">
                      {category.productCount} product{category.productCount !== 1 ? "s" : ""}
                    </span>
                  )}
                  <span className="mt-auto pt-3 text-sm font-medium text-blue-600 transition group-hover:underline">
                    View products &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
