'use client'

import { useState, useEffect } from 'react'
import Sticker, { StickerName } from './Sticker'

interface Slide {
  sticker: StickerName
  title: string
  subtitle: string
  action?: () => void
}

interface BannerProps {
  slides: Slide[]
  autoPlay?: boolean
  interval?: number
}

export default function Banner({ slides, autoPlay = true, interval = 5000 }: BannerProps) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, interval)

    return () => clearInterval(timer)
  }, [autoPlay, interval, slides.length])

  const slide = slides[current]

  return (
    <div className="relative">
      <div
        className="banner-gradient flex items-center gap-4 cursor-pointer"
        onClick={slide.action}
      >
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center overflow-hidden">
          <Sticker name={slide.sticker} size={40} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-base">{slide.title}</h3>
          <p className="text-sm text-white/80">{slide.subtitle}</p>
        </div>
        <div className="text-white/60">→</div>
      </div>

      {slides.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-2 h-2 rounded-full transition-colors ${
                idx === current ? 'bg-[#2563eb]' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
