import React, { useState } from 'react';
import './SearchInput.css';

interface SearchInputProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  onSearch,
  placeholder = 'Поиск чатов...'
}) => {
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="search-container">
      <svg
        className="search-icon"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
          clipRule="evenodd"
        />
      </svg>

      <input
        type="text"
        className="search-input"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
      />

      {query && (
        <button
          className="search-clear"
          onClick={handleClear}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
};