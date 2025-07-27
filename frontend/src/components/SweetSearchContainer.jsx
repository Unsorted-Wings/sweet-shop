import React, { useState } from 'react';
import SweetSearchBar from './SweetSearchBar';
import { sweetAPI } from '../services/api';

const SweetSearchContainer = ({ setSweets, categories }) => {
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const handleSearch = async (params) => {
    setSearchLoading(true);
    setSearchError(null);
    try {
      const result = await sweetAPI.search(params);
      if (result && result.sweets) {
        setSweets(result.sweets);
      } else {
        setSweets([]);
      }
    } catch (error) {
      setSearchError('Failed to search sweets.');
      setSweets([]);
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <SweetSearchBar onSearch={handleSearch} categories={categories} />
      {searchLoading && <div className="text-pink-400 mt-2">Searching...</div>}
      {searchError && <div className="text-red-400 mt-2">{searchError}</div>}
    </div>
  );
};

export default SweetSearchContainer;
