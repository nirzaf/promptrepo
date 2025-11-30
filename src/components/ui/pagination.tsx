"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showEllipsisStart = currentPage > 3;
    const showEllipsisEnd = currentPage < totalPages - 2;

    // Always show first page
    pages.push(1);

    // Show ellipsis or pages before current
    if (showEllipsisStart) {
      pages.push("ellipsis-start");
    } else {
      for (let i = 2; i < Math.min(currentPage, 4); i++) {
        pages.push(i);
      }
    }

    // Show current page and surrounding pages
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    // Show ellipsis or pages after current
    if (showEllipsisEnd) {
      pages.push("ellipsis-end");
    } else {
      for (let i = Math.max(currentPage + 2, totalPages - 2); i < totalPages; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }
    }

    // Always show last page
    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <nav
      className={cn("flex items-center justify-center gap-2", className)}
      aria-label="Pagination"
    >
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300",
          "border-2 border-border backdrop-blur-sm",
          "hover:border-primary hover:bg-primary/10",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-border disabled:hover:bg-transparent",
          "active:scale-95 transform-gpu"
        )}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {getPageNumbers().map((page, index) => {
          if (typeof page === "string") {
            return (
              <div
                key={`${page}-${index}`}
                className="flex items-center justify-center w-10 h-10"
              >
                <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
              </div>
            );
          }

          const isActive = page === currentPage;

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300",
                "border-2 backdrop-blur-sm font-semibold text-sm",
                "transform-gpu active:scale-95",
                isActive
                  ? "bg-linear-to-br from-primary/30 to-primary/50 border-primary text-primary shadow-lg shadow-primary/25"
                  : "border-border hover:border-primary hover:bg-primary/10 text-foreground"
              )}
              style={
                isActive
                  ? {
                      boxShadow:
                        "0 4px 15px rgba(var(--color-primary-rgb, 99, 102, 241), 0.25), inset 0 -2px 8px rgba(0, 0, 0, 0.2), inset 0 2px 8px rgba(255, 255, 255, 0.1)",
                    }
                  : undefined
              }
              aria-label={`Go to page ${page}`}
              aria-current={isActive ? "page" : undefined}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300",
          "border-2 border-border backdrop-blur-sm",
          "hover:border-primary hover:bg-primary/10",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-border disabled:hover:bg-transparent",
          "active:scale-95 transform-gpu"
        )}
        aria-label="Next page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </nav>
  );
}
