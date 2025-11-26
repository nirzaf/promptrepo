'use client'

import { useEffect, useState } from 'react'
import { marked } from 'marked'

export default function RequirementsClient() {
  const [md, setMd] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    marked.setOptions({ gfm: true, breaks: true })
    fetch('/api/requirements')
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to load requirements')
        const text = await res.text()
        setMd(text)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-8 w-64 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-5/6 rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>
    )
  }

  if (error) {
    return <p className="text-red-600 dark:text-red-400">{error}</p>
  }

  const html = marked.parse(md)

  return <div className="md-content" dangerouslySetInnerHTML={{ __html: html }} />
}

