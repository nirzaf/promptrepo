"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Copy, Settings, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type PromptVariable = {
    name: string;
    type: "text" | "textarea" | "select" | "number";
    label: string;
    placeholder?: string;
    options?: string[];
    defaultValue?: string;
};

type PromptPlaygroundProps = {
    promptContent: string;
    variables?: {
        variables: PromptVariable[];
    } | null;
};

export function PromptPlayground({ promptContent, variables }: PromptPlaygroundProps) {
    const [variableValues, setVariableValues] = useState<Record<string, string>>({});
    const [processedPrompt, setProcessedPrompt] = useState(promptContent);
    const [apiKey, setApiKey] = useState("");
    const [showApiKeyInput, setShowApiKeyInput] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [aiResponse, setAiResponse] = useState("");
    const [copied, setCopied] = useState(false);

    // Parse variables or return empty array
    const parsedVariables = variables?.variables || [];

    // No variables defined, show simplified view
    if (parsedVariables.length === 0) {
        return null; // Don't show playground if no variables
    }

    // Update variable value and regenerate prompt
    const handleVariableChange = (name: string, value: string) => {
        const newValues = { ...variableValues, [name]: value };
        setVariableValues(newValues);

        // Replace variables in prompt content
        let processed = promptContent;
        Object.entries(newValues).forEach(([varName, varValue]) => {
            const regex = new RegExp(`\\{\\{${varName}\\}\\}`, "g");
            processed = processed.replace(regex, varValue || `{{${varName}}}`);
        });
        setProcessedPrompt(processed);
    };

    // Copy processed prompt
    const handleCopy = async () => {
        await navigator.clipboard.writeText(processedPrompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Test with AI (placeholder - would integrate with OpenAI/Anthropic)
    const handleTestWithAI = async () => {
        if (!apiKey) {
            setShowApiKeyInput(true);
            return;
        }

        setIsLoading(true);
        setAiResponse("");

        try {
            // This is a placeholder - in production, you'd integrate with OpenAI/Anthropic SDK
            // For now, just simulate a response
            await new Promise(resolve => setTimeout(resolve, 1500));
            setAiResponse("AI integration coming soon! This will test your prompt with OpenAI or Anthropic using your API key stored securely in localStorage.");
        } catch (error) {
            setAiResponse("Error: Failed to connect to AI service. Please check your API key.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="glass gradient-border rounded-xl p-8 mb-8 card-interactive">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/10 ring-2 ring-purple-500/20">
                        <Play className="w-6 h-6 text-purple-500" />
                    </div>
                    <h2 className="text-2xl font-bold">Interactive Playground</h2>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                    className="gap-2"
                >
                    <Settings className="w-4 h-4" />
                    API Settings
                </Button>
            </div>

            {showApiKeyInput && (
                <div className="mb-6 p-4 rounded-lg bg-card/50 border border-border/50">
                    <Label htmlFor="apiKey" className="text-sm font-medium mb-2 block">
                        OpenAI API Key (stored locally)
                    </Label>
                    <Input
                        id="apiKey"
                        type="password"
                        placeholder="sk-..."
                        value={apiKey}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setApiKey(e.target.value)}
                        className="mb-2"
                    />
                    <p className="text-xs text-muted-foreground">
                        Your API key is stored only in your browser's localStorage and never sent to our servers.
                    </p>
                </div>
            )}

            {/* Variable Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {parsedVariables.map((variable) => (
                    <div key={variable.name}>
                        <Label htmlFor={variable.name} className="text-sm font-medium mb-2 block">
                            {variable.label}
                        </Label>
                        {variable.type === "text" && (
                            <Input
                                id={variable.name}
                                type="text"
                                placeholder={variable.placeholder}
                                value={variableValues[variable.name] || ""}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleVariableChange(variable.name, e.target.value)}
                            />
                        )}
                        {variable.type === "textarea" && (
                            <Textarea
                                id={variable.name}
                                placeholder={variable.placeholder}
                                value={variableValues[variable.name] || ""}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleVariableChange(variable.name, e.target.value)}
                                rows={3}
                            />
                        )}
                        {variable.type === "number" && (
                            <Input
                                id={variable.name}
                                type="number"
                                placeholder={variable.placeholder}
                                value={variableValues[variable.name] || ""}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleVariableChange(variable.name, e.target.value)}
                            />
                        )}
                        {variable.type === "select" && variable.options && (
                            <Select
                                value={variableValues[variable.name] || ""}
                                onValueChange={(value: string) => handleVariableChange(variable.name, value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={variable.placeholder || "Select..."} />
                                </SelectTrigger>
                                <SelectContent>
                                    {variable.options.map((option) => (
                                        <SelectItem key={option} value={option}>
                                            {option}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>
                ))}
            </div>

            {/* Preview */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                    <Label className="text-sm font-medium">Preview</Label>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopy}
                        className="gap-2"
                    >
                        {copied ? (
                            <>
                                <Check className="w-4 h-4 text-green-500" />
                                <span className="text-green-500">Copied!</span>
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4" />
                                Copy
                            </>
                        )}
                    </Button>
                </div>
                <div className="rounded-xl p-6 bg-card/50 border border-border/50 shadow-inner">
                    <div className="prose max-w-none">
                        {/* @ts-expect-error remark-gfm type mismatch */}
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {processedPrompt}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>

            {/* Test with AI */}
            <div className="flex gap-3">
                <Button
                    onClick={handleTestWithAI}
                    disabled={isLoading}
                    className="gap-2"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Testing...
                        </>
                    ) : (
                        <>
                            <Play className="w-4 h-4" />
                            Test with AI
                        </>
                    )}
                </Button>
            </div>

            {/* AI Response */}
            {aiResponse && (
                <div className="mt-6 p-4 rounded-lg bg-card/50 border border-border/50">
                    <Label className="text-sm font-medium mb-2 block">AI Response</Label>
                    <div className="prose max-w-none">
                        <p className="text-sm text-muted-foreground">{aiResponse}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
