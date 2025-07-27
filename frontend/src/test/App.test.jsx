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
})
