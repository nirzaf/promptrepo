"use client";

import { useState } from "react";
import { PromptCard } from "@/components/prompts/prompt-card";
import { Pagination } from "@/components/ui/pagination";

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
};

interface ExploreClientProps {
  prompts: Prompt[];
  itemsPerPage?: number;
}

export function ExploreClient({ prompts, itemsPerPage = 12 }: ExploreClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const totalPages = Math.ceil(prompts.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPrompts = prompts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setIsTransitioning(true);

    // Trigger fade out
    setTimeout(() => {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Trigger fade in
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 150);
  };

  return (
    <>
      {/* Prompts Grid */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 auto-rows-fr mb-12 transition-opacity duration-300 ${
          isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        {currentPrompts.map((prompt, index) => (
          <div
            key={`${prompt.id}-${currentPage}`}
            className="stagger-item"
            style={{ animationDelay: `${index * 0.03}s` }}
          >
            <PromptCard prompt={prompt} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 mb-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{startIndex + 1}</span>-
              <span className="font-semibold text-foreground">{Math.min(endIndex, prompts.length)}</span> of{" "}
              <span className="font-semibold text-foreground">{prompts.length}</span> prompts
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Page {currentPage} of {totalPages}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
