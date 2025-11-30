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
            <CategoryIconChip icon={category.icon} color={category.color} />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {categoryPrompts.map((prompt, index) => (
            <div key={prompt.id} className="stagger-item" style={{ animationDelay: `${index * 0.05}s` }}>
              <PromptCard prompt={prompt} />
            </div>
          ))}
        </div>
      )}
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

function CategoryIconChip({ icon, color }: { icon: string; color: string | null }) {
  const key = toPascalCase(icon);
  const IconComp = (Icons as Record<string, any>)[key] || null;
  return (
    <div
      className="w-12 h-12 rounded-lg flex items-center justify-center"
      style={{
        backgroundColor: color ? `${color}33` : "var(--color-muted)",
        color: color || "var(--color-foreground)",
      }}
    >
      {IconComp ? <IconComp className="w-6 h-6" /> : <span className="text-xl">{icon}</span>}
    </div>
  );
}
import * as Icons from "lucide-react";
