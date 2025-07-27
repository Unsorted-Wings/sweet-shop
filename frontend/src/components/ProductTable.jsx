import React from 'react';
import { motion } from 'framer-motion';
import { Package, Trash2, Edit } from 'lucide-react';

const ProductTable = ({ products, deletingId, openRestockModal, openEditModal, handleDeleteProduct }) => (
  <div className="w-full">
    {/* Table view: hidden on mobile, visible on sm and up */}
    <div className="hidden sm:block overflow-x-auto">
      <table className="w-full min-w-[600px]">
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
        {products.map((product, index) => {
          const productId = product.id || product._id;
          return (
            <motion.tr
              key={productId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="border-b border-white/10 hover:bg-white/5 transition-colors"
            >
              <td className="p-4 max-w-[180px] break-words">
                <div className="text-white font-semibold text-sm sm:text-base">{product.name}</div>
              </td>
              <td className="p-4">
                <div className="text-green-400 font-semibold text-sm sm:text-base">${product.price}</div>
              </td>
              <td className="p-4">
                <div className={`font-semibold text-sm sm:text-base ${
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
                <div className="flex flex-wrap items-center gap-2">
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
                    onClick={() => openEditModal(product)}
                    className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                    title="Edit Product"
                  >
                    <Edit size={16} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDeleteProduct(productId)}
                    className={`p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors ${deletingId === productId ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title="Delete Product"
                    disabled={deletingId === productId}
                  >
                    {deletingId === productId ? (
                      <span className="animate-spin inline-block"><Trash2 size={16} /></span>
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </motion.button>
                </div>
              </td>
            </motion.tr>
          );
        })}
      </tbody>
      </table>
    </div>
    {/* Mobile stacked view: visible only on mobile */}
    <div className="block sm:hidden mt-6 space-y-4">
      {products.map((product, index) => {
        const productId = product.id || product._id;
        return (
          <div key={productId} className="rounded-2xl bg-white/5 border border-white/10 p-4 flex flex-col gap-2 shadow-md">
            <div className="flex justify-between items-center">
              <div className="font-bold text-white text-base">{product.name}</div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                product.status === 'active' 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {product.status}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-green-400 font-semibold">${product.price}</span>
              <span className={`font-semibold ${
                product.stock === 0 ? 'text-red-400' : 
                product.stock < 5 ? 'text-orange-400' : 'text-green-400'
              }`}>
                {product.stock} in stock
              </span>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => openRestockModal(product)}
                className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                title="Restock Product"
              >
                <Package size={16} />
              </button>
              <button
                onClick={() => openEditModal(product)}
                className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                title="Edit Product"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => handleDeleteProduct(productId)}
                className={`p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors ${deletingId === productId ? 'opacity-50 cursor-not-allowed' : ''}`}
                title="Delete Product"
                disabled={deletingId === productId}
              >
                {deletingId === productId ? (
                  <span className="animate-spin inline-block"><Trash2 size={16} /></span>
                ) : (
                  <Trash2 size={16} />
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default ProductTable;
