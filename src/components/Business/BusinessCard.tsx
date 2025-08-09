import React from 'react';
import { Star, MapPin, Clock, Verified, Crown } from 'lucide-react';
import { Business } from '../../types';

interface BusinessCardProps {
  business: Business;
  onClick?: () => void;
  compact?: boolean;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business, onClick, compact = false }) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        className={`${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : i < rating
            ? 'text-yellow-400 fill-current opacity-50'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (compact) {
    return (
      <div 
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 cursor-pointer hover:shadow-md transition-shadow"
        onClick={onClick}
      >
        <div className="flex space-x-3">
          <img
            src={business.images[0]}
            alt={business.name}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-gray-900 truncate">{business.name}</h3>
              {business.isVerified && <Verified size={14} className="text-blue-500" />}
              {business.isFeatured && <Crown size={14} className="text-yellow-500" />}
            </div>
            <p className="text-sm text-gray-600 mb-2">{business.category}</p>
            <div className="flex items-center space-x-1">
              {renderStars(business.rating)}
              <span className="text-sm text-gray-600 ml-1">
                {business.rating} ({business.reviewCount})
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={business.images[0]}
          alt={business.name}
          className="w-full h-48 object-cover"
        />
        {business.isFeatured && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full flex items-center space-x-1">
            <Crown size={12} />
            <span className="text-xs font-medium">Featured</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-gray-900">{business.name}</h3>
            {business.isVerified && <Verified size={16} className="text-blue-500" />}
          </div>
          <span className="text-sm text-gray-500">{business.category}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{business.description}</p>
        
        <div className="flex items-center space-x-1 mb-2">
          {renderStars(business.rating)}
          <span className="text-sm text-gray-600 ml-1">
            {business.rating} ({business.reviewCount} reviews)
          </span>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <MapPin size={14} className="mr-1" />
          <span className="truncate">{business.address}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-500">
          <Clock size={14} className="mr-1" />
          <span>Open until 6:00 PM</span>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;