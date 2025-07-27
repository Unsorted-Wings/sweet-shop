import React from 'react'
import './App.css'
import { motion } from 'framer-motion'
import Navigation from './components/Navigation'
import SweetsList from './components/SweetsList'
import { SAMPLE_SWEETS } from './data/sweets'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      staggerChildren: 0.3
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

function App() {
  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute -top-4 -left-4 w-72 h-72 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-1/3 -right-10 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
          }}
        />
        <motion.div 
          className="absolute -bottom-10 left-1/4 w-80 h-80 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 120, 0],
            y: [0, -80, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 10
          }}
        />
      </div>

      {/* Glass morphism overlay */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>

      <div className="relative z-10">
        <Navigation />
        
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
            >
              🛒 Shop Now
            </motion.button>
            
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
          </motion.div>
        </motion.div>
        
        <motion.main 
          className="px-4 md:px-8 pb-16"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <SweetsList sweets={SAMPLE_SWEETS} />
        </motion.main>
        
        {/* Footer */}
        <motion.footer 
          className="text-center py-12 text-white/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2 }}
        >
          <p className="text-lg">Made with 💖 for sweet lovers everywhere</p>
        </motion.footer>
      </div>
    </motion.div>
  )
}

export default App
