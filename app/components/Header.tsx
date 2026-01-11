'use client'

import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import Sticker from './Sticker'
import SettingsModal from './SettingsModal'

interface HeaderProps {
  title?: string
  showLogo?: boolean
}

const LANGUAGE_FLAGS: Record<string, string> = {
  en: '🇬🇧',
  ru: '🇷🇺',
  zh: '🇨🇳',
}

const THEME_ICONS: Record<string, string> = {
  light: '☀️',
  dark: '🌙',
  system: '⚙️',
}

export default function Header({ title, showLogo = true }: HeaderProps) {
  const { theme } = useTheme()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const language = 'ru' // TODO: Get from language context

  return (
    <>
      <header className="sticky top-0 z-50 bg-gradient-to-b from-[#e8f4fc] to-transparent dark:from-[#0f172a] py-3 safe-area-inset-top">
        <div className="w-full max-w-[480px] mx-auto px-4">
          <div className="flex items-center justify-between gap-2">
            {/* Logo/Title */}
            <div className="flex items-center gap-2">
              {showLogo ? (
                <>
                  <Sticker name="giftFree" size={28} />
                  <span className="font-bold text-lg text-gray-800 dark:text-white">UNIC</span>
                </>
              ) : (
                <h1 className="font-semibold text-lg text-gray-800 dark:text-white truncate">{title}</h1>
              )}
            </div>

            {/* Settings Icons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-white/20 dark:hover:bg-gray-800/70 transition-all"
              >
                <span className="text-lg">{LANGUAGE_FLAGS[language]}</span>
                <span className="text-lg">{THEME_ICONS[theme]}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  )
}
