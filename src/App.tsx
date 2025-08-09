import React, { useState } from 'react';
import { AuthContext } from './hooks/useAuth';
import { useAuthState } from './hooks/useAuth';
import Header from './components/Layout/Header';
import BottomNavigation from './components/Layout/BottomNavigation';
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
      <div className="min-h-screen bg-gray-50">
        <Header 
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