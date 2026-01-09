'use client'

import { useState } from 'react'
import Sticker, { StickerName } from '../components/Sticker'
import { useTranslation, TranslationKey } from '../contexts/LanguageContext'
import { useHaptic } from '../contexts/TelegramContext'

interface Package {
  nameKey: TranslationKey
  price: number
  periodKey: TranslationKey | ''
  sticker: StickerName
  featureKeys: TranslationKey[]
  ctaKey: TranslationKey
  disabled: boolean
  popular: boolean
  gradient: string
}

const packages: Package[] = [
  {
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
    nameKey: 'packages.trial',
    price: 199,
    periodKey: 'packages.perWeek',
    sticker: 'giftTrial',
    featureKeys: ['feature.eventsPerWeek', 'feature.upTo1000', 'feature.allActivityTypes', 'feature.prioritySupport'],
    ctaKey: 'packages.startTrial',
    disabled: false,
    popular: false,
    gradient: 'from-blue-400 to-blue-600',
  },
  {
    nameKey: 'packages.basic',
    price: 490,
    periodKey: 'packages.perMonth',
    sticker: 'giftBasic',
    featureKeys: ['feature.eventsPerMonth', 'feature.upTo5000', 'feature.extendedAnalytics', 'feature.removeBadge'],
    ctaKey: 'packages.subscribe',
    disabled: false,
    popular: true,
    gradient: 'from-emerald-400 to-emerald-600',
  },
  {
    nameKey: 'packages.advanced',
    price: 1490,
    periodKey: 'packages.perMonth',
    sticker: 'giftAdvanced',
    featureKeys: ['feature.unlimitedEvents', 'feature.upTo50000', 'feature.3channels', 'feature.customBranding', 'feature.apiAccess'],
    ctaKey: 'packages.subscribe',
    disabled: false,
    popular: false,
    gradient: 'from-purple-400 to-purple-600',
  },
  {
    nameKey: 'packages.premium',
    price: 3990,
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
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')
  const { t } = useTranslation()
  const haptic = useHaptic()

  const handleSubscribe = (pkg: Package) => {
    haptic.impact('medium')
    // Handle subscription
  }

  return (
    <div className="fade-in pb-10">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">{t('packages.title')}</h1>
        <p className="text-sm text-[var(--text-secondary)]">{t('packages.subtitle')}</p>
      </div>

      {/* Billing Toggle - Mobile Optimized */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-[var(--bg-start)] p-1.5 rounded-2xl border border-[var(--card-border)]">
          <button
            className={`px-8 py-3 rounded-xl text-sm font-semibold transition-all ${
              billing === 'monthly'
                ? 'bg-[var(--primary)] text-white shadow-md'
                : 'text-[var(--text-secondary)]'
            }`}
            onClick={() => {
              setBilling('monthly')
              haptic.selection()
            }}
          >
            {t('packages.monthly')}
          </button>
          <button
            className={`px-8 py-3 rounded-xl text-sm font-semibold transition-all ${
              billing === 'yearly'
                ? 'bg-[var(--primary)] text-white shadow-md'
                : 'text-[var(--text-secondary)]'
            }`}
            onClick={() => {
              setBilling('yearly')
              haptic.selection()
            }}
          >
            {t('packages.yearly')}
            <span className="ml-2 text-xs opacity-80">-17%</span>
          </button>
        </div>
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
                          {billing === 'yearly'
                            ? Math.round(pkg.price * 10)
                            : pkg.price}₽
                        </span>
                        <span className="text-sm text-[var(--text-secondary)]">
                          {billing === 'yearly' ? t('packages.perYear') : pkg.periodKey ? t(pkg.periodKey) : ''}
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
                disabled={pkg.disabled}
                className={`w-full py-4 rounded-2xl font-bold text-base tracking-wide transition-all active:scale-[0.97] flex items-center justify-center gap-2 ${
                  pkg.disabled
                    ? 'bg-[var(--bg-start)] text-[var(--text-muted)] cursor-not-allowed'
                    : pkg.popular
                      ? `bg-gradient-to-r ${pkg.gradient} text-white shadow-xl hover:shadow-2xl`
                      : `bg-gradient-to-r ${pkg.gradient} text-white shadow-lg hover:shadow-xl`
                }`}
              >
                {t(pkg.ctaKey)}
                {!pkg.disabled && (
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
