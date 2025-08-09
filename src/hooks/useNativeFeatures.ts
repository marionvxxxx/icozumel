import { useState, useEffect } from 'react'
import { getPlatform, hapticFeedback } from '../utils/responsive'

// Hook for native-like features
export const useNativeFeatures = () => {
  const [platform, setPlatform] = useState(getPlatform())
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [installPrompt, setInstallPrompt] = useState<any>(null)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    // PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e)
    }
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const installApp = async () => {
    if (!installPrompt) return false
    
    const result = await installPrompt.prompt()
    setInstallPrompt(null)
    return result.outcome === 'accepted'
  }

  const shareContent = async (data: { title: string; text: string; url?: string }) => {
    if (navigator.share) {
      try {
        await navigator.share(data)
        return true
      } catch (error) {
        console.error('Error sharing:', error)
      }
    }
    
    // Fallback to clipboard
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(data.url || data.text)
      return true
    }
    
    return false
  }

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) return false
    
    if (Notification.permission === 'granted') return true
    
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  const getCurrentLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'))
        return
      }
      
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      })
    })
  }

  return {
    platform,
    isOnline,
    installPrompt: !!installPrompt,
    installApp,
    shareContent,
    requestNotificationPermission,
    getCurrentLocation,
    hapticFeedback
  }
}

// Hook for persistent storage
export const useStorage = (key: string, defaultValue: any) => {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  })

  const setStoredValue = (newValue: any) => {
    try {
      setValue(newValue)
      localStorage.setItem(key, JSON.stringify(newValue))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }

  return [value, setStoredValue]
}