import React from 'react'
import './App.css'
import Navigation from './components/Navigation'
import SweetsList from './components/SweetsList'
import { SAMPLE_SWEETS } from './data/sweets'

function App() {
  return (
    <div className="App">
      <Navigation />
      <h1>Sweet Shop</h1>
      
      <main>
        <SweetsList sweets={SAMPLE_SWEETS} />
      </main>
    </div>
  )
}

export default App
