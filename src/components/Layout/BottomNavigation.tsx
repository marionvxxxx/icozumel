import React from 'react';
import { Home, Search, Calendar, User, Building2 } from 'lucide-react';
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
      bg-white border-t border-gray-200 px-4 py-2 z-50
    `}>
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center py-2 px-2 rounded-lg transition-colors duration-200 ${
                isActive
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={mobile ? 20 : 24} className="mb-1" />
              <span className={`${mobile ? 'text-xs' : 'text-sm'} font-medium`}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;