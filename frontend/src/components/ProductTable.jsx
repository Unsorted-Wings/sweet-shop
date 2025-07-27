import React from 'react';
import { motion } from 'framer-motion';
import { Package, Trash2 } from 'lucide-react';

const ProductTable = ({ products, deletingId, openRestockModal, handleDeleteProduct }) => (
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
            key={product._id}
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
);

export default ProductTable;
