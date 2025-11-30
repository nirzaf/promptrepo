"use client";

import { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

type CopyButtonProps = {
    content: string;
    promptId?: string;
};

export function CopyButton({ content, promptId }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const triggerConfetti = () => {
        const count = 50;
        const defaults = {
            origin: { y: 0.7 },
            zIndex: 9999,
        };

        function fire(particleRatio: number, opts: confetti.Options) {
            confetti({
                ...defaults,
                ...opts,
                particleCount: Math.floor(count * particleRatio),
            });
        }

        fire(0.25, {
            spread: 26,
            startVelocity: 55,
        });

        fire(0.2, {
            spread: 60,
        });

        fire(0.35, {
            spread: 100,
            decay: 0.91,
            scalar: 0.8,
        });

        fire(0.1, {
            spread: 120,
            startVelocity: 25,
            decay: 0.92,
            scalar: 1.2,
        });

        fire(0.1, {
            spread: 120,
            startVelocity: 45,
        });
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(content);
        setCopied(true);
        triggerConfetti();

        // Track copy event
        if (promptId) {
            try {
                await fetch(`/api/prompts/${promptId}/copy`, { method: "POST" });
            } catch (error) {
                console.error("Failed to track copy:", error);
            }
        }

        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Button
            variant="default"
            onClick={handleCopy}
            className={copied ? "morph-button copied" : "morph-button"}
        >
            {copied ? (
                <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                </>
            ) : (
                <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Prompt
                </>
            )}
        </Button>
    );
}
