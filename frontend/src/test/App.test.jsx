import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'

describe('App Component', () => {
  it('should render Sweet Shop heading', () => {
    render(<App />)
    
    expect(screen.getByText('Sweet Shop')).toBeInTheDocument()
  })

  it('should render navigation with Home link', () => {
    render(<App />)
    
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
  })

  it('should render Browse Sweets navigation link', () => {
    render(<App />)
    
    expect(screen.getByRole('link', { name: /browse sweets/i })).toBeInTheDocument()
  })

  it('should render Search navigation link', () => {
    render(<App />)
    
    expect(screen.getByRole('link', { name: /search/i })).toBeInTheDocument()
  })

  it('should render sweets list section', () => {
    render(<App />)
    
    expect(screen.getByTestId('sweets-list')).toBeInTheDocument()
  })

  it('should render a sweet card with name, price and purchase button', () => {
    render(<App />)
    
    expect(screen.getByTestId('sweet-card-1')).toBeInTheDocument()
    expect(screen.getByText('Chocolate Cake')).toBeInTheDocument()
    expect(screen.getByText('₹500')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /purchase/i })).toBeInTheDocument()
  })

  it('should disable purchase button when sweet quantity is zero', () => {
    render(<App />)
    
    const outOfStockCard = screen.getByTestId('sweet-card-2')
    expect(outOfStockCard).toBeInTheDocument()
    expect(screen.getByText('Vanilla Cupcake')).toBeInTheDocument()
    expect(screen.getByText('Out of Stock')).toBeInTheDocument()
    
    const purchaseButton = screen.getByTestId('purchase-btn-2')
    expect(purchaseButton).toBeDisabled()
  })
})
