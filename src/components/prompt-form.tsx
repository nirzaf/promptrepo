"use client";

import { createPrompt } from "@/actions/prompts";
import { useFormStatus } from "react-dom";
import { useState } from "react";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 disabled:opacity-50"
        >
            {pending ? "Publishing..." : "Publish Prompt"}
        </button>
    );
}

export function PromptForm() {
    const [error, setError] = useState<string | null>(null);

    async function clientAction(formData: FormData) {
        try {
            await createPrompt(formData);
        } catch (e: any) {
            setError(e.message);
        }
    }

    return (
        <form action={clientAction} className="space-y-6">
            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                    {error}
                </div>
            )}
            <div>
                <label htmlFor="title" className="block text-sm font-medium mb-2">
                    Title
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    minLength={5}
                    maxLength={255}
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="Give your prompt a descriptive title"
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium mb-2">
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    rows={3}
                    maxLength={500}
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="Briefly describe what this prompt does"
                />
            </div>

            <div>
                <label htmlFor="content" className="block text-sm font-medium mb-2">
                    Prompt Content
                </label>
                <textarea
                    id="content"
                    name="content"
                    required
                    minLength={20}
                    maxLength={10000}
                    rows={10}
                    className="w-full border rounded-md px-3 py-2 font-mono text-sm"
                    placeholder="Enter your prompt here..."
                />
            </div>

            <div>
                <label htmlFor="instructions" className="block text-sm font-medium mb-2">
                    Instructions (Optional)
                </label>
                <textarea
                    id="instructions"
                    name="instructions"
                    rows={3}
                    maxLength={2000}
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="How should this prompt be used?"
                />
            </div>

            <div>
                <label htmlFor="categoryId" className="block text-sm font-medium mb-2">
                    Category
                </label>
                <select id="categoryId" name="categoryId" className="w-full border rounded-md px-3 py-2">
                    <option value="">Select a category</option>
                    <option value="writing-content">Writing & Content</option>
                    <option value="code-development">Code & Development</option>
                    <option value="business-marketing">Business & Marketing</option>
                    {/* Ideally fetch categories dynamically */}
                </select>
            </div>

            <div>
                <label htmlFor="aiModelId" className="block text-sm font-medium mb-2">
                    AI Model
                </label>
                <select id="aiModelId" name="aiModelId" className="w-full border rounded-md px-3 py-2">
                    <option value="">Select an AI model</option>
                    <option value="chatgpt">ChatGPT</option>
                    <option value="claude">Claude</option>
                    <option value="gemini">Gemini</option>
                    {/* Ideally fetch models dynamically */}
                </select>
            </div>

            <div>
                <label htmlFor="visibility" className="block text-sm font-medium mb-2">
                    Visibility
                </label>
                <select id="visibility" name="visibility" className="w-full border rounded-md px-3 py-2">
                    <option value="public">Public</option>
                    <option value="unlisted">Unlisted</option>
                    <option value="private">Private</option>
                </select>
            </div>

            <div className="flex gap-4">
                <SubmitButton />
                <button
                    type="button"
                    className="px-6 py-2 border rounded-md font-medium hover:bg-accent"
                >
                    Save as Draft
                </button>
            </div>
        </form>
    );
}
