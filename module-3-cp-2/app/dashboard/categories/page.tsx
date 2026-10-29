import Link from "next/link";
import Image from "next/image";
import AddCategoryForm from "@/components/AddCategoryForm";
import { getCategories } from "@/lib/api";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Categories — Revo Otoshop",
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
        <p className="text-sm text-foreground/50">
          {categories.length} categor{categories.length === 1 ? "y" : "ies"} available
        </p>
      </div>

      {categories.length === 0 ? (
        <p className="rounded-lg border border-black/10 px-4 py-8 text-center text-foreground/60 dark:border-white/15">
          No categories yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/dashboard/categories/${category.id}`}
              aria-label={`Manage ${category.name}`}
              className="group rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
            >
              <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-background shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700">
                {/* Image */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  {category.imageUrl ? (
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-400 dark:text-slate-600">
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
                  <span className="mt-auto pt-3 text-sm font-medium text-blue-600 transition group-hover:underline dark:text-blue-400">
                    Manage category &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <section className="mt-6 flex flex-col border-t border-black/10 pt-6 dark:border-white/15">
        <AddCategoryForm />
      </section>
    </div>
  );
}
