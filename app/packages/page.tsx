'use client'

import { useState } from 'react'
import Sticker, { StickerName } from '../components/Sticker'
import { useHaptic, useTelegram } from '../contexts/TelegramContext'
import { t } from '../lib/translations'
import { api } from '../lib/api'

interface Package {
  nameKey: string
  price: number
  periodKey: string | ''
  sticker: StickerName
  featureKeys: string[]
  ctaKey: string
  disabled: boolean
  popular: boolean
  gradient: string
}

interface PackageData extends Package {
  planId: string
}

const packages: PackageData[] = [
  {
    planId: 'free',
    nameKey: 'packages.free',
    price: 0,
    periodKey: '',
    sticker: 'giftFree',
    featureKeys: ['feature.demoEvent', 'feature.upTo100', 'feature.basicAnalytics'],
    ctaKey: 'packages.currentPlan',
    disabled: true,
    popular: false,
    gradient: 'from-gray-400 to-gray-500',
  },
  {
    planId: 'trial',
    nameKey: 'packages.trial',
    price: 100,
    periodKey: 'packages.perMonth',
    sticker: 'giftTrial',
    featureKeys: ['feature.eventsPerWeek', 'feature.upTo1000', 'feature.allActivityTypes', 'feature.prioritySupport'],
    ctaKey: 'packages.startTrial',
    disabled: false,
    popular: false,
    gradient: 'from-blue-400 to-blue-600',
  },
  {
    planId: 'basic',
    nameKey: 'packages.basic',
    price: 500,
    periodKey: 'packages.perMonth',
    sticker: 'giftBasic',
    featureKeys: ['feature.eventsPerMonth', 'feature.upTo5000', 'feature.extendedAnalytics', 'feature.removeBadge'],
    ctaKey: 'packages.subscribe',
    disabled: false,
    popular: true,
    gradient: 'from-emerald-400 to-emerald-600',
  },
  {
    planId: 'advanced',
    nameKey: 'packages.advanced',
    price: 2000,
    periodKey: 'packages.perMonth',
    sticker: 'giftAdvanced',
    featureKeys: ['feature.unlimitedEvents', 'feature.upTo50000', 'feature.3channels', 'feature.customBranding', 'feature.apiAccess'],
    ctaKey: 'packages.subscribe',
    disabled: false,
    popular: false,
    gradient: 'from-purple-400 to-purple-600',
  },
  {
    planId: 'premium',
    nameKey: 'packages.premium',
    price: 5000,
    periodKey: 'packages.perMonth',
    sticker: 'giftPremium',
    featureKeys: ['feature.everythingAdvanced', 'feature.unlimitedParticipants', 'feature.10channels', 'feature.whiteLabel', 'feature.dedicatedManager'],
    ctaKey: 'packages.contactSales',
    disabled: false,
    popular: false,
    gradient: 'from-amber-400 to-orange-500',
  },
]

export default function Packages() {
  const haptic = useHaptic()
  const { webApp } = useTelegram()
  const [processing, setProcessing] = useState(false)

  const handleSubscribe = async (pkg: PackageData) => {
    haptic.impact('medium')

    if (pkg.disabled) return

    // Free plan - no payment needed
    if (pkg.price === 0) {
      webApp?.showAlert('You are already on the free plan')
      return
    }

    setProcessing(true)

    try {
      // Create Telegram Stars invoice
      const { invoiceLink, paymentId } = await api.createPlanInvoice(pkg.planId)

      // Open Telegram Stars payment
      webApp?.openInvoice?.(invoiceLink, async (status: string) => {
        if (status === 'paid') {
          try {
            // Apply plan upgrade after payment
            const result = await api.upgradePlan(pkg.planId, paymentId)
            webApp?.showAlert(result.message)
            haptic.notification('success')

            // Redirect to profile or home
            setTimeout(() => {
              window.location.href = '/profile'
            }, 1500)
          } catch (error: any) {
            webApp?.showAlert(error.message || 'Failed to activate plan')
            haptic.notification('error')
          }
        } else if (status === 'cancelled') {
          webApp?.showAlert('Payment cancelled')
          haptic.notification('warning')
        } else if (status === 'failed') {
          webApp?.showAlert('Payment failed. Please try again.')
          haptic.notification('error')
        }
        setProcessing(false)
      })
    } catch (error: any) {
      console.error('Payment error:', error)
      webApp?.showAlert('Failed to create invoice. Please try again.')
      haptic.notification('error')
      setProcessing(false)
    }
  }

  return (
    <div className="fade-in px-3 pb-40">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">{t('packages.title')}</h1>
        <p className="text-sm text-[var(--text-secondary)]">{t('packages.subtitle')}</p>
      </div>

      {/* Packages List */}
      <div className="space-y-6">
        {packages.map((pkg) => (
          <div
            key={pkg.nameKey}
            className={`card overflow-hidden relative ${
              pkg.popular ? 'ring-2 ring-[var(--primary)] shadow-lg' : ''
            }`}
          >
            {/* Popular Badge */}
            {pkg.popular && (
              <div className="absolute top-0 right-0 bg-[var(--primary)] text-white text-[10px] font-bold px-2.5 py-1 rounded-bl-xl">
                {t('packages.popular')}
              </div>
            )}

            {/* Card Content */}
            <div className="p-6">
              {/* Header with Sticker */}
              <div className="flex items-center gap-4 mb-6">
                {/* Plan Name & Price */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-1">{t(pkg.nameKey)}</h3>
                  <div className="flex items-baseline gap-1">
                    {pkg.price === 0 ? (
                      <span className="text-2xl font-bold text-[var(--text-primary)]">{t('packages.free')}</span>
                    ) : (
                      <>
                        <span className="text-2xl font-bold text-[var(--text-primary)]">
                          {pkg.price} ⭐
                        </span>
                        <span className="text-sm text-[var(--text-secondary)]">
                          {pkg.periodKey ? t(pkg.periodKey) : ''}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Sticker */}
                <div className="flex-shrink-0">
                  <Sticker name={pkg.sticker} size={100} />
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-6">
                {pkg.featureKeys.map((featureKey, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm">
                    <svg className="w-5 h-5 text-[var(--success)] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[var(--text-secondary)] leading-relaxed">{t(featureKey)}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button - Mobile Optimized */}
              <button
                onClick={() => handleSubscribe(pkg)}
                disabled={pkg.disabled || processing}
                className={`w-full py-4 rounded-2xl font-bold text-base tracking-wide transition-all active:scale-[0.97] flex items-center justify-center gap-2 ${
                  pkg.disabled || processing
                    ? 'bg-[var(--bg-start)] text-[var(--text-muted)] cursor-not-allowed'
                    : pkg.popular
                      ? `bg-gradient-to-r ${pkg.gradient} text-white shadow-xl hover:shadow-2xl`
                      : `bg-gradient-to-r ${pkg.gradient} text-white shadow-lg hover:shadow-xl`
                }`}
              >
                {processing ? 'Processing...' : t(pkg.ctaKey)}
                {!pkg.disabled && !processing && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <p className="text-center text-xs text-[var(--text-muted)] mt-8 px-4 leading-relaxed">
        {t('packages.yearly')} = 10x {t('packages.monthly')} • 2 {t('packages.perMonth')} free
      </p>
    </div>
  )
}
