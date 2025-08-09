import React, { useState } from 'react';
import { AuthContext } from './hooks/useAuth';
import { useAuthState } from './hooks/useAuth';
import { useNativeFeatures } from './hooks/useNativeFeatures';
import { isDesktop, isMobile } from './utils/responsive';
import Header from './components/Layout/Header';
import BottomNavigation from './components/Layout/BottomNavigation';
import Sidebar from './components/Layout/Sidebar';
import ResponsiveLayout from './components/Layout/ResponsiveLayout';
import AuthModal from './components/Auth/AuthModal';
import FloatingActionButton from './components/Common/FloatingActionButton';
import HomePage from './pages/HomePage';
import DiscoverPage from './pages/DiscoverPage';
import EventsPage from './pages/EventsPage';
import BusinessPage from './pages/BusinessPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const authState = useAuthState();
  const { platform, isOnline, installPrompt, installApp } = useNativeFeatures();
  const desktop = isDesktop();
  const mobile = isMobile();

  const getPageTitle = () => {
    switch (activeTab) {
      case 'home': return 'LocalVibe';
      case 'discover': return 'Discover';
      case 'events': return 'Events';
      case 'business': return 'Business';
      case 'profile': return 'Profile';
      default: return 'LocalVibe';
    }
  };

  const renderCurrentPage = () => {
    switch (activeTab) {
      case 'home': return <HomePage />;
      case 'discover': return <DiscoverPage />;
      case 'events': return <EventsPage />;
      case 'business': return <BusinessPage />;
      case 'profile': return <ProfilePage />;
      default: return <HomePage />;
    }
  };

  // Show auth modal if user tries to access profile without being logged in
  React.useEffect(() => {
    if (activeTab === 'profile' && !authState.user && !authState.loading) {
      setShowAuthModal(true);
      setActiveTab('home');
    }
  }, [activeTab, authState.user, authState.loading]);

  return (
    <AuthContext.Provider value={authState}>
      <div className={`min-h-screen bg-gray-50 ${desktop ? 'pl-64' : ''}`}>
        {/* Desktop Sidebar */}
        {desktop && (
          <Sidebar 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />
        )}

        {/* Mobile/Tablet Header */}
        {!desktop && (
          <Header 
            title={getPageTitle()}
            showLocation={activeTab === 'home' || activeTab === 'discover'}
            showNotifications={!!authState.user}
          />
        )}

        {/* PWA Install Banner */}
        {installPrompt && mobile && (
          <div className="bg-primary-600 text-white p-3 text-center">
            <p className="text-sm mb-2">Install LocalVibe for the best experience!</p>
            <button
              onClick={installApp}
              className="bg-white text-primary-600 px-4 py-1 rounded text-sm font-medium"
            >
              Install App
            </button>
          </div>
        )}

        {/* Offline Banner */}
        {!isOnline && (
          <div className="bg-red-600 text-white p-2 text-center">
            <p className="text-sm">You're offline. Some features may not work.</p>
          </div>
        )}

        <main className={`relative ${desktop ? 'min-h-screen' : mobile ? 'pb-20' : 'pb-4'}`}>
          {desktop ? (
            <div className="p-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">{getPageTitle()}</h1>
                <p className="text-gray-600 mt-1">
                  {activeTab === 'home' && 'Discover amazing local places and connect with your community'}
                  {activeTab === 'discover' && 'Find businesses, services, and hidden gems near you'}
                  {activeTab === 'events' && 'Explore events and activities happening around you'}
                  {activeTab === 'business' && 'Manage your business presence and advertising'}
                  {activeTab === 'profile' && 'Your profile, achievements, and settings'}
                </p>
              </div>
              {renderCurrentPage()}
            </div>
          ) : (
            renderCurrentPage()
          )}
        </main>

        {/* Mobile Bottom Navigation */}
        <BottomNavigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />

        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />

        {/* Mobile Floating Action Button */}
        {authState.user && mobile && (
          <FloatingActionButton
            onAction={(action) => {
              console.log('FAB action:', action);
              // Handle different actions
              switch (action) {
                case 'review':
                  // Open review modal
                  break;
                case 'photo':
                  // Open camera/photo upload
                  break;
                case 'checkin':
                  // Open check-in modal
                  break;
                case 'event':
                  // Navigate to create event
                  break;
              }
            }}
          />
        )}
      </div>
    </AuthContext.Provider>
  );
}

export default App;
          title={getPageTitle()}
          showLocation={activeTab === 'home' || activeTab === 'discover'}
          showNotifications={!!authState.user}
        />
        
        <main className="relative">
          {renderCurrentPage()}
        </main>

        <BottomNavigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />

        {/* Floating Action Button for Quick Actions */}
        {authState.user && (
          <FloatingActionButton
            onAction={(action) => {
              console.log('FAB action:', action);
              // Handle different actions
              switch (action) {
                case 'review':
                  // Open review modal
                  break;
                case 'photo':
                  // Open camera/photo upload
                  break;
                case 'checkin':
                  // Open check-in modal
                  break;
                case 'event':
                  // Navigate to create event
                  break;
              }
            }}
          />
        )}

        {/* Welcome Banner for New Users */}
      </div>
    </AuthContext.Provider>
  );
}

export default App;