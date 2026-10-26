import Link from "next/link";
import Card from "@/components/Card";
import AddCategoryForm from "@/components/AddCategoryForm";
import { getCategories } from "@/lib/api";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Category — Revo Otoshop",
};

export default async function CategoriesPage() {
  const categories = await getCategories();

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
              href={`/dashboard/categories/${category.id}`}
              aria-label={`Manage ${category.name}`}
              className="rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-foreground/40"
            >
              <Card className="flex h-full flex-col gap-1">
                <h2 className="text-base font-semibold">{category.name}</h2>
                {category.description && (
                  <p className="text-sm text-foreground/60">
                    {category.description}
                  </p>
                )}
                {typeof category.productCount === "number" && (
                  <span className="mt-1 text-xs text-foreground/50">
                    {category.productCount} product
                  </span>
                )}
                <span className="mt-2 text-sm font-medium text-foreground/70">
                  Manage category &rarr;
                </span>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <section className="mt-6 flex flex-col gap-6 border-t border-black/10 pt-6 dark:border-white/15">
        <AddCategoryForm />
      </section>
    </div>
  );
}
