import React, { useState } from 'react';
import { Search, X, MapPin, Clock } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  showRecentSearches?: boolean;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = "Search businesses, events...", 
  onSearch, 
  showRecentSearches = true,
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches] = useState(['Coffee shops', 'Italian restaurants', 'Art galleries', 'Live music']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleRecentSearch = (search: string) => {
    setQuery(search);
    onSearch(search);
    setIsFocused(false);
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <Search size={20} className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="input-field pl-10 pr-10"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        )}
      </form>

      {/* Recent Searches Dropdown */}
      {isFocused && showRecentSearches && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50">
          <div className="p-3 border-b border-gray-100">
            <h4 className="text-sm font-medium text-gray-900">Recent Searches</h4>
          </div>
          <div className="py-2">
            {recentSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => handleRecentSearch(search)}
                className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
              >
                <Clock size={14} className="text-gray-400" />
                <span className="text-sm text-gray-700">{search}</span>
              </button>
            ))}
          </div>
          <div className="p-3 border-t border-gray-100">
            <button className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-700">
              <MapPin size={14} />
              <span>Search near me</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;