'use client'

import { Modal, Button } from '@telegram-apps/telegram-ui'
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
  const language = 'ru' // TODO: Implement language context
  const setLanguage = (_: string) => {} // TODO: Implement language context

  const getThemeLabel = (themeItem: typeof THEMES[number]) => {
    return themeItem.label
  }

  return (
    <Modal
      open={isOpen}
      onOpenChange={onClose}
      header={<Modal.Header>Настройки</Modal.Header>}
    >
      <div className="space-y-6">
        {/* Theme Selector */}
        <div>
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
                    ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white shadow-lg'
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
                    ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white shadow-lg'
                    : 'bg-[var(--bg-start)] text-[var(--text-primary)] hover:bg-[var(--bg-end)]'
                }`}
              >
                {lang.flag} {lang.label}
              </button>
            ))}
          </div>
        </div>

        <Button
          size="l"
          stretched
          mode="gray"
          onClick={onClose}
        >
          Закрыть
        </Button>
      </div>
    </Modal>
  )
}
