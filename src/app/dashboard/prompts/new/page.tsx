export default function NewPromptPage() {
    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Create New Prompt</h1>

            <form className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium mb-2">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
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
                        rows={3}
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
                        rows={10}
                        className="w-full border rounded-md px-3 py-2 font-mono text-sm"
                        placeholder="Enter your prompt here..."
                    />
                </div>

                <div>
                    <label htmlFor="category" className="block text-sm font-medium mb-2">
                        Category
                    </label>
                    <select id="category" className="w-full border rounded-md px-3 py-2">
                        <option value="">Select a category</option>
                        <option value="writing-content">Writing & Content</option>
                        <option value="code-development">Code & Development</option>
                        <option value="business-marketing">Business & Marketing</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="aiModel" className="block text-sm font-medium mb-2">
                        AI Model
                    </label>
                    <select id="aiModel" className="w-full border rounded-md px-3 py-2">
                        <option value="">Select an AI model</option>
                        <option value="chatgpt">ChatGPT</option>
                        <option value="claude">Claude</option>
                        <option value="gemini">Gemini</option>
                    </select>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90"
                    >
                        Publish Prompt
                    </button>
                    <button
                        type="button"
                        className="px-6 py-2 border rounded-md font-medium hover:bg-accent"
                    >
                        Save as Draft
                    </button>
                </div>
            </form>
        </div>
    );
}
