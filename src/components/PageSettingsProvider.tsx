// components/PageSettingsProvider.tsx
'use client'

import { useEffect } from 'react'
import { usePageSettingsStore } from '../store/usePageSettingsStore'

export default function PageSettingsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const fetchSettings = usePageSettingsStore((state) => state.fetchSettings)

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  return <>{children}</>
}