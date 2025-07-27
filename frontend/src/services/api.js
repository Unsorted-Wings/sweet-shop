import axios from 'axios'

const API_BASE_URL = 'https://sweet-shop-theta.vercel.app/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add token to requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle auth errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Sweet API functions
export const sweetAPI = {
  // Get all sweets
  getAll: async () => {
    const response = await api.get('/sweets')
    return response.data
  },

  // Search sweets
  search: async (params) => {
    const response = await api.get('/sweets/search', { params })
    return response.data
  },

  // Create sweet (admin only)
  create: async (sweetData) => {
    const response = await api.post('/sweets', sweetData)
    return response.data
  },

  // Update sweet (admin only)
  update: async (id, sweetData) => {
    const response = await api.put(`/sweets/${id}`, sweetData)
    return response.data
  },

  // Delete sweet (admin only)
  delete: async (id) => {
    const response = await api.delete(`/sweets/${id}`)
    return response.data
  },

  // Purchase sweet
  purchase: async (id, quantity = 1) => {
    const response = await api.post(`/sweets/${id}/purchase`, { quantity })
    return response.data
  },

  // Restock sweet (admin only)
  restock: async (id, quantity) => {
    const response = await api.post(`/sweets/${id}/restock`, { quantity })
    return response.data
  }
}

// Auth API functions
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  }
}

export default api
