import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AddProductModal = ({ show, newProduct, setNewProduct, onClose, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 w-full max-w-md"
      >
        <h3 className="text-2xl font-bold text-white mb-6">Add New Product</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">Product Name</label>
            <input
              type="text"
              value={newProduct.name}
              onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
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
              onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
              placeholder="Enter price"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">Category</label>
            <select
              value={newProduct.category}
              onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-gray-400 focus:outline-none focus:border-pink-500"
              required
            >
              <option value="" className='text-black'>Select category</option>
              <option value="chocolate" className='text-black' >Chocolate</option>
              <option value="candy" className='text-black' >Candy</option>
              <option value="gummy" className='text-black' >Gummy</option>
              <option value="hard-candy" className='text-black' >Hard Candy</option>
              <option value="lollipop" className='text-black' >Lollipop</option>
              <option value="toffee" className='text-black' >Toffee</option>
              <option value="fudge" className='text-black' >Fudge</option>
              <option value="marshmallow" className='text-black' >Marshmallow</option>
              <option value="cake" className='text-black' >Cake</option>
              <option value="cookie" className='text-black' >Cookie</option>
              <option value="pastry" className='text-black' >Pastry</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">Initial Quantity</label>
            <input
              type="number"
              value={newProduct.quantity}
              onChange={e => setNewProduct({ ...newProduct, quantity: e.target.value })}
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
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-500/20 text-gray-300 font-semibold rounded-xl hover:bg-gray-500/30 transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              whileHover={!loading ? { scale: 1.05 } : {}}
              whileTap={!loading ? { scale: 0.95 } : {}}
              className={`flex-1 px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Product'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddProductModal;
