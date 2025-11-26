import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold">
          <span className="inline-block h-5 w-5 rounded bg-foreground/90" />
          <span className="text-foreground">PromptVault</span>
        </Link>
        <nav className="flex items-center gap-3">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">Home</Link>
          <Link href="/requirements" className="text-sm text-muted-foreground hover:text-foreground">Requirements</Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
