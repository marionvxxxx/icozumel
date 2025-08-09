import React, { useState } from 'react';
import { Search, Filter, MapPin, Grid, List } from 'lucide-react';
import BusinessCard from '../components/Business/BusinessCard';
import { mockBusinesses } from '../data/mockData';

const DiscoverPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['All', 'Restaurant', 'Retail', 'Arts & Culture', 'Entertainment', 'Services'];

  const filteredBusinesses = mockBusinesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         business.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || business.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search size={20} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search businesses, services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10 pr-12"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            <Filter size={20} />
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Filters</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'}`}
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'}`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Distance</label>
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
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex items-center space-x-3">
          <MapPin className="text-primary-600" size={20} />
          <div>
            <div className="font-medium text-gray-900">Seaside Town, CA</div>
            <div className="text-sm text-gray-500">Showing results within 5 miles</div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              {filteredBusinesses.length} Results
            </h2>
            <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
              <option>Sort by Relevance</option>
              <option>Sort by Rating</option>
              <option>Sort by Distance</option>
              <option>Sort by Reviews</option>
            </select>
          </div>

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

          {filteredBusinesses.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">
                <Search size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscoverPage;