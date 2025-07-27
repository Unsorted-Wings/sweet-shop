import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    scale: 0.9
  },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: index * 0.1,
      type: "spring",
      stiffness: 100
    }
  }),
  hover: {
    y: -10,
    scale: 1.02,
    transition: {
      duration: 0.3,
      type: "spring",
      stiffness: 300
    }
  }
}

const glowVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5 }
  },
  hover: {
    opacity: 0.8,
    scale: 1.1,
    transition: { duration: 0.3 }
  }
}

const emojiVariants = {
  rest: { scale: 1, rotate: 0 },
  hover: { 
    scale: 1.2, 
    rotate: [0, -10, 10, 0],
    transition: {
      duration: 0.5,
      type: "spring",
      stiffness: 300
    }
  }
}

const buttonVariants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: {
      duration: 0.2,
      type: "spring",
      stiffness: 400
    }
  },
  tap: { scale: 0.95 }
}

function SweetCard({ sweet, testId, buttonTestId, index }) {
  const isOutOfStock = sweet.quantity === 0
  const isLowStock = sweet.quantity > 0 && sweet.quantity <= 5
  
  // Get sweet emoji based on name
  const getSweetEmoji = (name) => {
    if (name.toLowerCase().includes('chocolate')) return '🍫'
    if (name.toLowerCase().includes('cake')) return '🎂'
    if (name.toLowerCase().includes('cupcake')) return '🧁'
    if (name.toLowerCase().includes('cookie')) return '🍪'
    if (name.toLowerCase().includes('tart')) return '🥧'
    if (name.toLowerCase().includes('strawberry')) return '🍓'
    return '🍰'
  }

  const getGradientColors = (index) => {
    const gradients = [
      'from-pink-500/20 to-purple-500/20',
      'from-blue-500/20 to-cyan-500/20',
      'from-emerald-500/20 to-teal-500/20',
      'from-orange-500/20 to-red-500/20',
      'from-violet-500/20 to-purple-500/20'
    ]
    return gradients[index % gradients.length]
  }
  
  return (
    <Link to={`/sweet/${sweet.id}`} className="block">
      <motion.div 
        data-testid={testId}
        className="relative group cursor-pointer"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        custom={index}
      >
      {/* Glow effect */}
      <motion.div 
        className={`absolute -inset-1 bg-gradient-to-r ${getGradientColors(index)} rounded-3xl blur-xl opacity-0 group-hover:opacity-100`}
        variants={glowVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
      />
      
      {/* Main card */}
      <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl overflow-hidden h-full flex flex-col">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 right-4 w-20 h-20 bg-white rounded-full"></div>
          <div className="absolute bottom-8 left-4 w-12 h-12 bg-white rounded-full"></div>
        </div>
        
        {/* Stock badge */}
        {!isOutOfStock && (
          <motion.div 
            className="absolute top-4 right-4 z-10"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
          >
            <div className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md ${
              isLowStock 
                ? 'bg-orange-500/20 text-orange-300 border border-orange-400/30' 
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
            }`}>
              {isLowStock ? `${sweet.quantity} left` : 'In Stock'}
            </div>
          </motion.div>
        )}
        
        {/* Out of stock badge */}
        {isOutOfStock && (
          <motion.div 
            className="absolute top-4 right-4 z-10"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
          >
            <div className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-400/30 backdrop-blur-md">
              Sold Out
            </div>
          </motion.div>
        )}
        
        {/* Sweet emoji with animation */}
        <motion.div 
          className="text-6xl mb-6 text-center relative z-10"
          variants={emojiVariants}
          initial="rest"
          whileHover="hover"
        >
          {getSweetEmoji(sweet.name)}
        </motion.div>
        
        {/* Sweet name */}
        <motion.h3 
          className="text-xl font-bold text-white mb-4 text-center relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
        >
          {sweet.name}
        </motion.h3>
        
        <div className="flex-grow flex flex-col justify-between relative z-10">
          {/* Price section */}
          <motion.div 
            className="text-center mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
          >
            <p className={`text-2xl font-black ${
              isOutOfStock 
                ? 'text-gray-400' 
                : 'text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300'
            }`}>
              {isOutOfStock ? 'Out of Stock' : sweet.price}
            </p>
            
            {isLowStock && !isOutOfStock && (
              <motion.p 
                className="text-sm text-orange-300 font-semibold mt-2"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🔥 Hurry! Only {sweet.quantity} remaining!
              </motion.p>
            )}
          </motion.div>
          
          {/* Purchase button */}
          <motion.button 
            type="button" 
            data-testid={buttonTestId}
            disabled={isOutOfStock}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 relative overflow-hidden ${
              isOutOfStock
                ? 'bg-gray-600/30 text-gray-400 cursor-not-allowed backdrop-blur-md border border-gray-500/30'
                : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg backdrop-blur-md border border-pink-400/30'
            }`}
            variants={buttonVariants}
            initial="rest"
            whileHover={!isOutOfStock ? "hover" : "rest"}
            whileTap={!isOutOfStock ? "tap" : "rest"}
          >
            {/* Button shimmer effect */}
            {!isOutOfStock && (
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
            )}
            
            <span className="relative flex items-center justify-center gap-2">
              {isOutOfStock ? (
                <>😔 Sold Out</>
              ) : (
                <>🛒 Add to Cart</>
              )}
            </span>
          </motion.button>
        </div>
      </div>
    </motion.div>
    </Link>
  )
}

export default SweetCard
