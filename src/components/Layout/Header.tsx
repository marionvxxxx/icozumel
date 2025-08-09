import React from 'react';
import { Bell, MapPin, Crown } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
  title: string;
  showLocation?: boolean;
  showNotifications?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  showLocation = true, 
  showNotifications = true 
}) => {
  const { user } = useAuth();

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LV</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">{title}</h1>
              {showLocation && (
                <div className="flex items-center text-xs text-gray-500">
                  <MapPin size={12} className="mr-1" />
                  <span>Seaside Town, CA</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {user?.isPremium && (
            <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full">
              <Crown size={12} />
              <span className="text-xs font-medium">Premium</span>
            </div>
          )}
          
          {showNotifications && (
            <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
              <Bell size={20} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;