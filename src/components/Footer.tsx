export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-8 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} PromptVault</p>
        <div className="flex gap-4">
          <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="hover:underline">Built with Next.js</a>
          <a href="/requirements" className="hover:underline">Project Requirements</a>
        </div>
      </div>
    </footer>
  )
}
