import React, { useState } from 'react';
import { Plus, BarChart3, Settings, Crown, TrendingUp } from 'lucide-react';
import ResponsiveLayout from '../components/Layout/ResponsiveLayout';
import { isMobile } from '../utils/responsive';

const BusinessPage: React.FC = () => {
  const mobile = isMobile();
  const [activeTab, setActiveTab] = useState('dashboard');

  const adTypes = [
    {
      type: 'Featured Listing',
      price: '$9.99/month',
      description: 'Top placement in search results and feeds',
      features: ['Highlighted badge', 'Priority in recommendations', 'Enhanced visibility']
    },
    {
      type: 'Boosted Posts',
      price: '$0.50-$2.00 per 1,000 views',
      description: 'Promote specific offers or events in user feeds',
      features: ['Targeted by location', 'Demographics targeting', 'Custom scheduling']
    },
    {
      type: 'Sponsored Events',
      price: '$19.99/event',
      description: 'Highlight community events with business branding',
      features: ['Push notifications', 'Featured placement', 'Event analytics']
    },
    {
      type: 'Touristic Spotlight',
      price: '$29.99/month',
      description: 'AR-enhanced tours featuring your business',
      features: ['AR integration', 'Interactive maps', 'Gamified check-ins']
    }
  ];

  return (
    <div className={`${mobile ? 'pb-20' : ''} min-h-screen`}>
      <ResponsiveLayout className={`${mobile ? 'px-4' : 'px-0'} py-4 space-y-4`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-6">
          <h1 className="text-2xl font-bold mb-2">Business Hub</h1>
          <p className="text-blue-100">Grow your business with LocalVibe</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="card">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="text-green-500" size={20} />
              <span className="text-sm font-medium text-white/70">Views</span>
            </div>
            <div className="text-2xl font-bold text-white">1,247</div>
            <div className="text-sm text-green-600">+12% this week</div>
          </div>
          
          <div className="card">
            <div className="flex items-center space-x-2 mb-2">
              <BarChart3 className="text-blue-500" size={20} />
              <span className="text-sm font-medium text-white/70">Clicks</span>
            </div>
            <div className="text-2xl font-bold text-white">89</div>
            <div className="text-sm text-blue-600">+8% this week</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="card overflow-hidden">
          <div className="flex">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'advertising', label: 'Advertising' },
              { id: 'settings', label: 'Settings' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-600'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            <div className="card">
              <h3 className="font-semibold text-white mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center space-x-2 glass text-white p-3 rounded-lg hover:bg-white/20 transition-colors">
                  <Plus size={18} />
                  <span className="text-sm font-medium">Add Photos</span>
                </button>
                <button className="flex items-center justify-center space-x-2 glass text-white p-3 rounded-lg hover:bg-white/20 transition-colors">
                  <Settings size={18} />
                  <span className="text-sm font-medium">Update Info</span>
                </button>
              </div>
            </div>

            <div className="card">
              <h3 className="font-semibold text-white mb-3">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm text-white">New review from Sarah Chen</div>
                    <div className="text-xs text-white/60">2 hours ago</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm text-white">Profile viewed 15 times</div>
                    <div className="text-xs text-white/60">Today</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm text-white">Featured listing activated</div>
                    <div className="text-xs text-white/60">Yesterday</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Advertising Tab */}
        {activeTab === 'advertising' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Crown size={20} />
                <span className="font-semibold">Boost Your Visibility</span>
              </div>
              <p className="text-yellow-100 text-sm">
                Reach more customers with our advertising options
              </p>
            </div>

            {adTypes.map((ad, index) => (
              <div key={index} className="card">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-white">{ad.type}</h3>
                  <span className="text-primary-600 font-bold">{ad.price}</span>
                </div>
                <p className="text-white/70 text-sm mb-3">{ad.description}</p>
                <div className="space-y-1 mb-4">
                  {ad.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-white/70">{feature}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full btn-primary">Get Started</button>
              </div>
            ))}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            <div className="card">
              <h3 className="font-semibold text-white mb-3">Business Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">Business Name</label>
                  <input type="text" className="input-field" defaultValue="Coastal Café" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">Description</label>
                  <textarea className="input-field h-20" defaultValue="Artisan coffee and fresh pastries with ocean views." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">Phone</label>
                  <input type="tel" className="input-field" defaultValue="+1 (555) 123-4567" />
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="font-semibold text-white mb-3">Hours of Operation</h3>
              <div className="space-y-2">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                  <div key={day} className="flex items-center space-x-3">
                    <div className="w-20 text-sm text-white/70">{day}</div>
                    <input type="time" className="input-field flex-1" defaultValue="07:00" />
                    <span className="text-white/60">to</span>
                    <input type="time" className="input-field flex-1" defaultValue="18:00" />
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full btn-primary">Save Changes</button>
          </div>
        )}
      </ResponsiveLayout>
    </div>
  );
};

export default BusinessPage;