import React from 'react';
import { TrendingUp, Star, MapPin, Sparkles, Zap, Rocket, Globe, Users } from 'lucide-react';
import ResponsiveLayout from '../components/Layout/ResponsiveLayout';
import BusinessCard from '../components/Business/BusinessCard';
import PostCard from '../components/Feed/PostCard';
import NotificationBanner from '../components/Common/NotificationBanner';
import PointsDisplay from '../components/Gamification/PointsDisplay';
import AROverlay from '../components/Tourism/AROverlay';
import { mockBusinesses, mockPosts } from '../data/mockData';
import { useAuth } from '../hooks/useAuth';
import { isMobile, isDesktop } from '../utils/responsive';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const mobile = isMobile();
  const desktop = isDesktop();
  const featuredBusinesses = mockBusinesses.filter(b => b.isFeatured);
  const recentPosts = mockPosts.slice(0, 3);

  const mockRecentEarnings = [
    { action: 'Reviewed Coastal Café', points: 10, timestamp: '2 hours ago' },
    { action: 'Checked in at Art Gallery', points: 5, timestamp: '1 day ago' },
    { action: 'Shared local event', points: 3, timestamp: '2 days ago' }
  ];
  
  return (
    <div className={`${mobile ? 'pb-20' : ''} min-h-screen relative overflow-hidden`}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>
      
      {/* Hero Section */}
      <div className={`hero-gradient text-white relative overflow-hidden ${mobile ? 'p-6 rounded-b-3xl' : 'p-8 rounded-xl mb-6'}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"></div>
        <div className="absolute top-4 right-4">
          <Sparkles className="text-white/30 animate-pulse floating" size={24} />
        </div>
        <div className="absolute bottom-4 left-4">
          <Zap className="text-white/20 animate-bounce-subtle" size={20} />
        </div>
        
        <ResponsiveLayout>
          <div className="relative z-10">
            <div className="flex items-center space-x-2 mb-2">
              <Rocket className="text-white animate-bounce-subtle" size={28} />
              <h2 className="text-3xl font-bold font-display bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Discover Local Gems
              </h2>
            </div>
            <p className="text-white/80 mb-6 text-lg">
              Find amazing businesses, events, and experiences in your area ✨
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 glass rounded-2xl p-4 relative z-10">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Globe className="text-primary-300 animate-pulse" size={20} />
              </div>
              <div className="text-2xl font-bold gradient-text">1.2K</div>
              <div className="text-xs text-white/70">Businesses</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Star className="text-yellow-400 animate-pulse" size={20} />
              </div>
              <div className="text-2xl font-bold gradient-text">450</div>
              <div className="text-xs text-white/70">Events</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Users className="text-secondary-300 animate-pulse" size={20} />
              </div>
              <div className="text-2xl font-bold gradient-text">8.5K</div>
              <div className="text-xs text-white/70">Reviews</div>
            </div>
          </div>
        </ResponsiveLayout>
      </div>

      <ResponsiveLayout className={`${mobile ? 'px-4' : 'px-0'} space-y-6 ${mobile ? 'mt-6' : 'mt-0'}`}>
        {/* Welcome Banner for New Users */}
        {!user && (
          <NotificationBanner
            type="welcome"
            title="🎉 Welcome to LocalVibe!"
            message="Discover amazing local places and connect with your community. Join thousands of explorers!"
            actionText="Sign Up Now"
            onAction={() => console.log('Open auth modal')}
          />
        )}

        {/* Points Display for Logged In Users */}
        {user && (
          <PointsDisplay
            points={user.points}
            level={Math.floor(user.points / 50) + 1}
            nextLevelPoints={(Math.floor(user.points / 50) + 1) * 50}
            recentEarnings={mockRecentEarnings}
          />
        )}

        {/* AR Discovery */}
        <AROverlay />

        {/* Featured Businesses */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white flex items-center font-display">
              <Star className="mr-2 text-yellow-400 animate-pulse" size={24} />
              Featured Places
            </h3>
            <button className="btn-ghost text-sm flex items-center space-x-1">
              <span>View All</span>
              <Zap size={14} className="animate-pulse" />
            </button>
          </div>
          
          <div className="space-y-3">
            {featuredBusinesses.map((business) => (
              <BusinessCard
                key={business.id}
                business={business}
                compact
                onClick={() => console.log('Navigate to business:', business.id)}
              />
            ))}
          </div>
        </section>

        {/* Trending Posts */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white flex items-center font-display">
              <TrendingUp className="mr-2 text-green-400 animate-bounce-subtle" size={24} />
              Community Feed
            </h3>
            <button className="btn-ghost text-sm flex items-center space-x-1">
              <span>See More</span>
              <Sparkles size={14} className="animate-pulse" />
            </button>
          </div>
          
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={() => console.log('Like post:', post.id)}
                onComment={() => console.log('Comment on post:', post.id)}
                onShare={() => console.log('Share post:', post.id)}
              />
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        {user && (
          <section className="card-premium">
            <h3 className="font-semibold text-white mb-3 font-display flex items-center">
              <Zap className="mr-2 text-primary-400 animate-pulse" size={20} />
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center space-x-2 glass hover:bg-white/20 text-white p-3 rounded-xl transition-all duration-300 hover:scale-105 border border-primary-500/30">
                <MapPin size={18} className="text-primary-400" />
                <span className="text-sm font-medium">Find Nearby</span>
              </button>
              <button className="flex items-center justify-center space-x-2 glass hover:bg-white/20 text-white p-3 rounded-xl transition-all duration-300 hover:scale-105 border border-secondary-500/30">
                <Star size={18} className="text-secondary-400" />
                <span className="text-sm font-medium">Write Review</span>
              </button>
            </div>
          </section>
        )}

        {/* Promotional Banner */}
        <NotificationBanner
          type="promotion"
          title="🎵 Summer Festival This Weekend!"
          message="Join us for live music, food trucks, and local vendors. Don't miss out!"
          actionText="Get Tickets"
          onAction={() => console.log('Navigate to event')}
        />

        {/* Achievement Banner for Users */}
        {user && user.points > 100 && (
          <div className="animate-bounce">
            <NotificationBanner
              type="achievement"
              title="🏆 Level Up!"
              message="You've earned the Explorer badge! Keep discovering amazing places and earn more rewards."
              actionText="View Badges"
              onAction={() => console.log('Navigate to profile')}
            />
          </div>
        )}
      </ResponsiveLayout>
    </div>
  );
};

export default HomePage;