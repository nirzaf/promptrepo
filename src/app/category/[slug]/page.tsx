export const dynamic = "force-dynamic";
import { getCategories } from "@/db/queries/prompts";
import { getPublicPrompts } from "@/db/queries/prompts";
import { PromptCard } from "@/components/prompts/prompt-card";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const [categories, prompts] = await Promise.all([
    getCategories(),
    getPublicPrompts(50),
  ]);

  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const categoryPrompts = prompts.filter((p) => p.category?.slug === slug);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
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
          <div>
            <h1 className="text-4xl font-bold">{category.name}</h1>
            {category.description && (
              <p className="text-muted-foreground mt-1">
                {category.description}
              </p>
            )}
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {category.promptCount} prompts
        </div>
      </div>

      {categoryPrompts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No prompts found in this category yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryPrompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      )}
    </div>
  );
}
