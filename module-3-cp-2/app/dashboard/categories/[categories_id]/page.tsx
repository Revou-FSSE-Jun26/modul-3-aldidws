import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategory } from "@/lib/api";
import EditCategoryForm from "@/components/dashboard/EditCategoryForm";
import DeleteCategoryForm from "@/components/dashboard/DeleteCategoryForm";
import { ArrowLeft, ImageIcon, Tag, LayoutGrid } from "lucide-react";

export async function generateMetadata({
  params,
}: PageProps<"/dashboard/categories/[categories_id]">): Promise<Metadata> {
  const { categories_id } = await params;
  const category = await getCategory(categories_id);

  if (!category) {
    return { title: "Category not found — RevoShop" };
  }

  return {
    title: `${category.name} — RevoShop`,
    description:
      category.description ?? `Category details ${category.name} at RevoShop.`,
  };
}

export default async function DashboardCategoryDetailPage({
  params,
}: PageProps<"/dashboard/categories/[categories_id]">) {
  const { categories_id } = await params;
  const category = await getCategory(categories_id);

  if (!category) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8">

      {/* Back + breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link
          href="/dashboard/categories"
          className="flex items-center gap-1.5 font-medium text-slate-500 transition hover:text-blue-700"
        >
          <ArrowLeft size={15} />
          Categories
        </Link>
        <span className="text-slate-300">/</span>
        <span className="font-semibold text-slate-800 line-clamp-1">{category.name}</span>
      </div>

      {/* Hero card — image + meta */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col sm:flex-row">

          {/* Image panel */}
          <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-slate-50 sm:w-56 md:w-72">
            {category.imageUrl ? (
              <Image
                src={category.imageUrl}
                alt={category.name}
                fill
                sizes="(max-width: 640px) 100vw, 288px"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <ImageIcon size={40} className="text-slate-300" />
              </div>
            )}
          </div>

          {/* Meta panel */}
          <div className="flex flex-1 flex-col justify-between gap-4 p-6">
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                  Category
                </p>
                <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
                  {category.name}
                </h1>
              </div>

              {category.description && (
                <p className="text-sm leading-relaxed text-slate-500">
                  {category.description}
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                {typeof category.productCount === "number" && (
                  <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700">
                    <LayoutGrid size={12} />
                    {category.productCount} product{category.productCount !== 1 ? "s" : ""}
                  </div>
                )}
                <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700">
                  <Tag size={12} />
                  ID #{category.id}
                </div>
              </div>
            </div>

            <Link
              href={`/products?category=${encodeURIComponent(category.name)}`}
              target="_blank"
              className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
            >
              View in store →
            </Link>
          </div>
        </div>
      </div>

      {/* Edit form */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="p-6">
          <EditCategoryForm category={category} />
        </div>
      </div>

      {/* Delete */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <DeleteCategoryForm category={category} />
      </div>

    </div>
  );
}
