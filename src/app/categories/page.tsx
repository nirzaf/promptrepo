export const dynamic = "force-dynamic";
import { getCategories } from "@/db/queries/prompts";
import Link from "next/link";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Browse by Category</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className="block group"
          >
            <div className="border border-border rounded-lg p-6 bg-white dark:bg-[oklch(0.16_0.01_286)] transition-colors hover:bg-gray-50 dark:hover:bg-[oklch(0.18_0.01_286)] hover:border-primary/40">
              <div className="flex items-center gap-4 mb-3">
                {category.icon && (
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                    style={{
                      backgroundColor: category.color
                        ? `${category.color}33`
                        : "var(--color-muted)",
                      color: category.color || "var(--color-foreground)",
                    }}
                  >
                    {category.icon}
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                    {category.name}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {category.promptCount} prompts
                  </p>
                </div>
              </div>
              {category.description && (
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                  {category.description}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
