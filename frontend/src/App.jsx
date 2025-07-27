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
            <button type="button">Purchase</button>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
