import type { Metadata } from 'next'
import RequirementsClient from '@/components/RequirementsClient'

export const metadata: Metadata = {
  title: 'Project Requirements | PromptVault',
  description: 'Architectural plan and requirements rendered from the repository document.',
}

export default function RequirementsPage() {
  return <RequirementsClient />
}

