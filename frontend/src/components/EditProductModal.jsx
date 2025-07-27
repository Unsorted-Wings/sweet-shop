import React from 'react';
import { motion } from 'framer-motion';

const EditProductModal = ({ show, product, setProduct, onClose, onSubmit }) => {
  if (!show || !product) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 w-full max-w-md"
      >
        <h3 className="text-2xl font-bold text-white mb-6">Edit Product</h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">Product Name</label>
            <input
              type="text"
              value={product.name}
              onChange={e => setProduct({ ...product, name: e.target.value })}
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
              value={product.price}
              onChange={e => setProduct({ ...product, price: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
              placeholder="Enter price"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">Category</label>
            <select
              value={product.category}
              onChange={e => setProduct({ ...product, category: e.target.value })}
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl"
            >
              Save Changes
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditProductModal;
