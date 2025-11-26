import Link from "next/link"

export default function Home() {
  return (
    <div className="font-sans">
      <section className="relative overflow-hidden rounded-2xl border border-black/10 bg-gradient-to-b from-white to-zinc-50 p-10 shadow-sm dark:border-white/10 dark:from-black dark:to-zinc-900">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">PromptVault</h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">A professional, open-source AI prompts platform. Built for speed, quality, and collaboration.</p>
          <div className="mt-6 flex justify-center gap-4">
            <Link href="/requirements" className="inline-flex h-11 items-center rounded-full bg-zinc-900 px-6 text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">View Requirements</Link>
            <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center rounded-full border border-black/10 bg-white px-6 text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-white/15 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800">Learn More</a>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Modern Stack</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Next.js, React 19, Tailwind CSS v4, and a clean component architecture.</p>
        </div>
        <div className="rounded-xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Beautiful UI/UX</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Accessible, responsive, and themeable design with light and dark mode.</p>
        </div>
        <div className="rounded-xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Open Source Friendly</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Clear structure and conventions to invite contributions and innovation.</p>
        </div>
        <div className="rounded-xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Future-Ready</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Designed to scale with search, ratings, collections, and more.</p>
        </div>
      </section>
    </div>
  )
}
