'use client'

import { useState, useEffect } from 'react'
import Sticker, { StickerName } from './Sticker'

interface OnboardingStep {
  title: string
  description: string
  sticker: StickerName
  highlight?: string
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    title: 'Welcome to UNIC!',
    description: "Hey! I'm your guide. Let's take a quick tour so you know where everything is. Tap anywhere to continue!",
    sticker: 'onboard1',
  },
  {
    title: 'How it works',
    description: 'Create engagement events for your channel. Subscribers earn points by reacting and commenting. Top users win Telegram Gifts!',
    sticker: 'onboard2',
  },
  {
    title: 'Home',
    description: 'Your dashboard with quick access to all features. See active events status and create new ones.',
    sticker: 'onboard3',
    highlight: 'tab-home',
  },
  {
    title: 'Events',
    description: 'Manage all your events here. Create, edit, track participants and see real-time leaderboards.',
    sticker: 'onboard2',
    highlight: 'tab-events',
  },
  {
    title: 'Channels',
    description: 'Connect your Telegram channels. Add @rtyrtrebot as admin and link with one click.',
    sticker: 'onboard3',
    highlight: 'tab-channels',
  },
  {
    title: 'Plans & Gifts',
    description: 'Choose a plan that fits your needs. More events, more channels, premium gifts for winners!',
    sticker: 'onboard2',
    highlight: 'tab-plans',
  },
  {
    title: 'Profile',
    description: 'View your stats, manage subscription, and invite friends with your referral link.',
    sticker: 'onboard3',
    highlight: 'tab-profile',
  },
  {
    title: "Let's go!",
    description: 'You are all set! Start by connecting your first channel, then create an event. Your subscribers will love it!',
    sticker: 'onboard4',
  },
]

interface OnboardingProps {
  onComplete: () => void
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [visible, setVisible] = useState(true)

  const step = ONBOARDING_STEPS[currentStep]
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1

  useEffect(() => {
    if (step.highlight) {
      const el = document.getElementById(step.highlight)
      if (el) {
        el.classList.add('onboarding-highlight')
      }
    }

    return () => {
      if (step.highlight) {
        const el = document.getElementById(step.highlight)
        if (el) {
          el.classList.remove('onboarding-highlight')
        }
      }
    }
  }, [step.highlight])

  const handleNext = () => {
    if (isLastStep) {
      setVisible(false)
      setTimeout(onComplete, 300)
    } else {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleSkip = () => {
    setVisible(false)
    setTimeout(onComplete, 300)
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 transition-opacity duration-300"
        onClick={handleNext}
      />

      {/* Tooltip Card */}
      <div className="absolute left-4 right-4 top-1/3 transform -translate-y-1/2 z-10">
        <div className="bg-white rounded-2xl p-5 shadow-xl animate-fadeIn">
          <h2 className="text-lg font-bold text-gray-800 mb-2">{step.title}</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>

          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-gray-400">
              {currentStep + 1}/{ONBOARDING_STEPS.length}
            </span>
            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <button
                  onClick={handleBack}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50"
                >
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                className="px-4 py-2 text-sm text-white bg-[#2563eb] rounded-xl hover:bg-[#1d4ed8]"
              >
                {isLastStep ? 'Get Started' : 'Next'}
              </button>
              {!isLastStep && (
                <button
                  onClick={handleSkip}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-gray-600"
                >
                  Skip
                </button>
              )}
            </div>
          </div>

          {/* Arrow pointing down */}
          <div className="absolute left-1/2 -bottom-3 transform -translate-x-1/2">
            <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[12px] border-l-transparent border-r-transparent border-t-white" />
          </div>
        </div>
      </div>

      {/* Sticker at bottom */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10">
        <Sticker name={step.sticker} size={180} />
      </div>
    </div>
  )
}
