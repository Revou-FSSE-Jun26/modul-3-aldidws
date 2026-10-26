import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories, getCategory } from "@/lib/api";
import Card from "@/components/Card";

export const revalidate = 300;

export async function generateStaticParams() {
  const categories = await getCategories({ cache: "force-cache" });
  return categories.map((category) => ({
    categories_id: String(category.id),
  }));
}

export default async function CategoriesDetailPage({
  params,
}: PageProps<"/categories/[categories_id]">) {
  const { categories_id } = await params;
  const category = await getCategory(categories_id, {
    revalidate: 300,
    tags: ["categories", `category:${categories_id}`],
  });

  if (!category) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/categories"
        className="text-sm text-foreground/60 hover:underline"
      >
        &larr; Back to categories
      </Link>

      <Card className="flex flex-col gap-2">
        <h1 className="text-xl font-bold">{category.name}</h1>
        {category.description && (
          <p className="text-sm text-foreground/60">{category.description}</p>
        )}
        {typeof category.productCount === "number" && (
          <span className="text-xs text-foreground/50">
            {category.productCount} product in this category
          </span>
        )}
      </Card>
    </div>
  );
}
