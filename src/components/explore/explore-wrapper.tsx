"use client";

import { Suspense } from "react";
import { ExploreClient } from "./explore-client";

type Prompt = {
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
        id: string;
        name: string;
        slug: string;
        color: string | null;
    } | null;
    aiModel: {
        id: string;
        name: string;
        slug: string;
    } | null;
};

type Category = {
    id: string;
    name: string;
    slug: string;
};

type AIModel = {
    id: string;
    name: string;
    slug: string;
};

interface ExploreWrapperProps {
    initialPrompts: Prompt[];
    categories: Category[];
    aiModels: AIModel[];
    itemsPerPage?: number;
}

function ExploreClientFallback() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-12">
                <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gradient">
                    Explore Prompts
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                    Loading...
                </p>
            </div>
        </div>
    );
}

export function ExploreWrapper(props: ExploreWrapperProps) {
    return (
        <Suspense fallback={<ExploreClientFallback />}>
            <ExploreClient {...props} />
        </Suspense>
    );
}
