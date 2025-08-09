import React, { useState } from 'react';
import { Plus, Camera, Edit, MapPin, Calendar } from 'lucide-react';

interface FloatingActionButtonProps {
  onAction: (action: string) => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onAction }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const actions = [
    { id: 'review', icon: Edit, label: 'Write Review', color: 'bg-blue-500' },
    { id: 'photo', icon: Camera, label: 'Add Photo', color: 'bg-green-500' },
    { id: 'checkin', icon: MapPin, label: 'Check In', color: 'bg-purple-500' },
    { id: 'event', icon: Calendar, label: 'Create Event', color: 'bg-orange-500' },
  ];

  const handleMainClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleActionClick = (actionId: string) => {
    onAction(actionId);
    setIsExpanded(false);
  };

  return (
    <div className="fixed bottom-24 right-4 z-40">
      {/* Action Buttons */}
      {isExpanded && (
        <div className="absolute bottom-16 right-0 space-y-3 animate-in slide-in-from-bottom-2 duration-200">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <div
                key={action.id}
                className="flex items-center space-x-3"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="bg-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium text-gray-700 whitespace-nowrap">
                  {action.label}
                </div>
                <button
                  onClick={() => handleActionClick(action.id)}
                  className={`w-12 h-12 ${action.color} text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center`}
                >
                  <Icon size={20} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Main FAB */}
      <button
        onClick={handleMainClick}
        className={`w-14 h-14 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center ${
          isExpanded ? 'rotate-45' : ''
        }`}
      >
        <Plus size={24} />
      </button>

      {/* Backdrop */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 -z-10"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
};

export default FloatingActionButton;