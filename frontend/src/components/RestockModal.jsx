import React, { useState } from 'react';
import { motion } from 'framer-motion';

const RestockModal = ({ show, selectedProduct, restockQuantity, setRestockQuantity, onClose, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  if (!show || !selectedProduct) return null;

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
        <h3 className="text-2xl font-bold text-white mb-6">Restock Product</h3>
        <div className="mb-4">
          <p className="text-gray-300">Product: <span className="text-white font-semibold">{selectedProduct.name}</span></p>
          <p className="text-gray-300">Current Stock: <span className="text-white font-semibold">{selectedProduct.stock}</span></p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">Add Quantity</label>
            <input
              type="number"
              value={restockQuantity}
              onChange={e => setRestockQuantity(e.target.value)}
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
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-500/20 text-gray-300 font-semibold rounded-xl hover:bg-gray-500/30 transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              whileHover={!loading ? { scale: 1.05 } : {}}
              whileTap={!loading ? { scale: 0.95 } : {}}
              className={`flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Restocking...' : 'Restock'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default RestockModal;
