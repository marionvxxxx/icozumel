import React from 'react';
import { Bell, MapPin, Crown, Sparkles, Zap } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { isMobile } from '../../utils/responsive';
import ResponsiveLayout from './ResponsiveLayout';

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
  const mobile = isMobile();

  return (
    <div className="glass-dark border-b border-white/10 sticky top-0 z-40 backdrop-blur-xl">
      <ResponsiveLayout className="px-4 py-3">
        <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 hero-gradient rounded-xl flex items-center justify-center shadow-glow floating">
              <Sparkles className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold gradient-text font-display">{title}</h1>
              {showLocation && mobile && (
                <div className="flex items-center text-xs text-white/60">
                  <MapPin size={12} className="mr-1" />
                  <span>Seaside Town, CA</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {user?.isPremium && (
            <div className="status-premium flex items-center space-x-1">
              <Crown size={12} />
              <span>Premium</span>
            </div>
          )}
          
          {showNotifications && (
            <button className="relative p-2 text-white/70 hover:text-white transition-all duration-300 hover:bg-white/10 rounded-lg">
              <Bell size={20} className="animate-bounce-subtle" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-400 to-pink-500 rounded-full animate-pulse shadow-glow"></div>
            </button>
          )}
          
          <button className="p-2 text-white/70 hover:text-white transition-all duration-300 hover:bg-white/10 rounded-lg">
            <Zap size={20} className="hover:animate-pulse" />
          </button>
        </div>
        </div>
      </ResponsiveLayout>
    </div>
  );
};

export default Header;