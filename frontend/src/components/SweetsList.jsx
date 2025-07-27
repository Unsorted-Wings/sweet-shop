import React from 'react'
import SweetCard from './SweetCard'

function SweetsList({ sweets }) {
  return (
    <section data-testid="sweets-list">
      <h2>Available Sweets</h2>
      {sweets.map((sweet, index) => (
        <SweetCard 
          key={sweet.id}
          sweet={sweet}
          testId={`sweet-card-${sweet.id}`} 
          buttonTestId={`purchase-btn-${sweet.id}`}
        />
      ))}
    </section>
  )
}

export default SweetsList
