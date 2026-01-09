'use client'

import { ReactNode, useState, useEffect } from 'react'
import { AppRoot } from '@telegram-apps/telegram-ui'
import { TelegramProvider } from './contexts/TelegramContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { TonConnectProvider } from './contexts/TonConnectContext'
import Header from './components/Header'
import TabBar from './components/TabBar'
import Onboarding from './components/Onboarding'
import { getDeviceInfo, getHeaderSpacing } from './lib/deviceDetection'

const ONBOARDING_KEY = 'unic_onboarding_complete'

export function Providers({ children }: { children: ReactNode }) {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [headerSpacing, setHeaderSpacing] = useState('pt-20')

  useEffect(() => {
    setMounted(true)
    // Определить устройство и установить правильный spacing
    const deviceInfo = getDeviceInfo()
    const spacing = getHeaderSpacing(deviceInfo)
    setHeaderSpacing(spacing)

    // Check if onboarding was completed
    const completed = localStorage.getItem(ONBOARDING_KEY)
    if (!completed) {
      // Small delay to let the app render first
      setTimeout(() => setShowOnboarding(true), 500)
    }
  }, [])

  const handleOnboardingComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true')
    setShowOnboarding(false)
  }

  return (
    <ThemeProvider>
      <TelegramProvider>
        <TonConnectProvider>
          <AppRoot>
            <div className="min-h-screen flex flex-col bg-[var(--tg-theme-bg-color)] text-[var(--tg-theme-text-color)]">
              {/* Container wrapper for large screens */}
              <div className="w-full max-w-[480px] mx-auto flex flex-col min-h-screen">
                <Header />
                <main className={`flex-1 px-4 ${headerSpacing} pb-24`}>
                  {children}
                </main>
                <TabBar />
              </div>

              {/* Onboarding overlay */}
              {mounted && showOnboarding && (
                <Onboarding onComplete={handleOnboardingComplete} />
              )}
            </div>
          </AppRoot>
        </TonConnectProvider>
      </TelegramProvider>
    </ThemeProvider>
  )
}
