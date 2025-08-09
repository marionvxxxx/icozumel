import React, { useState } from 'react';
import { Search, Filter, MapPin, Grid, List } from 'lucide-react';
import ResponsiveLayout from '../components/Layout/ResponsiveLayout';
import BusinessCard from '../components/Business/BusinessCard';
import SearchBar from '../components/Common/SearchBar';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { mockBusinesses } from '../data/mockData';
import { isMobile } from '../utils/responsive';

const DiscoverPage: React.FC = () => {
  const mobile = isMobile();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const categories = ['All', 'Restaurant', 'Retail', 'Arts & Culture', 'Entertainment', 'Services'];

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => setIsLoading(false), 1000);
  };

  const filteredBusinesses = mockBusinesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         business.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || business.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={`${mobile ? 'pb-20' : ''} min-h-screen`}>
      <ResponsiveLayout className={`${mobile ? 'px-4' : 'px-0'} py-4 space-y-4`}>
        {/* Search Bar */}
        <SearchBar
          placeholder="Search businesses, services..."
          onSearch={handleSearch}
          showRecentSearches={true}
        />

        {/* Filter Toggle */}
        <div className="flex justify-end">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-3 py-2 glass border border-white/20 rounded-lg hover:bg-white/20 transition-colors text-white"
          >
            <Filter size={16} />
            <span className="text-sm font-medium">Filters</span>
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white">Filters</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-500/20 text-primary-400' : 'text-white/60'}`}
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-500/20 text-primary-400' : 'text-white/60'}`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Category</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? 'bg-primary-600 text-white'
                          : 'glass text-white/80 hover:bg-white/20'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Distance</label>
                <select className="input-field">
                  <option>Within 1 mile</option>
                  <option>Within 5 miles</option>
                  <option>Within 10 miles</option>
                  <option>Any distance</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Location Banner */}
        <div className="card flex items-center space-x-3">
          <MapPin className="text-primary-600" size={20} />
          <div>
            <div className="font-medium text-white">Seaside Town, CA</div>
            <div className="text-sm text-white/60">Showing results within 5 miles</div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">
                {isLoading ? 'Searching...' : `${filteredBusinesses.length} Results`}
              </h2>
              {searchQuery && (
                <p className="text-sm text-white/70">for "{searchQuery}"</p>
              )}
            </div>
            <select className="text-sm glass border border-white/20 rounded-lg px-3 py-1 text-white">
              <option>Sort by Relevance</option>
              <option>Sort by Rating</option>
              <option>Sort by Distance</option>
              <option>Sort by Reviews</option>
            </select>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'space-y-4' : 'space-y-3'}>
              {filteredBusinesses.map((business) => (
                <BusinessCard
                  key={business.id}
                  business={business}
                  compact={viewMode === 'list'}
                  onClick={() => console.log('Navigate to business:', business.id)}
                />
              ))}
            </div>
          )}

          {filteredBusinesses.length === 0 && (
            <div className="text-center py-12">
              <div className="text-white/40 mb-2">
                <Search size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No results found</h3>
              <p className="text-white/60">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Quick Filters */}
        <div className="card">
          <h3 className="font-semibold text-white mb-3">Popular Searches</h3>
          <div className="flex flex-wrap gap-2">
            {['Coffee shops', 'Italian food', 'Art galleries', 'Live music', 'Shopping'].map((term) => (
              <button
                key={term}
                onClick={() => handleSearch(term)}
                className="px-3 py-1 glass text-white/80 rounded-full text-sm hover:bg-white/20 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </ResponsiveLayout>
    </div>
  );
};

export default DiscoverPage;