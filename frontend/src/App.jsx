import React from 'react'
import { Toaster } from 'react-hot-toast'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AuthProvider } from './contexts/AuthContext'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import SweetDetail from './pages/SweetDetail'
import About from './pages/About'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <Router>
        <motion.div 
          className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
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
          <Toaster position="top-center" toastOptions={{
            style: {
              background: 'rgba(30, 27, 75, 0.85)',
              color: '#fff',
              borderRadius: '1rem',
              boxShadow: '0 4px 32px 0 rgba(0,0,0,0.15)',
              fontSize: '1rem',
              backdropFilter: 'blur(8px)'
            },
            success: { iconTheme: { primary: '#a21caf', secondary: '#fff' } },
            error: { iconTheme: { primary: '#e11d48', secondary: '#fff' } }
          }} />
          <Navigation />
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sweet/:id" element={<SweetDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
          
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
    </Router>
    </AuthProvider>
  )
}

export default App
