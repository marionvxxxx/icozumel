import React, { useState } from 'react';
import { X, Bell, Gift, Star } from 'lucide-react';

interface NotificationBannerProps {
  type: 'welcome' | 'promotion' | 'achievement' | 'update';
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
  onDismiss?: () => void;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({
  type,
  title,
  message,
  actionText,
  onAction,
  onDismiss
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'welcome':
        return 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white';
      case 'promotion':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'achievement':
        return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
      case 'update':
        return 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white';
      default:
        return 'bg-gray-100 text-gray-900';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'welcome':
        return <Bell size={20} />;
      case 'promotion':
        return <Gift size={20} />;
      case 'achievement':
        return <Star size={20} />;
      case 'update':
        return <Bell size={20} />;
      default:
        return <Bell size={20} />;
    }
  };

  return (
    <div className={`rounded-xl p-4 mb-4 ${getTypeStyles()}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold mb-1">{title}</h3>
          <p className="text-sm opacity-90">{message}</p>
          {actionText && onAction && (
            <button
              onClick={onAction}
              className="mt-2 bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
            >
              {actionText}
            </button>
          )}
        </div>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default NotificationBanner;