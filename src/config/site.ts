export const SITE_CONFIG = {
    name: "PromptVault",
    description: "Discover, share, and collaborate on AI prompts",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    ogImage: "/og-image.png",
    links: {
        twitter: "https://twitter.com/promptvault",
        github: "https://github.com/promptvault",
    },
};

export const DEFAULT_CATEGORIES = [
    {
        name: "Writing & Content",
        slug: "writing-content",
        description: "Prompts for creative writing, copywriting, and content creation",
        icon: "✍️",
        color: "#8B5CF6",
    },
    {
        name: "Code & Development",
        slug: "code-development",
        description: "Programming, debugging, and software development prompts",
        icon: "💻",
        color: "#3B82F6",
    },
    {
        name: "Business & Marketing",
        slug: "business-marketing",
        description: "Business strategy, marketing, and sales prompts",
        icon: "💼",
        color: "#10B981",
    },
    {
        name: "Education & Learning",
        slug: "education-learning",
        description: "Teaching, learning, and educational prompts",
        icon: "📚",
        color: "#F59E0B",
    },
    {
        name: "Creative & Design",
        slug: "creative-design",
        description: "Art, design, and creative prompts",
        icon: "🎨",
        color: "#EC4899",
    },
    {
        name: "Data & Analysis",
        slug: "data-analysis",
        description: "Data analysis, research, and insights prompts",
        icon: "📊",
        color: "#6366F1",
    },
];

export const DEFAULT_AI_MODELS = [
    {
        name: "ChatGPT",
        slug: "chatgpt",
        provider: "OpenAI",
        color: "#10A37F",
    },
    {
        name: "Claude",
        slug: "claude",
        provider: "Anthropic",
        color: "#D97757",
    },
    {
        name: "Gemini",
        slug: "gemini",
        provider: "Google",
        color: "#4285F4",
    },
    {
        name: "Llama",
        slug: "llama",
        provider: "Meta",
        color: "#0668E1",
    },
    {
        name: "Mistral",
        slug: "mistral",
        provider: "Mistral AI",
        color: "#FF7000",
    },
];
