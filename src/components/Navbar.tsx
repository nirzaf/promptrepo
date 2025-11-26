import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-black/10 bg-white/80 backdrop-blur-sm dark:border-white/10 dark:bg-black/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold">
          <span className="inline-block h-5 w-5 rounded bg-black dark:bg-white" />
          <span className="text-zinc-900 dark:text-zinc-100">PromptVault</span>
        </Link>
        <nav className="flex items-center gap-3">
          <Link href="/" className="text-sm text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white">Home</Link>
          <Link href="/requirements" className="text-sm text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white">Requirements</Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}

