import { render, screen } from '@testing-library/react'
import AdminDashboard from '../page'

describe('AdminDashboard', () => {
  it('renders the dashboard title', () => {
    render(<AdminDashboard />)
    
    expect(screen.getByText('Mobile App Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Manage iOS and Android apps for Cozumel marketplace')).toBeInTheDocument()
  })

  it('displays mobile app stats cards', () => {
    render(<AdminDashboard />)
    
    // Check for stats cards
    expect(screen.getByText('iOS Downloads')).toBeInTheDocument()
    expect(screen.getByText('Android Downloads')).toBeInTheDocument()
    expect(screen.getByText('Active Users')).toBeInTheDocument()
    expect(screen.getByText('Pending Verifications')).toBeInTheDocument()
  })

  it('shows business verification queue', () => {
    render(<AdminDashboard />)
    
    expect(screen.getByText('Business Verification Queue')).toBeInTheDocument()
    expect(screen.getByText('Restaurant El Moro')).toBeInTheDocument()
    expect(screen.getByText('Dive Shop Paradise')).toBeInTheDocument()
    expect(screen.getByText('Beach Club Sunset')).toBeInTheDocument()
  })

  it('displays app statistics section', () => {
    render(<AdminDashboard />)
    
    expect(screen.getByText('Mobile App Statistics')).toBeInTheDocument()
    expect(screen.getByText('iOS App')).toBeInTheDocument()
    expect(screen.getByText('Android App')).toBeInTheDocument()
  })
})