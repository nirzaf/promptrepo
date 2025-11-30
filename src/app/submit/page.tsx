import { PromptForm } from "@/components/prompt-form";

export default function SubmitPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <h1 className="text-3xl font-bold mb-8">Submit a Prompt</h1>
            <div className="bg-card border rounded-lg p-6 shadow-sm">
                <p className="text-muted-foreground mb-6">
                    Share your best prompts with the community. No login required.
                </p>
                <PromptForm />
            </div>
        </div>
    );
}
