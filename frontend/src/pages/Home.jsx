import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import SweetsList from '../components/SweetsList'
import { sweetAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { SAMPLE_SWEETS } from '../data/sweets'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
}

const heroVariants = {
  hidden: { y: -50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 1,
      type: "spring",
      stiffness: 100
    }
  }
}

function Home() {
  const [sweets, setSweets] = useState(SAMPLE_SWEETS) // Fallback to sample data
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    // Only fetch from backend if user is authenticated
    if (isAuthenticated) {
      fetchSweets()
    }
  }, [isAuthenticated])

  const fetchSweets = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await sweetAPI.getAll()
      if (response && response.sweets && response.sweets.length > 0) {
        setSweets(response.sweets)
      }
    } catch (error) {
      console.error('Failed to fetch sweets:', error)
      setError('Failed to load sweets from server')
      // Keep using sample data as fallback
    } finally {
      setLoading(false)
    }
  }
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen"
    >
      {/* Hero Section */}
      <motion.div 
        className="text-center py-16 px-4"
        variants={heroVariants}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            duration: 1.2,
            type: "spring",
            stiffness: 100,
            delay: 0.5
          }}
        >
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 mb-6 leading-tight">
            Sweet Shop
          </h1>
        </motion.div>
        
        <motion.p 
          className="text-xl md:text-2xl text-white/80 font-light mb-8 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          Indulge in our exquisite collection of handcrafted sweets, 
          where every bite is a moment of pure bliss
        </motion.p>
        
        <motion.div 
          className="flex justify-center mb-8"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.3 }}
        >
          <div className="w-32 h-1 bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 rounded-full shadow-lg"></div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-pink-500/25 transition-all duration-300"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(236, 72, 153, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('sweets-collection').scrollIntoView({ behavior: 'smooth' })}
          >
            🛒 Shop Now
          </motion.button>
          
          <Link to="/about">
            <motion.button
              className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
              whileHover={{ 
                scale: 1.05,
                backgroundColor: "rgba(255, 255, 255, 0.2)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              📖 Our Story
            </motion.button>
          </Link>
        </motion.div>

        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 left-10 text-6xl opacity-20"
          >
            🍰
          </motion.div>
          <motion.div
            animate={{
              y: [0, 15, 0],
              rotate: [0, -5, 0]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute top-32 right-20 text-5xl opacity-20"
          >
            🧁
          </motion.div>
          <motion.div
            animate={{
              y: [0, -25, 0],
              rotate: [0, 8, 0]
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute bottom-20 left-1/4 text-7xl opacity-20"
          >
            🍫
          </motion.div>
        </div>
      </motion.div>

      {/* Sweets Collection */}
      <motion.main 
        id="sweets-collection"
        className="px-4 md:px-8 pb-16"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.8 }}
      >
        {error && (
          <motion.div 
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error} - Showing sample data
          </motion.div>
        )}
        
        {loading ? (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-2xl text-white/60">Loading delicious sweets...</div>
          </motion.div>
        ) : (
          <SweetsList sweets={sweets} />
        )}
      </motion.main>
    </motion.div>
  )
}

export default Home
