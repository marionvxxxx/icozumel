import React, { useState } from 'react';
import { AuthContext } from './hooks/useAuth';
import { useAuthState } from './hooks/useAuth';
import Header from './components/Layout/Header';
import BottomNavigation from './components/Layout/BottomNavigation';
import AuthModal from './components/Auth/AuthModal';
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
          <button
            onClick={() => setShowAuthModal(true)}
            className="fixed bottom-24 right-4 w-14 h-14 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-40"
          >
            <span className="text-2xl">+</span>
          </button>
        )}

        {/* Welcome Banner for New Users */}
        {!authState.user && !authState.loading && (
          <div className="fixed bottom-24 left-4 right-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-4 rounded-xl shadow-lg z-40">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">Welcome to LocalVibe!</h3>
                <p className="text-sm text-primary-100">Sign up to discover amazing local places</p>
              </div>
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-primary-50 transition-colors"
              >
                Join Now
              </button>
            </div>
          </div>
        )}
      </div>
    </AuthContext.Provider>
  );
}

export default App;