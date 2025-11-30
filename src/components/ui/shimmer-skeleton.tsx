"use client";

import { cn } from "@/lib/utils";

type ShimmerSkeletonProps = {
    variant?: "avatar" | "title" | "text" | "card";
    className?: string;
};

export function ShimmerSkeleton({ variant = "text", className }: ShimmerSkeletonProps) {
    const baseClasses = "shimmer rounded-md";

    const variantClasses = {
        avatar: "w-12 h-12 rounded-full",
        title: "h-8 w-3/4",
        text: "h-4 w-full",
        card: "h-48 w-full",
    };

    return (
        <div className={cn(baseClasses, variantClasses[variant], className)} />
    );
}

type PromptCardSkeletonProps = {
    className?: string;
};

export function PromptCardSkeleton({ className }: PromptCardSkeletonProps) {
    return (
        <div className={cn("p-6 border rounded-lg bg-card", className)}>
            <div className="space-y-4">
                {/* Category badge */}
                <ShimmerSkeleton variant="text" className="w-24 h-6" />

                {/* Title */}
                <ShimmerSkeleton variant="title" />

                {/* Description */}
                <div className="space-y-2">
                    <ShimmerSkeleton variant="text" />
                    <ShimmerSkeleton variant="text" className="w-5/6" />
                </div>

                {/* Stats */}
                <div className="flex gap-4">
                    <ShimmerSkeleton variant="text" className="w-16 h-4" />
                    <ShimmerSkeleton variant="text" className="w-16 h-4" />
                    <ShimmerSkeleton variant="text" className="w-20 h-4" />
                </div>

                {/* Author */}
                <div className="flex items-center gap-2">
                    <ShimmerSkeleton variant="avatar" className="w-6 h-6" />
                    <ShimmerSkeleton variant="text" className="w-32 h-4" />
                </div>
            </div>
        </div>
    );
}
