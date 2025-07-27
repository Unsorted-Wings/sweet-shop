import React from 'react'
import './App.css'

function App() {
  return (
    <div className="App">
      <nav>
        <a href="/">Home</a>
        <a href="/sweets">Browse Sweets</a>
        <a href="/search">Search</a>
      </nav>
      <h1>Sweet Shop</h1>
      
      <main>
        <section data-testid="sweets-list">
          <h2>Available Sweets</h2>
          <div data-testid="sweet-card-1" className="sweet-card">
            <h3>Chocolate Cake</h3>
            <p className="price">₹500</p>
            <button type="button" data-testid="purchase-btn-1">Purchase</button>
          </div>
          <div data-testid="sweet-card-2" className="sweet-card">
            <h3>Vanilla Cupcake</h3>
            <p className="price">Out of Stock</p>
            <button type="button" data-testid="purchase-btn-2" disabled>Purchase</button>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
