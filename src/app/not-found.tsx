import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-6xl font-bold mb-4">404</h1>
                <p className="text-xl text-muted-foreground mb-8">
                    Prompt not found
                </p>
                <Link
                    href="/"
                    className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90"
                >
                    Go Home
                </Link>
            </div>
        </div>
    );
}
