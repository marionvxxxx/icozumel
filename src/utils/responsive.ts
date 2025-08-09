// Responsive utilities for native-like experience
export const breakpoints = {
  mobile: '(max-width: 768px)',
  tablet: '(min-width: 769px) and (max-width: 1024px)',
  desktop: '(min-width: 1025px)',
} as const

export const useMediaQuery = (query: string): boolean => {
  if (typeof window === 'undefined') return false
  
  const [matches, setMatches] = React.useState(() => {
    return window.matchMedia(query).matches
  })

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches)
    
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [query])

  return matches
}

export const isMobile = () => useMediaQuery(breakpoints.mobile)
export const isTablet = () => useMediaQuery(breakpoints.tablet)
export const isDesktop = () => useMediaQuery(breakpoints.desktop)

// Platform detection
export const getPlatform = () => {
  if (typeof window === 'undefined') return 'unknown'
  
  const userAgent = window.navigator.userAgent.toLowerCase()
  
  if (/android/.test(userAgent)) return 'android'
  if (/iphone|ipad|ipod/.test(userAgent)) return 'ios'
  if (/windows/.test(userAgent)) return 'windows'
  if (/mac/.test(userAgent)) return 'mac'
  
  return 'web'
}

// Native-like interactions
export const hapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'light') => {
  if ('vibrate' in navigator) {
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30]
    }
    navigator.vibrate(patterns[type])
  }
}

import React from 'react'