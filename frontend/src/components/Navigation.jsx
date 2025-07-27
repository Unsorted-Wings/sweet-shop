import React from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { User, LogOut, Settings } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

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
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  
  const isActive = (path) => location.pathname === path

  const handleLogout = async () => {
    await logout()
  }

  return (
    <motion.nav 
      className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50 shadow-2xl"
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Left: Logo */}
          <div className="flex-1 min-w-[120px] flex items-center">
            <Link to="/">
              <motion.div
                className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-300 hover:to-purple-300 transition-colors duration-300 select-none"
                whileHover={{ scale: 1.08 }}
              >
                🍭 Sweet Shop
              </motion.div>
            </Link>
          </div>

          {/* Center: Nav Links */}
          <div className="flex-1 flex justify-center items-center gap-2 md:gap-6">
            <Link to="/">
              <motion.div 
                className={`group px-5 py-2 rounded-xl font-semibold transition-all duration-300 backdrop-blur-md border shadow-sm ${
                  isActive('/') 
                    ? 'text-white bg-white/20 border-white/30' 
                    : 'text-white/90 hover:text-white hover:bg-white/10 border-transparent hover:border-white/20'
                }`}
                variants={linkVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
              >
                <span className="flex items-center gap-2">
                  <motion.span variants={iconFloat} animate="animate">🏠</motion.span>
                  <span>Home</span>
                </span>
              </motion.div>
            </Link>
            <Link to="/about">
              <motion.div 
                className={`group px-5 py-2 rounded-xl font-semibold transition-all duration-300 backdrop-blur-md border shadow-sm ${
                  isActive('/about') 
                    ? 'text-white bg-white/20 border-white/30' 
                    : 'text-white/90 hover:text-white hover:bg-white/10 border-transparent hover:border-white/20'
                }`}
                variants={linkVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
              >
                <span className="flex items-center gap-2">
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
            {isAuthenticated && isAdmin && (
              <Link to="/admin">
                <motion.div 
                  className={`group px-5 py-2 rounded-xl font-semibold transition-all duration-300 backdrop-blur-md border shadow-sm ${
                    isActive('/admin') 
                      ? 'text-white bg-white/20 border-white/30' 
                      : 'text-white/90 hover:text-white hover:bg-white/10 border-transparent hover:border-white/20'
                  }`}
                  variants={linkVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <span className="flex items-center gap-2">
                    <motion.span 
                      variants={iconFloat} 
                      animate="animate"
                      style={{ animationDelay: "1.5s" }}
                    >
                      <Settings size={18} />
                    </motion.span>
                    <span>Admin</span>
                  </span>
                </motion.div>
              </Link>
            )}
          </div>

          {/* Right: Auth Links or Greeting */}
          <div className="flex-1 flex justify-end items-center gap-2 md:gap-4 min-w-[180px]">
            {isAuthenticated ? (
              <>
                <span className="hidden sm:inline text-white/80 text-sm mr-2">Hi, {user?.name || user?.email}</span>
                <motion.button
                  onClick={handleLogout}
                  className="group px-4 py-2 rounded-xl font-semibold transition-all duration-300 backdrop-blur-md border text-white/90 hover:text-white hover:bg-red-500/20 border-transparent hover:border-red-400/30 flex items-center gap-2"
                  variants={linkVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </motion.button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <motion.div 
                    className={`group px-5 py-2 rounded-xl font-semibold transition-all duration-300 backdrop-blur-md border shadow-sm ${
                      isActive('/login') 
                        ? 'text-white bg-white/20 border-white/30' 
                        : 'text-white/90 hover:text-white hover:bg-white/10 border-transparent hover:border-white/20'
                    }`}
                    variants={linkVariants}
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <span className="flex items-center gap-2">
                      <motion.span 
                        variants={iconFloat} 
                        animate="animate"
                        style={{ animationDelay: "1s" }}
                      >
                        <User size={18} />
                      </motion.span>
                      <span>Login</span>
                    </span>
                  </motion.div>
                </Link>
                <Link to="/register">
                  <motion.div 
                    className="group px-5 py-2 rounded-xl font-semibold transition-all duration-300 backdrop-blur-md border bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-pink-400/30 text-white hover:from-pink-500/30 hover:to-purple-500/30 hover:border-pink-400/50 shadow-sm"
                    variants={linkVariants}
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <span className="flex items-center gap-2">
                      <motion.span 
                        variants={iconFloat} 
                        animate="animate"
                        style={{ animationDelay: "1.5s" }}
                      >
                        ✨
                      </motion.span>
                      <span>Register</span>
                    </span>
                  </motion.div>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navigation
