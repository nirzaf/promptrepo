export const dynamic = "force-dynamic";
import { getCategories } from "@/db/queries/prompts";
import Link from "next/link";
import * as Icons from "lucide-react";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Header */}
      <div className="text-center mb-12 relative">
        <div className="inline-block">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-gradient">
            Browse by Category
          </h1>
          <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent rounded-full" />
        </div>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover exceptional prompts organized by category
        </p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className="block group spotlight-container stagger-item"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="glass gradient-border card-interactive rounded-xl p-6 border border-border/60 h-full overflow-hidden relative">
              {/* Animated background gradient */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${category.color || "var(--color-primary)"}, transparent 70%)`,
                  }}
                />
              </div>

              {/* Content */}
              <div className="relative z-10">
                {/* Icon and Arrow */}
                <div className="flex items-start justify-between mb-4">
                  {category.icon && (
                    <CategoryIconChip
                      icon={category.icon}
                      color={category.color}
                    />
                  )}
                  <div className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 text-primary">
                    <Icons.ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                  {category.name}
                </h2>

                {/* Description */}
                {category.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {category.description}
                  </p>
                )}

                {/* Badge */}
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
                    <Icons.Sparkles className="w-3 h-3" />
                    {category.promptCount} prompts
                  </span>
                </div>
              </div>

              {/* Shine effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </div>
            </div>
            <div className="spotlight"></div>
          </Link>
        ))}
      </div>

      {/* Decorative Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}

function toPascalCase(input: string): string {
  return input
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

function CategoryIconChip({
  icon,
  color,
}: {
  icon: string;
  color: string | null;
}) {
  const key = toPascalCase(icon);
  const IconComp = (Icons as Record<string, any>)[key] || null;
  return (
    <div
      className="w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center ring-1"
      style={{
        backgroundColor: color ? `${color}22` : "var(--color-muted)",
        color: color || "var(--color-foreground)",
        borderColor: "var(--color-border)",
      }}
    >
      {IconComp ? (
        <IconComp className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
      ) : (
        <span className="text-xs sm:text-sm">{icon}</span>
      )}
    </div>
  );
}
