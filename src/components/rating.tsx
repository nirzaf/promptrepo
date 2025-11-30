"use client";

import { ratePrompt } from "@/actions/interactions";
import { Star } from "lucide-react";
import { useState, useEffect } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

interface RatingProps {
    promptId: string;
    initialRating?: number;
    initialCount?: number;
    readOnly?: boolean;
}

export function Rating({ promptId, initialRating = 0, initialCount = 0, readOnly = false }: RatingProps) {
    const [rating, setRating] = useState(initialRating);
    const [count, setCount] = useState(initialCount);
    const [hover, setHover] = useState(0);
    const [hasRated, setHasRated] = useState(false);
    const [fingerprint, setFingerprint] = useState<string | null>(null);

    useEffect(() => {
        // Initialize fingerprint
        const setFp = async () => {
            const fp = await FingerprintJS.load();
            const result = await fp.get();
            setFingerprint(result.visitorId);
        };
        setFp();
    }, []);

    const handleRate = async (score: number) => {
        if (readOnly || hasRated) return;

        // Optimistic update
        setRating(score);
        setHasRated(true);
        setCount(c => c + 1);

        try {
            await ratePrompt({
                promptId,
                score,
                guestFingerprint: fingerprint || undefined,
            });
        } catch (error) {
            console.error("Failed to rate", error);
            // Revert on error
            setHasRated(false);
            setCount(c => c - 1);
        }
    };

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={readOnly || hasRated}
                    className={`focus:outline-none transition-colors ${readOnly ? "cursor-default" : "cursor-pointer hover:scale-110"
                        }`}
                    onClick={() => handleRate(star)}
                    onMouseEnter={() => !readOnly && !hasRated && setHover(star)}
                    onMouseLeave={() => !readOnly && !hasRated && setHover(0)}
                >
                    <Star
                        size={16}
                        className={`${star <= (hover || rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                    />
                </button>
            ))}
            <span className="text-xs text-muted-foreground ml-1">
                ({count})
            </span>
        </div>
    );
}
