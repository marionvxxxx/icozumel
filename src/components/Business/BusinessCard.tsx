import React from 'react';
import { Star, MapPin, Clock, Verified, Crown, Sparkles, Zap } from 'lucide-react';
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
            ? 'text-yellow-400 fill-current animate-pulse'
            : i < rating
            ? 'text-yellow-400 fill-current opacity-50 animate-pulse'
            : 'text-white/30'
        }`}
      />
    ));
  };

  if (compact) {
    return (
      <div 
        className="card p-3 cursor-pointer glow-on-hover animate-slide-up"
        onClick={onClick}
      >
        <div className="flex space-x-3">
          <img
            src={business.images[0]}
            alt={business.name}
            className="w-16 h-16 rounded-xl object-cover border border-white/20 shadow-lg"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-white truncate">{business.name}</h3>
              {business.isVerified && <Verified size={14} className="text-primary-400 animate-pulse" />}
              {business.isFeatured && <Crown size={14} className="text-yellow-400 animate-bounce-subtle" />}
            </div>
            <p className="text-sm text-white/60 mb-2">{business.category}</p>
            <div className="flex items-center space-x-1">
              {renderStars(business.rating)}
              <span className="text-sm text-white/60 ml-1">
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
      className="card overflow-hidden cursor-pointer animate-fade-in group"
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={business.images[0]}
          alt={business.name}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        {business.isFeatured && (
          <div className="absolute top-3 left-3 status-premium flex items-center space-x-1">
            <Crown size={12} className="animate-bounce-subtle" />
            <span className="text-xs font-bold">Featured</span>
          </div>
        )}
        <div className="absolute top-3 right-3 glass rounded-full p-2">
          <Sparkles size={16} className="text-white animate-pulse" />
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-white font-display">{business.name}</h3>
            {business.isVerified && <Verified size={16} className="text-primary-400 animate-pulse" />}
          </div>
          <span className="text-sm text-white/60 bg-white/10 px-2 py-1 rounded-full">
            {business.category}
          </span>
        </div>
        
        <p className="text-white/70 text-sm mb-3 line-clamp-2">{business.description}</p>
        
        <div className="flex items-center space-x-1 mb-2">
          {renderStars(business.rating)}
          <span className="text-sm text-white/60 ml-1">
            {business.rating} ({business.reviewCount} reviews)
          </span>
        </div>
        
        <div className="flex items-center text-sm text-white/60 mb-2">
          <MapPin size={14} className="mr-1 text-primary-400" />
          <span className="truncate">{business.address}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-white/60">
            <Clock size={14} className="mr-1 text-green-400" />
            <span>Open until 6:00 PM</span>
          </div>
          <button className="btn-ghost text-xs px-3 py-1 flex items-center space-x-1">
            <Zap size={12} />
            <span>Quick View</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;