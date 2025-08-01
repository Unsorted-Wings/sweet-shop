import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import SweetCard from '../components/SweetCard'

describe('SweetCard Component', () => {
  const mockSweet = {
    id: 1,
    name: 'Test Sweet',
    price: '$10.99',
    quantity: 5
  }

  const mockOutOfStockSweet = {
    id: 2,
    name: 'Out of Stock Sweet',
    price: '$15.99',
    quantity: 0
  }

  it('should render sweet information correctly', () => {
    render(
      <MemoryRouter>
        <SweetCard 
          sweet={mockSweet}
          testId="test-card"
          buttonTestId="test-button"
          index={0}
        />
      </MemoryRouter>
    )
    
    expect(screen.getByTestId('test-card')).toBeInTheDocument()
    expect(screen.getByText('Test Sweet')).toBeInTheDocument()
    expect(screen.getByText('$10.99')).toBeInTheDocument()
    expect(screen.getByTestId('test-button')).toBeInTheDocument()
    expect(screen.getByTestId('test-button')).not.toBeDisabled()
  })

  it('should show "Out of Stock" when quantity is zero', () => {
    render(
      <MemoryRouter>
        <SweetCard 
          sweet={mockOutOfStockSweet}
          testId="out-of-stock-card"
          buttonTestId="out-of-stock-button"
          index={0}
        />
      </MemoryRouter>
    )
    
    expect(screen.getByText('Out of Stock Sweet')).toBeInTheDocument()
    expect(screen.getByText('Out of Stock')).toBeInTheDocument()
    expect(screen.queryByText('$15.99')).not.toBeInTheDocument()
  })

  it('should disable purchase button when out of stock', () => {
    render(
      <MemoryRouter>
        <SweetCard 
          sweet={mockOutOfStockSweet}
          testId="out-of-stock-card"
          buttonTestId="out-of-stock-button"
          index={0}
        />
      </MemoryRouter>
    )
    
    const button = screen.getByTestId('out-of-stock-button')
    expect(button).toBeDisabled()
    expect(button).toHaveTextContent('😔 Sold Out')
  })

  it('should enable purchase button when in stock', () => {
    render(
      <MemoryRouter>
        <SweetCard 
          sweet={mockSweet}
          testId="in-stock-card"
          buttonTestId="in-stock-button"
          index={0}
        />
      </MemoryRouter>
    )
    
    const button = screen.getByTestId('in-stock-button')
    expect(button).not.toBeDisabled()
    expect(button).toHaveTextContent('🛒 Add to Cart')
  })
})
