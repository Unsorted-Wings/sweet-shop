import React, { useState } from 'react'
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  const handleLogout = async () => {
    await logout()
    setMobileMenuOpen(false)
  }

  return (
    <motion.nav 
      className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50 shadow-2xl"
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4 flex-wrap md:flex-nowrap">
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

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              className="p-2 rounded-lg text-white/80 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-pink-400"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label="Toggle navigation menu"
            >
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Center: Nav Links (desktop) */}
          <div className="hidden md:flex flex-1 justify-center items-center gap-2 md:gap-6">
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

          {/* Right: Auth Links or Greeting (desktop) */}
          <div className="hidden md:flex flex-1 justify-end items-center gap-2 md:gap-4 min-w-[180px]">
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

        {/* Mobile menu (nav links and auth) */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl p-4 flex flex-col gap-4 animate-fade-in">
            {/* Center: Nav Links (mobile) */}
            <div className="flex flex-col gap-2">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                <div className={`group px-4 py-2 rounded-xl font-semibold transition-all duration-300 backdrop-blur-md border shadow-sm ${
                  isActive('/') 
                    ? 'text-white bg-white/20 border-white/30' 
                    : 'text-white/90 hover:text-white hover:bg-white/10 border-transparent hover:border-white/20'
                }`}>
                  <span className="flex items-center gap-2">
                    <span>🏠</span>
                    <span>Home</span>
                  </span>
                </div>
              </Link>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)}>
                <div className={`group px-4 py-2 rounded-xl font-semibold transition-all duration-300 backdrop-blur-md border shadow-sm ${
                  isActive('/about') 
                    ? 'text-white bg-white/20 border-white/30' 
                    : 'text-white/90 hover:text-white hover:bg-white/10 border-transparent hover:border-white/20'
                }`}>
                  <span className="flex items-center gap-2">
                    <span>📖</span>
                    <span>About</span>
                  </span>
                </div>
              </Link>
              {isAuthenticated && isAdmin && (
                <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                  <div className={`group px-4 py-2 rounded-xl font-semibold transition-all duration-300 backdrop-blur-md border shadow-sm ${
                    isActive('/admin') 
                      ? 'text-white bg-white/20 border-white/30' 
                      : 'text-white/90 hover:text-white hover:bg-white/10 border-transparent hover:border-white/20'
                  }`}>
                    <span className="flex items-center gap-2">
                      <span><Settings size={18} /></span>
                      <span>Admin</span>
                    </span>
                  </div>
                </Link>
              )}
            </div>
            {/* Right: Auth Links or Greeting (mobile) */}
            <div className="flex flex-col gap-2 mt-2">
              {isAuthenticated ? (
                <>
                  <span className="text-white/80 text-sm mb-2">Hi, {user?.name || user?.email}</span>
                  <button
                    onClick={handleLogout}
                    className="group px-4 py-2 rounded-xl font-semibold transition-all duration-300 backdrop-blur-md border text-white/90 hover:text-white hover:bg-red-500/20 border-transparent hover:border-red-400/30 flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <div className={`group px-4 py-2 rounded-xl font-semibold transition-all duration-300 backdrop-blur-md border shadow-sm ${
                      isActive('/login') 
                        ? 'text-white bg-white/20 border-white/30' 
                        : 'text-white/90 hover:text-white hover:bg-white/10 border-transparent hover:border-white/20'
                    }`}>
                      <span className="flex items-center gap-2">
                        <span><User size={18} /></span>
                        <span>Login</span>
                      </span>
                    </div>
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <div className="group px-4 py-2 rounded-xl font-semibold transition-all duration-300 backdrop-blur-md border bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-pink-400/30 text-white hover:from-pink-500/30 hover:to-purple-500/30 hover:border-pink-400/50 shadow-sm">
                      <span className="flex items-center gap-2">
                        <span>✨</span>
                        <span>Register</span>
                      </span>
                    </div>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.nav>
  )
}

export default Navigation
