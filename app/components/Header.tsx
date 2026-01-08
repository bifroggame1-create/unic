'use client'

import Sticker from './Sticker'

interface HeaderProps {
  title?: string
  showLogo?: boolean
}

export default function Header({ title, showLogo = true }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-b from-[#e8f4fc] to-transparent px-4 py-3">
      <div className="flex items-center justify-between">
        {showLogo ? (
          <div className="flex items-center gap-2">
            <Sticker name="giftFree" size={28} />
            <span className="font-bold text-lg text-gray-800">UNIC</span>
          </div>
        ) : (
          <h1 className="font-semibold text-lg text-gray-800">{title}</h1>
        )}

        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-sm font-medium text-[#2563eb] bg-white rounded-full border border-gray-200 hover:bg-gray-50 transition-colors">
            How to Use
          </button>
          <button className="px-3 py-1.5 text-sm font-medium text-white bg-[#2563eb] rounded-full flex items-center gap-1.5 hover:bg-[#1d4ed8] transition-colors">
            Connect
          </button>
        </div>
      </div>
    </header>
  )
}
