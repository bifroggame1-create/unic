'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'
import { useHaptic } from '../contexts/TelegramContext'

const LANGUAGES: { code: string; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
]

const THEMES = [
  { value: 'light', label: '☀️ Light', labelRu: '☀️ Светлая', labelZh: '☀️ 浅色' },
  { value: 'dark', label: '🌙 Dark', labelRu: '🌙 Тёмная', labelZh: '🌙 深色' },
  { value: 'system', label: '⚙️ System', labelRu: '⚙️ Система', labelZh: '⚙️ 系统' },
] as const

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { theme, setTheme } = useTheme()
  const haptic = useHaptic()
  const language = 'en' // TODO: Implement language context
  const setLanguage = (_: string) => {} // TODO: Implement language context

  const getThemeLabel = (themeItem: typeof THEMES[number]) => {
    return themeItem.label
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[90%] max-w-md"
          >
            <div className="card p-6 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[var(--text-primary)]">Настройки</h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--bg-start)] transition-colors"
                >
                  <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Theme Selector */}
              <div className="mb-6">
                <p className="text-sm font-semibold text-[var(--text-primary)] mb-3">Тема</p>
                <div className="flex gap-2">
                  {THEMES.map((themeItem) => (
                    <button
                      key={themeItem.value}
                      onClick={() => {
                        haptic.impact('light')
                        setTheme(themeItem.value)
                      }}
                      className={`flex-1 py-3 px-3 rounded-xl text-sm font-semibold transition-all ${
                        theme === themeItem.value
                          ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white shadow-lg scale-105'
                          : 'bg-[var(--bg-start)] text-[var(--text-primary)] hover:bg-[var(--bg-end)]'
                      }`}
                    >
                      {getThemeLabel(themeItem)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Selector */}
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)] mb-3">Язык</p>
                <div className="flex gap-2">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        haptic.impact('light')
                        setLanguage(lang.code)
                      }}
                      className={`flex-1 py-3 px-3 rounded-xl text-sm font-semibold transition-all ${
                        language === lang.code
                          ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white shadow-lg scale-105'
                          : 'bg-[var(--bg-start)] text-[var(--text-primary)] hover:bg-[var(--bg-end)]'
                      }`}
                    >
                      {lang.flag} {lang.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
