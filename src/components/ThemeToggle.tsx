'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const stored = localStorage.getItem('theme')
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const shouldDark = stored ? stored === 'dark' : prefersDark
      setIsDark(shouldDark)
      const el = document.documentElement
      if (shouldDark) el.classList.add('dark')
      else el.classList.remove('dark')
    } catch {}
  }, [])

  const toggle = () => {
    const next = !isDark
    setIsDark(next)
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light')
    } catch {}
    const el = document.documentElement
    if (next) el.classList.add('dark')
    else el.classList.remove('dark')
  }

  return (
    <button
      type="button"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={toggle}
      className="inline-flex h-9 items-center rounded-full border border-border bg-card px-3 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-card/90"
    >
      <span className="mr-2 inline-block h-4 w-4 align-middle">
        {mounted && (
          isDark ? (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M12 2a1 1 0 011 1v2a1 1 0 01-2 0V3a1 1 0 011-1zm8.66 3.34a1 1 0 010 1.41l-1.41 1.41a1 1 0 01-1.41-1.41l1.41-1.41a1 1 0 011.41 0zM21 13a1 1 0 010 2h-2a1 1 0 010-2h2zM6 13a1 1 0 010 2H4a1 1 0 010-2h2zm14.07 5.66a1 1 0 01-1.41 1.41l-1.41-1.41a1 1 0 111.41-1.41l1.41 1.41zM7.76 5.76a1 1 0 010 1.41L6.34 8.59a1 1 0 11-1.41-1.41l1.41-1.41a1 1 0 011.41 0zM13 21a1 1 0 01-2 0v-2a1 1 0 012 0v2zM5.34 19.66a1 1 0 010-1.41l1.41-1.41a1 1 0 111.41 1.41L6.75 19.66a1 1 0 01-1.41 0z" />
            </svg>
          )
        )}
      </span>
      {mounted ? (isDark ? 'Dark' : 'Light') : 'Theme'}
    </button>
  )
}
