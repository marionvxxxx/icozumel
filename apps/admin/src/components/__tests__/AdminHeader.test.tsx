import { render, screen } from '@testing-library/react'
import { AdminHeader } from '../layout/admin-header'

// Mock the UI components
jest.mock('@cozumel/ui', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  Input: (props: any) => <input {...props} />,
}))

describe('AdminHeader', () => {
  it('renders the search input', () => {
    render(<AdminHeader />)
    
    const searchInput = screen.getByPlaceholderText('Search apps, businesses, or users...')
    expect(searchInput).toBeInTheDocument()
  })

  it('displays app ratings', () => {
    render(<AdminHeader />)
    
    expect(screen.getByText('iOS: 4.8★')).toBeInTheDocument()
    expect(screen.getByText('Android: 4.7★')).toBeInTheDocument()
  })

  it('renders admin user button', () => {
    render(<AdminHeader />)
    
    const adminButton = screen.getByText('Admin')
    expect(adminButton).toBeInTheDocument()
  })
})