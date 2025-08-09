import React, { useState } from 'react';
import { Settings, Crown, Star, MapPin, Award, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import PointsDisplay from '../components/Gamification/PointsDisplay';
import ReviewForm from '../components/Reviews/ReviewForm';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showReviewForm, setShowReviewForm] = useState(false);

  const mockRecentEarnings = [
    { action: 'Reviewed Coastal Café', points: 10, timestamp: '2 hours ago' },
    { action: 'Checked in at Art Gallery', points: 5, timestamp: '1 day ago' },
    { action: 'Shared local event', points: 3, timestamp: '2 days ago' },
    { action: 'Completed profile', points: 25, timestamp: '1 week ago' }
  ];
  if (!user) {
    return (
      <div className="pb-20 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Please sign in</h2>
          <p className="text-gray-600">Sign in to view your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-primary-500 to-secondary-600 text-white rounded-xl p-6">
          <div className="flex items-center space-x-4 mb-4">
            <img
              src={user.avatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200'}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
            />
            <div className="flex-1">
              <h1 className="text-xl font-bold">{user.name}</h1>
              <p className="text-primary-100">{user.email}</p>
              {user.isPremium && (
                <div className="flex items-center space-x-1 mt-1">
                  <Crown size={14} />
                  <span className="text-sm">Premium Member</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <div className="text-center">
              <div className="text-lg font-bold">{user.points}</div>
              <div className="text-xs text-primary-100">Points</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">12</div>
              <div className="text-xs text-primary-100">Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">5</div>
              <div className="text-xs text-primary-100">Check-ins</div>
            </div>
          </div>
        </div>

        <PointsDisplay
          points={user.points}
          level={Math.floor(user.points / 50) + 1}
          nextLevelPoints={(Math.floor(user.points / 50) + 1) * 50}
          recentEarnings={mockRecentEarnings}
        />

        {/* Badges */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Award className="mr-2 text-yellow-500" size={20} />
            Your Badges
          </h3>
          <div className="flex flex-wrap gap-2">
            {user.badges.map((badge, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium"
              >
                {badge}
              </div>
            ))}
          </div>
        </div>

        {/* Premium Upgrade */}
        {!user.isPremium && (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Crown size={20} />
              <span className="font-semibold">Upgrade to Premium</span>
            </div>
            <p className="text-purple-100 text-sm mb-3">
              Get ad-free experience, exclusive content, and priority support
            </p>
            <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors">
              Upgrade for $4.99/month
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex">
            {[
              { id: 'profile', label: 'Profile' },
              { id: 'activity', label: 'Activity' },
              { id: 'settings', label: 'Settings' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Recent Reviews</h3>
              <div className="space-y-3">
                <div className="border-l-4 border-primary-500 pl-3">
                  <div className="flex items-center space-x-1 mb-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} size={12} className="text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-900 mb-1">Amazing coffee and atmosphere!</p>
                  <p className="text-xs text-gray-500">Coastal Café • 2 days ago</p>
                </div>
                <div className="border-l-4 border-secondary-500 pl-3">
                  <div className="flex items-center space-x-1 mb-1">
                    {Array.from({ length: 4 }, (_, i) => (
                      <Star key={i} size={12} className="text-yellow-400 fill-current" />
                    ))}
                    <Star size={12} className="text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-900 mb-1">Great selection of outdoor gear!</p>
                  <p className="text-xs text-gray-500">Adventure Gear Co. • 1 week ago</p>
                </div>
              </div>
              <button
                onClick={() => setShowReviewForm(true)}
                className="w-full mt-3 btn-primary"
              >
                Write New Review
              </button>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Your Impact</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">12</div>
                  <div className="text-sm text-gray-600">Reviews Written</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary-600">847</div>
                  <div className="text-sm text-gray-600">People Helped</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Star size={14} className="text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-900">Left a review for Coastal Café</div>
                    <div className="text-xs text-gray-500">2 days ago</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <MapPin size={14} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-900">Checked in at Adventure Gear Co.</div>
                    <div className="text-xs text-gray-500">1 week ago</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Account Settings</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" className="input-field" defaultValue={user.name} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" className="input-field" defaultValue={user.email} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Notifications</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-900">Push Notifications</span>
                  <input type="checkbox" className="rounded" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-900">Email Updates</span>
                  <input type="checkbox" className="rounded" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-900">Event Reminders</span>
                  <input type="checkbox" className="rounded" />
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              className="w-full flex items-center justify-center space-x-2 bg-red-50 text-red-600 py-3 px-4 rounded-lg hover:bg-red-100 transition-colors"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        )}

        {/* Review Form Modal */}
        {showReviewForm && (
          <ReviewForm
            businessId="1"
            businessName="Coastal Café"
            onSubmit={(review) => {
              console.log('Review submitted:', review);
              setShowReviewForm(false);
            }}
            onCancel={() => setShowReviewForm(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;