import { PromptForm } from "@/components/prompt-form";

export default function NewPromptPage() {
    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Create New Prompt</h1>
            <PromptForm />
        </div>
    );
}
