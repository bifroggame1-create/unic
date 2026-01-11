// UI иконки для Header и Settings (замена эмодзи)

export interface IconProps {
  size?: number
  className?: string
}

// Иконки тем
export const SunIcon = ({ size = 20, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
    <circle cx="12" cy="12" r="5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="1" x2="12" y2="3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="21" x2="12" y2="23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="1" y1="12" x2="3" y2="12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="21" y1="12" x2="23" y2="12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const MoonIcon = ({ size = 20, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const SystemIcon = ({ size = 20, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="8" y1="21" x2="16" y2="21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="17" x2="12" y2="21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// Иконки языков
export const LanguageIcon = ({ size = 20, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
    <circle cx="12" cy="12" r="10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="2" y1="12" x2="22" y2="12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// Иконка настроек
export const SettingsIcon = ({ size = 20, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
    <circle cx="12" cy="12" r="3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 1v6m0 6v10M5.64 5.64l4.24 4.25m4.24 4.24l4.24 4.25M1 12h6m6 0h10m-17.36.36l4.24-4.25m4.24-4.24l4.24-4.25" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
