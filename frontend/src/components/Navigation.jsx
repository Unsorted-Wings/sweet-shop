import React from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'

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
  const location = useLocation()
  
  const isActive = (path) => location.pathname === path

  return (
    <motion.nav 
      className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50 shadow-2xl"
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex flex-wrap gap-8 items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <motion.div
              className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400"
              whileHover={{ scale: 1.05 }}
            >
              🍭 Sweet Shop
            </motion.div>
          </Link>

          {/* Navigation Links */}
          <div className="flex gap-6 items-center">
            <Link to="/">
              <motion.div 
                className={`group px-6 py-3 rounded-2xl font-semibold transition-all duration-300 backdrop-blur-md border ${
                  isActive('/') 
                    ? 'text-white bg-white/20 border-white/30' 
                    : 'text-white/90 hover:text-white hover:bg-white/10 border-transparent hover:border-white/20'
                }`}
                variants={linkVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
              >
                <span className="flex items-center gap-3">
                  <motion.span variants={iconFloat} animate="animate">🏠</motion.span>
                  <span>Home</span>
                </span>
              </motion.div>
            </Link>
            
            <Link to="/about">
              <motion.div 
                className={`group px-6 py-3 rounded-2xl font-semibold transition-all duration-300 backdrop-blur-md border ${
                  isActive('/about') 
                    ? 'text-white bg-white/20 border-white/30' 
                    : 'text-white/90 hover:text-white hover:bg-white/10 border-transparent hover:border-white/20'
                }`}
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
                    📖
                  </motion.span>
                  <span>About</span>
                </span>
              </motion.div>
            </Link>
            
            <Link to="/cart">
              <motion.div 
                className={`group px-6 py-3 rounded-2xl font-semibold transition-all duration-300 backdrop-blur-md border relative ${
                  isActive('/cart') 
                    ? 'text-white bg-white/20 border-white/30' 
                    : 'text-white/90 hover:text-white hover:bg-white/10 border-transparent hover:border-white/20'
                }`}
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
                    <ShoppingCart size={18} />
                  </motion.span>
                  <span>Cart</span>
                </span>
                {/* Cart badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center"
                >
                  3
                </motion.div>
              </motion.div>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navigation
