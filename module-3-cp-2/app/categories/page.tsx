// Categories page — a Server Component that fetches categories from Flask.

import Card from "@/components/Card";
import { getCategories } from "@/lib/api";

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
            <Card key={category.id} className="flex flex-col gap-1">
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
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
