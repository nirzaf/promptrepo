"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

type CopyButtonProps = {
    content: string;
    promptId?: string;
};

export function CopyButton({ content, promptId }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(content);
        setCopied(true);

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
        <Button variant="default" onClick={handleCopy}>
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
