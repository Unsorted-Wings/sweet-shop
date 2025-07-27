import React from 'react'
import './App.css'
import Navigation from './components/Navigation'
import SweetsList from './components/SweetsList'

function App() {
  // Sweet data - will be moved to proper state management later
  const sweets = [
    {
      id: 1,
      name: 'Chocolate Cake',
      price: '₹500',
      quantity: 5
    },
    {
      id: 2,
      name: 'Vanilla Cupcake',
      price: '$8.99',
      quantity: 0
    }
  ]

  return (
    <div className="App">
      <Navigation />
      <h1>Sweet Shop</h1>
      
      <main>
        <SweetsList sweets={sweets} />
      </main>
    </div>
  )
}

export default App
