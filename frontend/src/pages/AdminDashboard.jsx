import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Package, Plus } from 'lucide-react'
import ProductTable from '../components/ProductTable';
import AddProductModal from '../components/AddProductModal';
import RestockModal from '../components/RestockModal';
import { useAuth } from '../contexts/AuthContext'
import { sweetAPI } from '../services/api'
import EditProductModal from '../components/EditProductModal';

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

function AdminDashboard() {
  const { user, isAdmin } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showRestockModal, setShowRestockModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
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
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      // Mock data for demo when backend is not available
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
    e.preventDefault();
    try {
      const productData = {
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        category: newProduct.category,
        quantity: parseInt(newProduct.quantity)
      };
      const response = await sweetAPI.create(productData);
      if (response) {
        // Refresh products and stats from backend
        await fetchDashboardData();
        // Reset form and close modal
        setNewProduct({ name: '', price: '', category: '', quantity: '' });
        setShowAddModal(false);
        alert('Product added successfully!');
      }
    } catch (error) {
      console.error('Failed to add product:', error);
      alert('Failed to add product. Please try again.');
    }
  }

  const handleRestock = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !restockQuantity) return;
    try {
      const response = await sweetAPI.restock(selectedProduct.id, parseInt(restockQuantity));
      if (response) {
        // Refresh products and stats from backend
        await fetchDashboardData();
        // Reset form and close modal
        setSelectedProduct(null);
        setRestockQuantity('');
        setShowRestockModal(false);
        alert('Product restocked successfully!');
      }
    } catch (error) {
      console.error('Failed to restock product:', error);
      alert('Failed to restock product. Please try again.');
    }
  }

  const handleEditProduct = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;
    try {
      const updatedData = {
        name: selectedProduct.name,
        price: parseFloat(selectedProduct.price),
        category: selectedProduct.category,
        quantity: selectedProduct.quantity !== undefined && selectedProduct.quantity !== '' ? parseInt(selectedProduct.quantity) : undefined
      };
      const id = selectedProduct.id || selectedProduct._id;
      const response = await sweetAPI.update(id, updatedData);
      if (response) {
        // Refresh products and stats from backend
        await fetchDashboardData();
        // Reset form and close modal
        setSelectedProduct(null);
        setShowEditModal(false);
        alert('Product updated successfully!');
      }
    } catch (error) {
      console.error('Failed to update product:', error);
      alert('Failed to update product. Please try again.');
    }
  }
  
  const openRestockModal = (product) => {
    setSelectedProduct(product)
    setShowRestockModal(true)
  }

  const openEditModal = (product) => {
    setSelectedProduct(product)
    setShowEditModal(true)
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
              <div className="p-6 border-b border-white/20 flex items-center justify-between">
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
              <ProductTable
                products={products}
                deletingId={deletingId}
                openRestockModal={openRestockModal}
                handleDeleteProduct={handleDeleteProduct}
                openEditModal={openEditModal}
              />
            </motion.div>
          </>
        )}
      </div>

      {/* Add Product Modal */}
      <AddProductModal
        show={showAddModal}
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        onClose={() => {
          setShowAddModal(false);
          setNewProduct({ name: '', price: '', category: '', quantity: '' });
        }}
        onSubmit={handleAddProduct}
      />

      {/* Restock Modal */}
      <RestockModal
        show={showRestockModal}
        selectedProduct={selectedProduct}
        restockQuantity={restockQuantity}
        setRestockQuantity={setRestockQuantity}
        onClose={() => {
          setShowRestockModal(false);
          setSelectedProduct(null);
          setRestockQuantity('');
        }}
        onSubmit={handleRestock}
      />

      <EditProductModal
        show={showEditModal}
        product={selectedProduct}
        setProduct={setSelectedProduct}
        onClose={() => {
          setShowEditModal(false);
          setSelectedProduct(null);
        }}
        onSubmit={handleEditProduct}
      />
    </motion.div>
  )
}

export default AdminDashboard
