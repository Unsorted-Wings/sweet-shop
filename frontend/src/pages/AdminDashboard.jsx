import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp,
  Package,
  Eye,
  Edit,
  Trash2,
  Plus
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { sweetAPI } from '../services/api'

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
}

function AdminDashboard() {
  const { user, isAdmin } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showRestockModal, setShowRestockModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editQuantity, setEditQuantity] = useState('')
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: '',
    quantity: ''
  })
  const [restockQuantity, setRestockQuantity] = useState('')

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardData()
    }
  }, [isAdmin])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      // Fetch sweets data from the backend
      const response = await sweetAPI.getAll()
      
      if (response && response.sweets) {
        setProducts(response.sweets.map(sweet => ({
          id: sweet._id || sweet.id,
          name: sweet.name,
          price: sweet.price,
          stock: sweet.quantity || sweet.stock || 0,
          category: sweet.category,
          status: sweet.quantity > 0 ? 'active' : 'out-of-stock'
        })))
        
        // Calculate stats from the products
        setStats({
          totalUsers: 1234, // Mock data - would need a separate endpoint
          totalOrders: 567, // Mock data - would need a separate endpoint
          totalRevenue: response.sweets.reduce((total, sweet) => total + (sweet.price * (sweet.soldQuantity || 0)), 0),
          totalProducts: response.sweets.length
        })
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      // Mock data for demo when backend is not available
      setStats({
        totalUsers: 1234,
        totalOrders: 567,
        totalRevenue: 12345.67,
        totalProducts: 25
      })
      setProducts([
        { id: 1, name: 'Chocolate Cake', price: 12.99, stock: 15, category: 'cakes', status: 'active' },
        { id: 2, name: 'Vanilla Cupcake', price: 8.99, stock: 0, category: 'cupcakes', status: 'out-of-stock' },
        { id: 3, name: 'Strawberry Tart', price: 15.50, stock: 3, category: 'tarts', status: 'active' }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setDeletingId(id)
      try {
        await sweetAPI.delete(id)
        setProducts(products.filter(p => p.id !== id))
        // Update stats
        setStats(prev => ({
          ...prev,
          totalProducts: prev.totalProducts - 1
        }))
      } catch (error) {
        console.error('Failed to delete product:', error)
        const msg = error?.response?.data?.error || 'Failed to delete product. Please try again.'
        alert(msg)
      } finally {
        setDeletingId(null)
      }
    }
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    try {
      const productData = {
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        category: newProduct.category,
        quantity: parseInt(newProduct.quantity)
      }
      
      const response = await sweetAPI.create(productData)
      
      if (response) {
        // Add to products list
        const newProductItem = {
          id: response._id || response.id,
          name: response.name,
          price: response.price,
          stock: response.quantity,
          category: response.category,
          status: response.quantity > 0 ? 'active' : 'out-of-stock'
        }
        
        setProducts([...products, newProductItem])
        
        // Update stats
        setStats(prev => ({
          ...prev,
          totalProducts: prev.totalProducts + 1
        }))
        
        // Reset form and close modal
        setNewProduct({ name: '', price: '', category: '', quantity: '' })
        setShowAddModal(false)
        
        alert('Product added successfully!')
      }
    } catch (error) {
      console.error('Failed to add product:', error)
      alert('Failed to add product. Please try again.')
    }
  }

  const handleRestock = async (e) => {
    e.preventDefault()
    if (!selectedProduct || !restockQuantity) return
    try {
      const response = await sweetAPI.restock(selectedProduct.id, parseInt(restockQuantity))
      if (response) {
        setProducts(products.map(p => 
          p.id === selectedProduct.id 
            ? { 
                ...p, 
                stock: p.stock + parseInt(restockQuantity),
                status: p.stock + parseInt(restockQuantity) > 0 ? 'active' : 'out-of-stock'
              }
            : p
        ))
        setRestockQuantity('')
        setSelectedProduct(null)
        setShowRestockModal(false)
        alert('Product restocked successfully!')
      }
    } catch (error) {
      console.error('Failed to restock product:', error)
      alert('Failed to restock product. Please try again.')
    }
  }

  const openEditModal = (product) => {
    setSelectedProduct(product)
    setEditQuantity(product.stock)
    setShowEditModal(true)
  }

  const handleEditQuantity = async (e) => {
    e.preventDefault()
    if (!selectedProduct || editQuantity === '') return
    try {
      const response = await sweetAPI.update(selectedProduct.id, { quantity: parseInt(editQuantity) })
      if (response) {
        setProducts(products.map(p =>
          p.id === selectedProduct.id
            ? {
                ...p,
                stock: response.quantity,
                status: response.quantity > 0 ? 'active' : 'out-of-stock'
              }
            : p
        ))
        setShowEditModal(false)
        setSelectedProduct(null)
        setEditQuantity('')
        alert('Quantity updated successfully!')
      }
    } catch (error) {
      console.error('Failed to update quantity:', error)
      alert('Failed to update quantity. Please try again.')
    }
  }

  const openRestockModal = (product) => {
    setSelectedProduct(product)
    setShowRestockModal(true)
  }

  if (!isAdmin) {
    return (
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="min-h-screen flex items-center justify-center p-6"
      >
        <div className="text-center">
          <div className="text-8xl mb-6">🚫</div>
          <h2 className="text-3xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-gray-300 mb-8">You don't have permission to access the admin dashboard.</p>
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-2xl"
            >
              Back to Home
            </motion.button>
          </Link>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen p-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <motion.button
                whileHover={{ x: -5 }}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Home
              </motion.button>
            </Link>
          </div>
          
          <div className="text-right">
            <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-300">Welcome back, {user?.firstName}!</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>

            {/* Products Management */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden"
            >
              <div className="p-6 border-b border-white/20">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Package className="text-purple-400" />
                    Product Management
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl"
                  >
                    <Plus size={18} />
                    Add Product
                  </motion.button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left p-4 text-gray-300 font-semibold">Product</th>
                      <th className="text-left p-4 text-gray-300 font-semibold">Price</th>
                      <th className="text-left p-4 text-gray-300 font-semibold">Stock</th>
                      <th className="text-left p-4 text-gray-300 font-semibold">Status</th>
                      <th className="text-left p-4 text-gray-300 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, index) => (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="border-b border-white/10 hover:bg-white/5 transition-colors"
                      >
                        <td className="p-4">
                          <div className="text-white font-semibold">{product.name}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-green-400 font-semibold">${product.price}</div>
                        </td>
                        <td className="p-4">
                          <div className={`font-semibold ${
                            product.stock === 0 ? 'text-red-400' : 
                            product.stock < 5 ? 'text-orange-400' : 'text-green-400'
                          }`}>
                            {product.stock}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            product.status === 'active' 
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}>
                            {product.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => openRestockModal(product)}
                              className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                              title="Restock Product"
                            >
                              <Package size={16} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDeleteProduct(product.id)}
                              className={`p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors ${deletingId === product.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                              title="Delete Product"
                              disabled={deletingId === product.id}
                            >
                              {deletingId === product.id ? (
                                <span className="animate-spin inline-block"><Trash2 size={16} /></span>
                              ) : (
                                <Trash2 size={16} />
                              )}
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 w-full max-w-md"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Add New Product</h3>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Product Name</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                  placeholder="Enter price"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Category</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-pink-500"
                  required
                >
                  <option value="">Select category</option>
                  <option value="chocolate">Chocolate</option>
                  <option value="candy">Candy</option>
                  <option value="gummy">Gummy</option>
                  <option value="hard-candy">Hard Candy</option>
                  <option value="lollipop">Lollipop</option>
                  <option value="toffee">Toffee</option>
                  <option value="fudge">Fudge</option>
                  <option value="marshmallow">Marshmallow</option>
                  <option value="cake">Cake</option>
                  <option value="cookie">Cookie</option>
                  <option value="pastry">Pastry</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Initial Quantity</label>
                <input
                  type="number"
                  value={newProduct.quantity}
                  onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                  placeholder="Enter quantity"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowAddModal(false)
                    setNewProduct({ name: '', price: '', category: '', quantity: '' })
                  }}
                  className="flex-1 px-4 py-3 bg-gray-500/20 text-gray-300 font-semibold rounded-xl hover:bg-gray-500/30 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl"
                >
                  Add Product
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Restock Modal */}
      {showRestockModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 w-full max-w-md"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Restock Product</h3>
            <div className="mb-4">
              <p className="text-gray-300">Product: <span className="text-white font-semibold">{selectedProduct.name}</span></p>
              <p className="text-gray-300">Current Stock: <span className="text-white font-semibold">{selectedProduct.stock}</span></p>
            </div>
            <form onSubmit={handleRestock} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Add Quantity</label>
                <input
                  type="number"
                  value={restockQuantity}
                  onChange={(e) => setRestockQuantity(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                  placeholder="Enter quantity to add"
                  min="1"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowRestockModal(false)
                    setSelectedProduct(null)
                    setRestockQuantity('')
                  }}
                  className="flex-1 px-4 py-3 bg-gray-500/20 text-gray-300 font-semibold rounded-xl hover:bg-gray-500/30 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl"
                >
                  Restock
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}

export default AdminDashboard
