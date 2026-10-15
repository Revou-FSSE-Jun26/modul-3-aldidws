import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategory } from "@/lib/api";
import Card from "@/components/Card";
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
      <Link
        href="/dashboard/categories"
        className="text-sm text-foreground/60 hover:underline"
      >
        &larr; Back to categories
      </Link>

      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight">{category.name}</h2>
        <p className="text-foreground/70">
          {category.description ?? "There is no description for this category."}
        </p>
      </div>

      <Card className="flex flex-col gap-1">
        <h2 className="text-base font-semibold">{category.name}</h2>
        {category.description && (
          <p className="text-sm text-foreground/60">{category.description}</p>
        )}
        {typeof category.productCount === "number" && (
          <span className="text-xs text-foreground/50">
            {category.productCount} product in this category
          </span>
        )}
      </Card>

      <section className="mt-6 flex flex-col gap-6 border-t border-black/10 pt-6 dark:border-white/15">
        <EditCategoryForm category={category} />
        <DeleteCategoryForm category={category} />
      </section>
    </div>
  );
}
