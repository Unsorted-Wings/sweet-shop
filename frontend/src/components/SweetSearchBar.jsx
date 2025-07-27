import React, { useState } from 'react';
import { Search, Tag, DollarSign, ListFilter } from 'lucide-react';

const SweetSearchBar = ({ onSearch, categories }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({
      name: name.trim() || undefined,
      category: category || undefined,
      minPrice: minPrice !== '' ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice !== '' ? parseFloat(maxPrice) : undefined,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap gap-4 items-end mb-6 bg-white/5 rounded-2xl p-4 shadow-inner backdrop-blur-md"
    >
      <div className="flex flex-col flex-1 min-w-[160px]">
        <label className="text-pink-400 text-xs font-semibold mb-1 flex items-center gap-1">
          <Search size={16} className="inline-block" /> Name
        </label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="px-4 py-2 rounded-xl border border-pink-200 bg-white/20 text-white placeholder-pink-200 focus:outline-none focus:border-pink-500 focus:bg-white/30 transition"
          placeholder="Search by name"
        />
      </div>
      <div className="flex flex-col flex-1 min-w-[140px]">
        <label className="text-pink-400 text-xs font-semibold mb-1 flex items-center gap-1">
          <ListFilter size={16} className="inline-block" /> Category
        </label>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="px-4 py-2 rounded-xl border border-pink-200 bg-white/20 text-gray-300 focus:outline-none focus:border-pink-500 focus:bg-white/30 transition"
        >
          <option value="" className='text-black'>All</option>
          {categories.map(cat => (
            <option key={cat} value={cat} className='text-black'>{cat}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col flex-1 min-w-[100px]">
        <label className="text-pink-400 text-xs font-semibold mb-1 flex items-center gap-1">
          <DollarSign size={16} className="inline-block" /> Min Price
        </label>
        <input
          type="number"
          min="0"
          value={minPrice}
          onChange={e => setMinPrice(e.target.value)}
          className="px-4 py-2 rounded-xl border border-pink-200 bg-white/20 text-white placeholder-pink-200 focus:outline-none focus:border-pink-500 focus:bg-white/30 transition"
          placeholder="0"
        />
      </div>
      <div className="flex flex-col flex-1 min-w-[100px]">
        <label className="text-pink-400 text-xs font-semibold mb-1 flex items-center gap-1">
          <DollarSign size={16} className="inline-block" /> Max Price
        </label>
        <input
          type="number"
          min="0"
          value={maxPrice}
          onChange={e => setMaxPrice(e.target.value)}
          className="px-4 py-2 rounded-xl border border-pink-200 bg-white/20 text-white placeholder-pink-200 focus:outline-none focus:border-pink-500 focus:bg-white/30 transition"
          placeholder="100"
        />
      </div>
      <button
        type="submit"
        className="px-8 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-bold shadow hover:from-pink-600 hover:to-purple-600 transition-all flex items-center gap-2 mt-6"
      >
        <Tag size={18} /> Search
      </button>
    </form>
  );
};

export default SweetSearchBar;
