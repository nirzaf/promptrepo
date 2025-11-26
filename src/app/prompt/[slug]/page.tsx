export const dynamic = "force-dynamic";
import { getPromptBySlug } from "@/db/queries/prompts";
import { notFound } from "next/navigation";
import { Eye, Star, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/shared/copy-button";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function PromptDetailPage({ params }: Props) {
  const { slug } = await params;
  const prompt = await getPromptBySlug(slug);

  if (!prompt) {
    notFound();
  }

  const rating = prompt.ratingAvg ? parseFloat(prompt.ratingAvg) : 0;
  const ratingCount = prompt.ratingCount || 0;
  const viewCount = prompt.viewCount || 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        {/* Category Badge */}
        {prompt.category && (
          <div className="mb-4">
            <span
              className="inline-block px-3 py-1 rounded-full text-sm font-medium"
              style={{
                backgroundColor: prompt.category.color
                  ? `${prompt.category.color}20`
                  : "var(--color-muted)",
                color: prompt.category.color || "var(--color-foreground)",
              }}
            >
              {prompt.category.name}
            </span>
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl font-bold mb-4">{prompt.title}</h1>

        {/* Description */}
        {prompt.description && (
          <p className="text-xl text-muted-foreground mb-6">
            {prompt.description}
          </p>
        )}

        {/* Stats & Actions */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{viewCount} views</span>
            </div>
            {ratingCount > 0 && (
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>
                  {rating.toFixed(1)} ({ratingCount} ratings)
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <CopyButton content={prompt.content} promptId={prompt.id} />
            <Button variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-card border rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Prompt</h2>
        <div className="rounded-lg p-4 font-mono text-sm whitespace-pre-wrap" style={{ backgroundColor: 'var(--color-muted)', color: 'var(--color-muted-foreground)' }}>
          {prompt.content}
        </div>
      </div>

      {/* Instructions */}
      {prompt.instructions && (
        <div className="bg-card border rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">How to Use</h2>
          <div className="prose prose-sm max-w-none">{prompt.instructions}</div>
        </div>
      )}

      {/* Example Output */}
      {prompt.exampleOutput && (
        <div className="bg-card border rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Example Output</h2>
          <div className="rounded-lg p-4 text-sm whitespace-pre-wrap" style={{ backgroundColor: 'var(--color-muted)', color: 'var(--color-muted-foreground)' }}>
            {prompt.exampleOutput}
          </div>
        </div>
      )}

      {/* Author Info */}
      {prompt.user && (
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">About the Author</h2>
          <div className="flex items-center gap-4">
            {prompt.user.image && (
              <img
                src={prompt.user.image}
                alt={prompt.user.name || "User"}
                className="w-12 h-12 rounded-full"
              />
            )}
            <div>
              <div className="font-medium">
                {prompt.user.name || prompt.user.username || "Anonymous"}
              </div>
              {prompt.user.username && (
                <div className="text-sm text-muted-foreground">
                  @{prompt.user.username}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
