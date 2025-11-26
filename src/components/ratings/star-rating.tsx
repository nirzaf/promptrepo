"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFingerprint } from "@/hooks/use-fingerprint";

type StarRatingProps = {
    promptId: string;
    initialRating?: number;
    readonly?: boolean;
    onRate?: (rating: number) => void;
};

export function StarRating({
    promptId,
    initialRating = 0,
    readonly = false,
    onRate,
}: StarRatingProps) {
    const [rating, setRating] = useState(initialRating);
    const [hover, setHover] = useState(0);
    const { fingerprint } = useFingerprint();

    const handleClick = async (value: number) => {
        if (readonly) return;

        setRating(value);

        try {
            const response = await fetch(`/api/prompts/${promptId}/rate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    score: value,
                    fingerprint: fingerprint || undefined,
                }),
            });

            if (response.ok) {
                onRate?.(value);
            }
        } catch (error) {
            console.error("Failed to submit rating:", error);
        }
    };

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
                <button
                    key={value}
                    type="button"
                    onClick={() => handleClick(value)}
                    onMouseEnter={() => !readonly && setHover(value)}
                    onMouseLeave={() => !readonly && setHover(0)}
                    disabled={readonly}
                    className={cn(
                        "transition-colors",
                        readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
                    )}
                >
                    <Star
                        className={cn(
                            "w-5 h-5",
                            (hover || rating) >= value
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground"
                        )}
                    />
                </button>
            ))}
        </div>
    );
}
