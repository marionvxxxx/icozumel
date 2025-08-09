import React from 'react'
import { isMobile, isTablet, isDesktop } from '../../utils/responsive'

interface ResponsiveLayoutProps {
  children: React.ReactNode
  className?: string
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ children, className = '' }) => {
  const mobile = isMobile()
  const tablet = isTablet()
  const desktop = isDesktop()

  return (
    <div className={`
      ${mobile ? 'max-w-md mx-auto' : ''}
      ${tablet ? 'max-w-4xl mx-auto px-6' : ''}
      ${desktop ? 'max-w-6xl mx-auto px-8' : ''}
      ${className}
    `}>
      {children}
    </div>
  )
}

export default ResponsiveLayout