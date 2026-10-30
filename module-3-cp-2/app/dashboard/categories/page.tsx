import Link from "next/link";
import Image from "next/image";
import AddCategoryForm from "@/components/dashboard/AddCategoryForm";
import { getCategories } from "@/lib/api";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Categories — Revo Otoshop",
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="flex flex-col gap-8">

      {/* Page header */}
      <div className="flex flex-col gap-1">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
          Manage
        </p>
        <h1 className="text-2xl font-black tracking-tight text-slate-900">
          Categories
        </h1>
        <p className="text-sm text-slate-500">
          {categories.length} categor{categories.length === 1 ? "y" : "ies"} available
        </p>
      </div>

      {categories.length === 0 ? (
        <p className="rounded-xl border border-slate-200 px-4 py-10 text-center text-sm text-slate-500">
          No categories yet. Add one below.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/dashboard/categories/${category.id}`}
              aria-label={`Manage ${category.name}`}
              className="group rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">

                {/* Image */}
                <div className="relative aspect-square w-full overflow-hidden bg-slate-50">
                  {category.imageUrl ? (
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <svg
                        className="h-8 w-8 text-slate-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18M6.75 6.75h.008v.008H6.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Product count badge */}
                  {typeof category.productCount === "number" && (
                    <span className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                      {category.productCount}
                    </span>
                  )}
                </div>

                {/* Name */}
                <div className="px-3 py-2.5">
                  <p className="truncate text-xs font-semibold text-slate-800 group-hover:text-blue-700">
                    {category.name}
                  </p>
                  {category.description && (
                    <p className="mt-0.5 line-clamp-1 text-[10px] text-slate-400">
                      {category.description}
                    </p>
                  )}
                  <p className="mt-1 text-[10px] font-medium text-blue-500 opacity-0 transition-opacity group-hover:opacity-100">
                    Manage →
                  </p>
                </div>

              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Add category form */}
      <section className="flex flex-col border-t border-slate-200 pt-8">
        <AddCategoryForm />
      </section>

    </div>
  );
}
