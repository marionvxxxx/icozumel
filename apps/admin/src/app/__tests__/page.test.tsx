import { render, screen } from '@testing-library/react'
import { Suspense } from 'react'
import AdminDashboard from '../page'

// Mock the lazy-loaded components
jest.mock('../../components/dashboard/LazyAnalyticsChart', () => ({
  LazyAnalyticsChart: () => <div data-testid="analytics-chart">Analytics Chart</div>
}))

describe('AdminDashboard', () => {
  it('renders the dashboard title', () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <AdminDashboard />
      </Suspense>
    )
    
    expect(screen.getByText('Mobile App Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Manage iOS and Android apps for Cozumel marketplace')).toBeInTheDocument()
  })

  it('displays mobile app stats cards', () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <AdminDashboard />
      </Suspense>
    )
    
    // Check for stats cards
    expect(screen.getByText('iOS Downloads')).toBeInTheDocument()
    expect(screen.getByText('Android Downloads')).toBeInTheDocument()
    expect(screen.getByText('Active Users')).toBeInTheDocument()
    expect(screen.getByText('Pending Verifications')).toBeInTheDocument()
  })

  it('shows business verification queue', () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <AdminDashboard />
      </Suspense>
    )
    
    expect(screen.getByText('Business Verification Queue')).toBeInTheDocument()
    expect(screen.getByText('Restaurant El Moro')).toBeInTheDocument()
    expect(screen.getByText('Dive Shop Paradise')).toBeInTheDocument()
    expect(screen.getByText('Beach Club Sunset')).toBeInTheDocument()
  })

  it('displays app statistics section', () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <AdminDashboard />
      </Suspense>
    )
    
    expect(screen.getByText('Analytics Overview')).toBeInTheDocument()
    expect(screen.getByText('iOS App')).toBeInTheDocument()
    expect(screen.getByText('Android App')).toBeInTheDocument()
  })

  it('renders analytics chart component', () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <AdminDashboard />
      </Suspense>
    )
    
    expect(screen.getByTestId('analytics-chart')).toBeInTheDocument()
  })
})