import React from 'react'
import { motion } from 'framer-motion'
import SweetCard from './SweetCard'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
}

const titleVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      type: "spring",
      stiffness: 100
    }
  }
}

function SweetsList({ sweets, onPurchaseSuccess }) {
  return (
    <motion.section 
      data-testid="sweets-list" 
      className="max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="text-center mb-12"
        variants={titleVariants}
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Our Delicious Collection
        </h2>
        <p className="text-white/70 text-lg max-w-2xl mx-auto">
          Each sweet is carefully crafted with love and the finest ingredients
        </p>
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        variants={containerVariants}
      >
        {sweets.map((sweet, index) => (
          <SweetCard 
            key={sweet.id}
            sweet={sweet}
            testId={`sweet-card-${sweet.id}`} 
            buttonTestId={`purchase-btn-${sweet.id}`}
            index={index}
            onPurchaseSuccess={onPurchaseSuccess}
          />
        ))}
      </motion.div>
    </motion.section>
  )
}

export default SweetsList
