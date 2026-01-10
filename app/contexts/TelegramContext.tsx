'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { api, User } from '../lib/api'

interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
}

interface TelegramWebApp {
  initData: string
  initDataUnsafe: {
    user?: TelegramUser
    start_param?: string
  }
  version: string
  platform: string
  colorScheme: 'light' | 'dark'
  themeParams: Record<string, string>
  isExpanded: boolean
  viewportHeight: number
  viewportStableHeight: number
  ready: () => void
  expand: () => void
  close: () => void
  MainButton: {
    text: string
    color: string
    textColor: string
    isVisible: boolean
    isActive: boolean
    isProgressVisible: boolean
    setText: (text: string) => void
    onClick: (callback: () => void) => void
    offClick: (callback: () => void) => void
    show: () => void
    hide: () => void
    enable: () => void
    disable: () => void
    showProgress: (leaveActive?: boolean) => void
    hideProgress: () => void
  }
  BackButton: {
    isVisible: boolean
    onClick: (callback: () => void) => void
    offClick: (callback: () => void) => void
    show: () => void
    hide: () => void
  }
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void
    selectionChanged: () => void
  }
  openLink: (url: string) => void
  openTelegramLink: (url: string) => void
  showPopup: (params: { title?: string; message: string; buttons?: { type: string; text: string }[] }, callback?: (buttonId: string) => void) => void
  showAlert: (message: string, callback?: () => void) => void
  showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void
  openInvoice?: (url: string, callback?: (status: string) => void) => void
  onEvent: (eventType: string, callback: () => void) => void
  offEvent: (eventType: string, callback: () => void) => void
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp
    }
  }
}

interface TelegramContextType {
  webApp: TelegramWebApp | null
  user: TelegramUser | null
  dbUser: User | null
  isReady: boolean
  isLoading: boolean
}

const TelegramContext = createContext<TelegramContextType>({
  webApp: null,
  user: null,
  dbUser: null,
  isReady: false,
  isLoading: true,
})

export function TelegramProvider({ children }: { children: ReactNode }) {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null)
  const [user, setUser] = useState<TelegramUser | null>(null)
  const [dbUser, setDbUser] = useState<User | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      // Check if running in Telegram
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        const tgWebApp = window.Telegram.WebApp
        setWebApp(tgWebApp)

        // Get user from Telegram
        const tgUser = tgWebApp.initDataUnsafe.user

        // Debug logging
        console.log('[TelegramContext] WebApp detected:', {
          version: tgWebApp.version,
          platform: tgWebApp.platform,
          hasUser: !!tgUser,
          userId: tgUser?.id,
          initDataLength: tgWebApp.initData?.length || 0
        })

        if (tgUser) {
          setUser(tgUser)
          api.setTelegramId(tgUser.id)

          // Fetch/create user in database
          try {
            const { user: fetchedUser } = await api.getMe()
            setDbUser(fetchedUser)
          } catch (error) {
            console.error('Failed to fetch user:', error)
          }
        } else {
          console.warn('[TelegramContext] No user in initDataUnsafe, using dev fallback')
          // Fallback to dev user when Telegram doesn't provide user
          const devUser: TelegramUser = {
            id: 123456789,
            first_name: 'Dev',
            username: 'developer',
          }
          setUser(devUser)
          api.setTelegramId(devUser.id)

          try {
            const { user: fetchedUser } = await api.getMe()
            setDbUser(fetchedUser)
          } catch (error) {
            console.error('Failed to fetch user:', error)
          }
        }

        // Set initial viewport height
        const updateViewportHeight = () => {
          document.documentElement.style.setProperty(
            '--tg-viewport-height',
            `${tgWebApp.viewportHeight}px`
          )
        }

        updateViewportHeight()

        // Listen to viewport changes (keyboard, orientation)
        tgWebApp.onEvent('viewportChanged', updateViewportHeight)

        // Tell Telegram we're ready
        tgWebApp.ready()
        tgWebApp.expand()

        setIsReady(true)

        // Cleanup viewport listener
        return () => {
          tgWebApp.offEvent('viewportChanged', updateViewportHeight)
        }
      } else {
        // Development mode - mock user
        const mockUser: TelegramUser = {
          id: 123456789,
          first_name: 'Dev',
          username: 'developer',
        }
        setUser(mockUser)
        api.setTelegramId(mockUser.id)

        try {
          const { user: fetchedUser } = await api.getMe()
          setDbUser(fetchedUser)
        } catch (error) {
          console.error('Failed to fetch user:', error)
        }

        setIsReady(true)
      }

      setIsLoading(false)
    }

    init()
  }, [])

  return (
    <TelegramContext.Provider value={{ webApp, user, dbUser, isReady, isLoading }}>
      {children}
    </TelegramContext.Provider>
  )
}

export function useTelegram() {
  return useContext(TelegramContext)
}

// Haptic feedback helpers
export function useHaptic() {
  const { webApp } = useTelegram()

  return {
    impact: (style: 'light' | 'medium' | 'heavy' = 'light') => {
      webApp?.HapticFeedback?.impactOccurred(style)
    },
    notification: (type: 'error' | 'success' | 'warning') => {
      webApp?.HapticFeedback?.notificationOccurred(type)
    },
    selection: () => {
      webApp?.HapticFeedback?.selectionChanged()
    },
  }
}
