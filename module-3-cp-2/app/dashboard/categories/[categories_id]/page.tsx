import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategory } from "@/lib/api";
import EditCategoryForm from "@/components/EditCategoryForm";
import DeleteCategoryForm from "@/components/DeleteCategoryForm";

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
    <div className="flex flex-col gap-6">
      {/* Back link */}
      <Link
        href="/dashboard/categories"
        className="text-sm text-foreground/60 hover:underline"
      >
        &larr; Back to categories
      </Link>

      {/* Page header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">{category.name}</h1>
        <div className="flex flex-wrap items-center gap-2">
          {typeof category.productCount === "number" && (
            <span className="w-fit rounded-full bg-foreground/10 px-3 py-1 text-xs font-medium">
              {category.productCount} product{category.productCount !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        <p className="text-foreground/70">
          {category.description ?? "No description for this category."}
        </p>
      </div>

      {/* Forms */}
      <div className="flex flex-col gap-8">
        <section className="mt-6 flex flex-col border-t border-black/10 pt-6 dark:border-white/15">
          <EditCategoryForm category={category} />
          <div className="mt-16 border-t border-black/10 pt-10 dark:border-white/15">
            <DeleteCategoryForm category={category} />
          </div>
        </section>
      </div>
    </div>
  );
}
