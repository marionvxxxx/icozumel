import React from 'react';
import { TrendingUp, Star, MapPin } from 'lucide-react';
import BusinessCard from '../components/Business/BusinessCard';
import PostCard from '../components/Feed/PostCard';
import NotificationBanner from '../components/Common/NotificationBanner';
import PointsDisplay from '../components/Gamification/PointsDisplay';
import AROverlay from '../components/Tourism/AROverlay';
import { mockBusinesses, mockPosts } from '../data/mockData';
import { useAuth } from '../hooks/useAuth';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const featuredBusinesses = mockBusinesses.filter(b => b.isFeatured);
  const recentPosts = mockPosts.slice(0, 3);

  const mockRecentEarnings = [
    { action: 'Reviewed Coastal Café', points: 10, timestamp: '2 hours ago' },
    { action: 'Checked in at Art Gallery', points: 5, timestamp: '1 day ago' },
    { action: 'Shared local event', points: 3, timestamp: '2 days ago' }
  ];
  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-500 to-secondary-600 text-white p-6 rounded-b-3xl">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-2">Discover Local Gems</h2>
          <p className="text-primary-100 mb-4">
            Find amazing businesses, events, and experiences in your area
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-center">
              <div className="text-2xl font-bold">1.2K</div>
              <div className="text-xs text-primary-100">Businesses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">450</div>
              <div className="text-xs text-primary-100">Events</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">8.5K</div>
              <div className="text-xs text-primary-100">Reviews</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 space-y-6 mt-6">
        {/* Welcome Banner for New Users */}
        {!user && (
          <NotificationBanner
            type="welcome"
            title="Welcome to LocalVibe!"
            message="Discover amazing local places and connect with your community"
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
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <Star className="mr-2 text-yellow-500" size={20} />
              Featured Places
            </h3>
            <button className="text-primary-600 text-sm font-medium">View All</button>
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
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <TrendingUp className="mr-2 text-green-500" size={20} />
              Community Feed
            </h3>
            <button className="text-primary-600 text-sm font-medium">See More</button>
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
          <section className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center space-x-2 bg-primary-50 text-primary-700 p-3 rounded-lg hover:bg-primary-100 transition-colors">
                <MapPin size={18} />
                <span className="text-sm font-medium">Find Nearby</span>
              </button>
              <button className="flex items-center justify-center space-x-2 bg-secondary-50 text-secondary-700 p-3 rounded-lg hover:bg-secondary-100 transition-colors">
                <Star size={18} />
                <span className="text-sm font-medium">Write Review</span>
              </button>
            </div>
          </section>
        )}

        {/* Promotional Banner */}
        <NotificationBanner
          type="promotion"
          title="Summer Festival This Weekend!"
          message="Join us for live music, food trucks, and local vendors"
          actionText="Get Tickets"
          onAction={() => console.log('Navigate to event')}
        />

        {/* Achievement Banner for Users */}
        {user && user.points > 100 && (
          <div className="animate-bounce">
            <NotificationBanner
              type="achievement"
              title="Level Up!"
              message="You've earned the Explorer badge! Keep discovering amazing places."
              actionText="View Badges"
              onAction={() => console.log('Navigate to profile')}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;