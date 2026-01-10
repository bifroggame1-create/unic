'use client'

import { ReactNode } from 'react'

interface ContainerProps {
  children: ReactNode
  className?: string
}

export default function Container({ children, className = '' }: ContainerProps) {
  return (
    <div className={`px-4 pt-4 pb-20 max-w-2xl mx-auto ${className}`}>
      {children}
    </div>
  )
}
