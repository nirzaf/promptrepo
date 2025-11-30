"use client";

import Link from "next/link";
import { Star, Copy, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";

type PromptCardProps = {
    prompt: {
        id: string;
        slug: string;
        title: string;
        description: string | null;
        content: string | null;
        viewCount: number | null;
        copyCount: number | null;
        ratingAvg: string | null;
        ratingCount: number | null;
        user: {
            name: string | null;
            username: string | null;
            image: string | null;
        } | null;
        category: {
            name: string;
            slug: string;
            color: string | null;
        } | null;
    };
};

export function PromptCard({ prompt }: PromptCardProps) {
    const [copied, setCopied] = useState(false);
    const rating = prompt.ratingAvg ? Number.parseFloat(prompt.ratingAvg) : 0;
    const viewCount = prompt.viewCount || 0;
    const copyCount = prompt.copyCount || 0;
    const ratingCount = prompt.ratingCount || 0;

    const handleQuickCopy = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            // Copy the actual prompt content if available, otherwise fall back to title
            const textToCopy = prompt.content || prompt.title;
            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("Failed to copy:", error);
        }
    };

    return (
        <Link href={`/prompt/${prompt.slug}`} className="block group">
            <Card className="relative p-6 glass gradient-border card-interactive transition-all duration-300 will-change-transform">
                {/* Quick Copy Button */}
                <button
                    type="button"
                    onClick={handleQuickCopy}
                    className={cn(
                        "absolute top-4 right-4 p-3 rounded-xl transition-all duration-300 z-10",
                        "opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0",
                        "backdrop-blur-md border-2",
                        "shadow-lg hover:shadow-xl",
                        "active:scale-95 active:translate-y-0.5",
                        "transform-gpu will-change-transform",
                        copied
                            ? "bg-linear-to-br from-green-400/30 to-green-600/30 border-green-400/60 shadow-green-500/25"
                            : "bg-linear-to-br from-primary/20 to-primary/40 border-primary/40 hover:border-primary/60 shadow-primary/20",
                        copied && "animate-bounce-subtle"
                    )}
                    style={{
                        boxShadow: copied
                            ? "0 4px 15px rgba(34, 197, 94, 0.3), inset 0 -2px 8px rgba(0, 0, 0, 0.2), inset 0 2px 8px rgba(255, 255, 255, 0.1)"
                            : "0 4px 15px rgba(var(--color-primary-rgb, 99, 102, 241), 0.25), inset 0 -2px 8px rgba(0, 0, 0, 0.2), inset 0 2px 8px rgba(255, 255, 255, 0.1)"
                    }}
                    aria-label="Quick copy"
                >
                    {copied ? (
                        <div className="relative">
                            <svg
                                className="w-5 h-5 text-green-400 animate-scale-in"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <title>Copied</title>
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2.5}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                            <div className="absolute inset-0 animate-ping opacity-75">
                                <svg
                                    className="w-5 h-5 text-green-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <title>Success indicator</title>
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2.5}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                        </div>
                    ) : (
                        <Copy className="w-5 h-5 text-primary transition-transform group-hover:scale-110" />
                    )}
                </button>

                {/* Category Badge */}
                {prompt.category && (
                    <div className="mb-3">
                        <span
                            className="inline-block px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
                            style={{
                                backgroundColor: prompt.category.color
                                    ? `${prompt.category.color}55`
                                    : "var(--color-muted)",
                                color: "var(--color-card-foreground)",
                                border: `1px solid ${prompt.category.color || 'var(--color-border)'}40`,
                            }}
                        >
                            {prompt.category.name}
                        </span>
                    </div>
                )}

                {/* Title */}
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2 drop-shadow-[0_1px_8px_rgba(255,255,255,0.06)]">
                    {prompt.title}
                </h3>

                {/* Description */}
                {prompt.description && (
                    <div className="text-card-foreground/80 mb-4 line-clamp-2 drop-shadow-[0_1px_6px_rgba(255,255,255,0.05)] prose prose-sm max-w-none">
                        {/* @ts-expect-error remark-gfm type mismatch */}
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {prompt.description}
                        </ReactMarkdown>
                    </div>
                )}

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1 transition-colors hover:text-foreground">
                        <Eye className="w-4 h-4" />
                        <span>{viewCount}</span>
                    </div>
                    <div className="flex items-center gap-1 transition-colors hover:text-foreground">
                        <Copy className="w-4 h-4" />
                        <span>{copyCount}</span>
                    </div>
                    {ratingCount > 0 && (
                        <div className="flex items-center gap-1 transition-colors hover:text-foreground">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{rating.toFixed(1)}</span>
                            <span className="text-xs">({ratingCount})</span>
                        </div>
                    )}
                </div>

                {/* Author */}
                <div className="flex items-center gap-2 text-sm">
                    {prompt.user ? (
                        <>
                            {prompt.user.image && (
                                <img
                                    src={prompt.user.image}
                                    alt={prompt.user.name || "User"}
                                    className="w-6 h-6 rounded-full ring-2 ring-primary/20 transition-all group-hover:ring-primary/40"
                                />
                            )}
                            <span className="text-muted-foreground transition-colors group-hover:text-foreground">
                                by {prompt.user.name || prompt.user.username || "Anonymous"}
                            </span>
                        </>
                    ) : (
                        <span className="text-muted-foreground italic">
                            by General User
                        </span>
                    )}
                </div>
            </Card>
        </Link>
    );
}
