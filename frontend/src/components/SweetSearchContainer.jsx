import React, { useState, useRef } from 'react';
import SweetSearchBar from './SweetSearchBar';
import { sweetAPI } from '../services/api';

const SweetSearchContainer = ({ setSweets, categories }) => {
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // Debounce logic
  const debounceRef = useRef();

  const handleSearch = (params) => {
    // Trim string params
    const cleanedParams = { ...params };
    if (cleanedParams.name) cleanedParams.name = cleanedParams.name.trim();
    if (cleanedParams.category) cleanedParams.category = cleanedParams.category.trim();

    // Prevent searching if all fields are empty
    // const hasQuery = Object.values(cleanedParams).some(v => v && v !== '');
    // if (!hasQuery) {
    //   setSweets([]);
    //   setSearchError(null);
    //   return;
    // }

    setSearchLoading(true);
    setSearchError(null);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const result = await sweetAPI.search(cleanedParams);
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
    }, 400); // 400ms debounce
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
