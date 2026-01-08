'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    // Load saved theme
    const saved = localStorage.getItem('unic-theme') as Theme
    if (saved) {
      setThemeState(saved)
    }
  }, [])

  useEffect(() => {
    // Resolve system theme
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const updateResolvedTheme = () => {
      if (theme === 'system') {
        setResolvedTheme(mediaQuery.matches ? 'dark' : 'light')
      } else {
        setResolvedTheme(theme)
      }
    }

    updateResolvedTheme()
    mediaQuery.addEventListener('change', updateResolvedTheme)

    return () => mediaQuery.removeEventListener('change', updateResolvedTheme)
  }, [theme])

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(resolvedTheme)

    // Update Telegram WebApp theme
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      try {
        // @ts-expect-error - Telegram WebApp types may not include all methods
        window.Telegram.WebApp.setHeaderColor?.(resolvedTheme === 'dark' ? '#1a1a2e' : '#ffffff')
        // @ts-expect-error - Telegram WebApp types may not include all methods
        window.Telegram.WebApp.setBackgroundColor?.(resolvedTheme === 'dark' ? '#0f0f1a' : '#f0f4ff')
      } catch {
        // Ignore if methods not available
      }
    }
  }, [resolvedTheme])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('unic-theme', newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
