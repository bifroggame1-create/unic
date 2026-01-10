'use client'

import { useEffect } from 'react'
import { useTelegram } from '../contexts/TelegramContext'

/**
 * Hook to manage Telegram WebApp BackButton with proper cleanup
 *
 * @param onBack - Callback when back button is clicked
 * @param enabled - Whether to show the back button (default: true)
 *
 * @example
 * useTelegramBackButton(() => router.back())
 */
export function useTelegramBackButton(onBack: () => void, enabled = true) {
  const { webApp } = useTelegram()

  useEffect(() => {
    if (!webApp || !enabled) return

    // Show back button
    webApp.BackButton.show()

    // Register click handler
    webApp.BackButton.onClick(onBack)

    // Cleanup: remove handler and hide button
    return () => {
      webApp.BackButton.offClick(onBack)
      webApp.BackButton.hide()
    }
  }, [webApp, onBack, enabled])
}

/**
 * Hook to manage Telegram WebApp MainButton with proper cleanup
 *
 * @param text - Button text
 * @param onClick - Callback when button is clicked
 * @param options - Button options (color, isActive, isVisible, showProgress)
 *
 * @example
 * useTelegramMainButton('Submit', handleSubmit, { isActive: isValid })
 */
export function useTelegramMainButton(
  text: string,
  onClick: () => void,
  options: {
    color?: string
    textColor?: string
    isActive?: boolean
    isVisible?: boolean
    showProgress?: boolean
  } = {}
) {
  const { webApp } = useTelegram()

  const {
    color,
    textColor,
    isActive = true,
    isVisible = true,
    showProgress = false
  } = options

  useEffect(() => {
    if (!webApp) return

    // Configure button
    webApp.MainButton.setText(text)

    if (color) webApp.MainButton.color = color
    if (textColor) webApp.MainButton.textColor = textColor

    if (isActive) {
      webApp.MainButton.enable()
    } else {
      webApp.MainButton.disable()
    }

    if (isVisible) {
      webApp.MainButton.show()
    } else {
      webApp.MainButton.hide()
    }

    if (showProgress) {
      webApp.MainButton.showProgress()
    } else {
      webApp.MainButton.hideProgress()
    }

    // Register click handler
    webApp.MainButton.onClick(onClick)

    // Cleanup: remove handler and hide button
    return () => {
      webApp.MainButton.offClick(onClick)
      webApp.MainButton.hide()
      webApp.MainButton.hideProgress()
    }
  }, [webApp, text, onClick, color, textColor, isActive, isVisible, showProgress])
}
