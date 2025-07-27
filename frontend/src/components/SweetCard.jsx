import React from 'react'

function SweetCard({ sweet, testId, buttonTestId }) {
  const isOutOfStock = sweet.quantity === 0
  
  return (
    <div data-testid={testId} className="sweet-card">
      <h3>{sweet.name}</h3>
      <p className="price">
        {isOutOfStock ? 'Out of Stock' : sweet.price}
      </p>
      <button 
        type="button" 
        data-testid={buttonTestId}
        disabled={isOutOfStock}
      >
        Purchase
      </button>
    </div>
  )
}

export default SweetCard
