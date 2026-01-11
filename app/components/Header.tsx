'use client'

import Sticker from './Sticker'

interface HeaderProps {
  title?: string
  showLogo?: boolean
}

export default function Header({ title, showLogo = true }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-b from-[#e8f4fc] to-transparent dark:from-[#0f172a] py-3 safe-area-inset-top">
      <div className="w-full max-w-[480px] mx-auto px-4">
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
      </div>
    </header>
  )
}
