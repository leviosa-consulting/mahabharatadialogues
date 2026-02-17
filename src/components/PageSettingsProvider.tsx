'use client'

import { useEffect } from 'react'
import { usePageSettingsStore } from '@/store/usePageSettingsStore'

export default function PageSettingsProvider({
  children,
  initialSettings,
}: {
  children: React.ReactNode
  initialSettings: any
}) {
  const setSettings = usePageSettingsStore((s) => s.setSettings)

  useEffect(() => {
    setSettings(initialSettings)
  }, [initialSettings, setSettings])

  return <>{children}</>
}