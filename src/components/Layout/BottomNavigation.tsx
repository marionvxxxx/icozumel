import React from 'react';
import { Home, Search, Calendar, User, Building2, Sparkles } from 'lucide-react';
import { isMobile } from '../../utils/responsive';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  const mobile = isMobile();
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'discover', label: 'Discover', icon: Search },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'business', label: 'Business', icon: Building2 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className={`
      ${mobile ? 'fixed bottom-0 left-0 right-0' : 'hidden'} 
      glass-dark border-t border-white/10 px-4 py-2 z-50 backdrop-blur-xl
    `}>
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`nav-item ${
                isActive
                  ? 'active text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Icon size={mobile ? 20 : 24} className={`mb-1 ${isActive ? 'animate-bounce-subtle' : ''}`} />
              <span className={`${mobile ? 'text-xs' : 'text-sm'} font-medium`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
                  <Sparkles size={8} className="text-primary-400 animate-pulse" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;