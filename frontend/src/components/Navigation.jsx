import React from 'react'
import { motion } from 'framer-motion'

const navVariants = {
  hidden: { y: -100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      type: "spring",
      stiffness: 100
    }
  }
}

const linkVariants = {
  rest: { scale: 1, y: 0 },
  hover: { 
    scale: 1.1, 
    y: -2,
    transition: {
      duration: 0.3,
      type: "spring",
      stiffness: 300
    }
  },
  tap: { scale: 0.95 }
}

const iconFloat = {
  animate: {
    y: [0, -3, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

function Navigation() {
  return (
    <motion.nav 
      className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50 shadow-2xl"
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex flex-wrap gap-8 items-center justify-center">
          <motion.a 
            href="/" 
            className="group text-white/90 hover:text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:bg-white/10 backdrop-blur-md border border-transparent hover:border-white/20"
            variants={linkVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
          >
            <span className="flex items-center gap-3">
              <motion.span variants={iconFloat} animate="animate">🏠</motion.span>
              <span>Home</span>
            </span>
          </motion.a>
          
          <motion.a 
            href="/sweets" 
            className="group text-white/90 hover:text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:bg-white/10 backdrop-blur-md border border-transparent hover:border-white/20"
            variants={linkVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
          >
            <span className="flex items-center gap-3">
              <motion.span 
                variants={iconFloat} 
                animate="animate"
                style={{ animationDelay: "0.5s" }}
              >
                🍰
              </motion.span>
              <span>Browse Sweets</span>
            </span>
          </motion.a>
          
          <motion.a 
            href="/search" 
            className="group text-white/90 hover:text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:bg-white/10 backdrop-blur-md border border-transparent hover:border-white/20"
            variants={linkVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
          >
            <span className="flex items-center gap-3">
              <motion.span 
                variants={iconFloat} 
                animate="animate"
                style={{ animationDelay: "1s" }}
              >
                🔍
              </motion.span>
              <span>Search</span>
            </span>
          </motion.a>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navigation
