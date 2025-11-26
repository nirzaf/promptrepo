export const dynamic = "force-dynamic";
import { getCategories } from "@/db/queries/prompts";
import Link from "next/link";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1
        className="text-4xl font-bold mb-8"
        style={{ color: 'var(--color-foreground)' }}
      >
        Browse by Category
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className="block group"
          >
            <div
              className="border rounded-lg p-6 transition-colors hover:border-primary/40"
              style={{
                backgroundColor: 'var(--color-card)',
                borderColor: 'var(--color-border)',
              }}
            >
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
                  <h2
                    className="text-xl font-semibold group-hover:text-primary transition-colors"
                    style={{ color: 'var(--color-card-foreground)' }}
                  >
                    {category.name}
                  </h2>
                  <p
                    className="text-sm"
                    style={{ color: 'var(--color-muted-foreground)' }}
                  >
                    {category.promptCount} prompts
                  </p>
                </div>
              </div>
              {category.description && (
                <p
                  className="text-sm line-clamp-2"
                  style={{ color: 'var(--color-muted-foreground)' }}
                >
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
