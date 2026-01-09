// Определение устройства пользователя для оптимизации layout
export interface DeviceInfo {
  isIOS: boolean
  isAndroid: boolean
  isMobile: boolean
  isTablet: boolean
  hasNotch: boolean
  platform: string
}

export function getDeviceInfo(): DeviceInfo {
  if (typeof window === 'undefined') {
    return {
      isIOS: false,
      isAndroid: false,
      isMobile: false,
      isTablet: false,
      hasNotch: false,
      platform: 'unknown',
    }
  }

  const ua = navigator.userAgent.toLowerCase()
  const platform = navigator.platform?.toLowerCase() || ''

  const isIOS = /iphone|ipad|ipod/.test(ua) || (platform.includes('mac') && 'ontouchend' in document)
  const isAndroid = /android/.test(ua)
  const isMobile = /mobile/.test(ua) || isIOS || isAndroid
  const isTablet = /tablet|ipad/.test(ua) || (isAndroid && !/mobile/.test(ua))

  // Определение notch/dynamic island (iPhone X и новее)
  const hasNotch =
    isIOS &&
    window.screen.height >= 812 && // iPhone X height
    (window.devicePixelRatio >= 2 || window.innerHeight > 700)

  return {
    isIOS,
    isAndroid,
    isMobile,
    isTablet,
    hasNotch,
    platform: isIOS ? 'ios' : isAndroid ? 'android' : 'web',
  }
}

// Получить оптимальный top padding в зависимости от устройства
export function getHeaderSpacing(deviceInfo: DeviceInfo): string {
  if (deviceInfo.hasNotch) {
    return 'pt-24' // 96px для устройств с notch/dynamic island
  } else if (deviceInfo.isMobile) {
    return 'pt-20' // 80px для обычных мобильных
  } else {
    return 'pt-16' // 64px для планшетов/веба
  }
}
