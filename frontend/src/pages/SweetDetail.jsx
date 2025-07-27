import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Star, ShoppingCart } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { sweetAPI } from '../services/api'

const pageVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  },
  exit: {
    opacity: 0,
    y: -50,
    transition: { duration: 0.4 }
  }
}

const imageVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut" }
  }
}

function SweetDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [sweet, setSweet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    fetchSweetDetail()
  }, [id])

  const fetchSweetDetail = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Try to fetch from API if authenticated
      if (isAuthenticated) {
        const response = await sweetAPI.getById(id)
        if (response && response.sweet) {
          setSweet(response.sweet)
          return
        }
      }
      
      // Fallback to mock data for demo purposes
      const mockSweets = [
        {
          id: 1,
          name: 'Chocolate Delight',
          price: 12.99,
          description: 'Rich, velvety chocolate cake with layers of dark chocolate ganache and a hint of espresso. Made with premium Belgian chocolate.',
          image: '🍰',
          category: 'Cakes',
          ingredients: ['Belgian Dark Chocolate', 'Fresh Cream', 'Espresso', 'Vanilla Extract'],
          allergens: ['Gluten', 'Dairy', 'Eggs'],
          nutritionPer100g: {
            calories: 420,
            fat: 28,
            carbs: 38,
            protein: 6,
            sugar: 32
          },
          stock: 15,
          rating: 4.8,
          reviews: 142
        },
        {
          id: 2,
          name: 'Strawberry Dream',
          price: 10.99,
          description: 'Light and fluffy strawberry sponge cake with fresh strawberry cream and seasonal berry compote.',
          image: '🍓',
          category: 'Cakes',
          ingredients: ['Fresh Strawberries', 'Whipped Cream', 'Vanilla Sponge', 'Berry Compote'],
          allergens: ['Gluten', 'Dairy', 'Eggs'],
          nutritionPer100g: {
            calories: 280,
            fat: 12,
            carbs: 42,
            protein: 4,
            sugar: 38
          },
          stock: 8,
          rating: 4.6,
          reviews: 98
        },
        {
          id: 3,
          name: 'Vanilla Bliss',
          price: 9.99,
          description: 'Classic vanilla cupcake with Madagascar vanilla buttercream frosting and edible gold leaf decoration.',
          image: '🧁',
          category: 'Cupcakes',
          ingredients: ['Madagascar Vanilla', 'Premium Butter', 'Free-Range Eggs', 'Organic Flour'],
          allergens: ['Gluten', 'Dairy', 'Eggs'],
          nutritionPer100g: {
            calories: 380,
            fat: 22,
            carbs: 45,
            protein: 5,
            sugar: 40
          },
          stock: 0,
          rating: 4.9,
          reviews: 201
        }
      ]
      
      const foundSweet = mockSweets.find(s => s.id === parseInt(id))
      setSweet(foundSweet)
      
    } catch (error) {
      console.error('Failed to fetch sweet details:', error)
      setError('Failed to load sweet details')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    // Add to cart logic here
    console.log(`Added ${quantity} x ${sweet.name} to cart`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-6xl"
        >
          🍭
        </motion.div>
      </div>
    )
  }

  if (!sweet) {
    return (
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="min-h-screen flex items-center justify-center"
      >
        <div className="text-center">
          <div className="text-8xl mb-4">😔</div>
          <h2 className="text-2xl text-gray-300 mb-4">Sweet not found</h2>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full hover:shadow-lg transition-all duration-300"
          >
            Back to Home
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-screen p-6"
    >
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <motion.button
          whileHover={{ x: -5 }}
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-300 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Collection
        </motion.button>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Image Section */}
          <motion.div
            variants={imageVariants}
            className="relative"
          >
            <div className="aspect-square bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-3xl p-12 flex items-center justify-center border border-white/10 backdrop-blur-sm">
              <div className="text-[12rem] filter drop-shadow-2xl">
                {sweet.image}
              </div>
            </div>
            
            {/* Stock indicator */}
            <div className={`absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-semibold ${
              sweet.stock > 0 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {sweet.stock > 0 ? `${sweet.stock} in stock` : 'Out of stock'}
            </div>
          </motion.div>

          {/* Details Section */}
          <div className="space-y-6">
            <div>
              <span className="text-pink-400 text-sm font-semibold uppercase tracking-wider">
                {sweet.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">
                {sweet.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={`${
                        i < Math.floor(sweet.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-yellow-400 font-semibold">{sweet.rating}</span>
                <span className="text-gray-400">({sweet.reviews} reviews)</span>
              </div>

              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                {sweet.description}
              </p>

              <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text mb-8">
                ${sweet.price}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-gray-300 font-semibold">Quantity:</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
                  disabled={sweet.stock === 0}
                >
                  -
                </button>
                <span className="w-12 text-center font-semibold text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(sweet.stock, quantity + 1))}
                  className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
                  disabled={sweet.stock === 0 || quantity >= sweet.stock}
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <motion.button
              whileHover={{ scale: sweet.stock > 0 ? 1.02 : 1 }}
              whileTap={{ scale: sweet.stock > 0 ? 0.98 : 1 }}
              onClick={handleAddToCart}
              disabled={sweet.stock === 0}
              className={`w-full py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 transition-all duration-300 ${
                sweet.stock > 0
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg hover:shadow-pink-500/25'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              <ShoppingCart size={24} />
              {sweet.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </motion.button>

            {/* Additional Info */}
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              {/* Ingredients */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-white font-semibold mb-3">Ingredients</h3>
                <ul className="space-y-1">
                  {sweet.ingredients.map((ingredient, index) => (
                    <li key={index} className="text-gray-300 text-sm">
                      • {ingredient}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Nutrition */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-white font-semibold mb-3">Nutrition (per 100g)</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Calories</span>
                    <span className="text-white">{sweet.nutritionPer100g.calories}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Fat</span>
                    <span className="text-white">{sweet.nutritionPer100g.fat}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Carbs</span>
                    <span className="text-white">{sweet.nutritionPer100g.carbs}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Protein</span>
                    <span className="text-white">{sweet.nutritionPer100g.protein}g</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Allergens */}
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
              <h3 className="text-red-400 font-semibold mb-2">Allergen Information</h3>
              <p className="text-red-300 text-sm">
                Contains: {sweet.allergens.join(', ')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default SweetDetail
