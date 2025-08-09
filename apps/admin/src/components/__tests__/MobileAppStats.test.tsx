import { render, screen } from '@testing-library/react'
import { MobileAppStats } from '../dashboard/mobile-app-stats'

// Mock the UI components
jest.mock('@cozumel/ui', () => ({
  Card: ({ children }: any) => <div data-testid="card">{children}</div>,
  CardContent: ({ children }: any) => <div data-testid="card-content">{children}</div>,
  CardHeader: ({ children }: any) => <div data-testid="card-header">{children}</div>,
  CardTitle: ({ children }: any) => <h3 data-testid="card-title">{children}</h3>,
}))

describe('MobileAppStats', () => {
  it('renders mobile app statistics title', () => {
    render(<MobileAppStats />)
    
    expect(screen.getByText('Mobile App Statistics')).toBeInTheDocument()
  })

  it('displays iOS app statistics', () => {
    render(<MobileAppStats />)
    
    expect(screen.getByText('iOS App')).toBeInTheDocument()
    expect(screen.getByText('12,543')).toBeInTheDocument() // Total Downloads
    expect(screen.getByText('4,231')).toBeInTheDocument() // Active Users
    expect(screen.getByText('4.8 ⭐')).toBeInTheDocument() // Rating
  })

  it('displays Android app statistics', () => {
    render(<MobileAppStats />)
    
    expect(screen.getByText('Android App')).toBeInTheDocument()
    expect(screen.getByText('18,721')).toBeInTheDocument() // Total Downloads
    expect(screen.getByText('6,892')).toBeInTheDocument() // Active Users
    expect(screen.getByText('4.7 ⭐')).toBeInTheDocument() // Rating
  })

  it('displays combined statistics', () => {
    render(<MobileAppStats />)
    
    expect(screen.getByText('31,264')).toBeInTheDocument() // Total Downloads
    expect(screen.getByText('11,123')).toBeInTheDocument() // Active Users
    expect(screen.getByText('+18%')).toBeInTheDocument() // Growth Rate
  })
})