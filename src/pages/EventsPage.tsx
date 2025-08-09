import React, { useState } from 'react';
import { Calendar, Filter, Plus } from 'lucide-react';
import ResponsiveLayout from '../components/Layout/ResponsiveLayout';
import EventCard from '../components/Events/EventCard';
import ItineraryBuilder from '../components/Tourism/ItineraryBuilder';
import NotificationBanner from '../components/Common/NotificationBanner';
import { mockEvents } from '../data/mockData';
import { useAuth } from '../hooks/useAuth';
import { isMobile } from '../utils/responsive';

const EventsPage: React.FC = () => {
  const { user } = useAuth();
  const mobile = isMobile();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [showItinerary, setShowItinerary] = useState(false);

  const categories = ['All', 'Music', 'Community', 'Arts & Culture', 'Sports', 'Food & Drink'];

  const filteredEvents = mockEvents.filter(event => 
    selectedFilter === 'All' || event.category === selectedFilter
  );

  const upcomingEvents = filteredEvents.filter(event => 
    new Date(event.date) >= new Date()
  );

  return (
    <div className={`${mobile ? 'pb-20' : ''} bg-gray-50 min-h-screen`}>
      <ResponsiveLayout className={`${mobile ? 'px-4' : 'px-0'} py-4 space-y-4`}>
        {/* Itinerary Promotion */}
        {user && !showItinerary && (
          <NotificationBanner
            type="update"
            title="Plan Your Perfect Day!"
            message="Create a custom itinerary with events and places you want to visit"
            actionText="Build Itinerary"
            onAction={() => setShowItinerary(true)}
          />
        )}

        {/* Itinerary Builder */}
        {showItinerary && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Itinerary Builder</h2>
              <button
                onClick={() => setShowItinerary(false)}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Back to Events
              </button>
            </div>
            <ItineraryBuilder onSave={(itinerary) => console.log('Saved itinerary:', itinerary)} />
            <hr className="border-gray-200" />
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Events</h1>
            <p className="text-gray-600">Discover what's happening around you</p>
          </div>
          <button className="btn-primary flex items-center space-x-2">
            <Plus size={16} />
            <span>Create</span>
          </button>
        </div>

        {/* Quick Date Navigation */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 overflow-x-auto">
            {['Today', 'Tomorrow', 'This Week', 'This Month'].map((period) => (
              <button
                key={period}
                className="flex-shrink-0 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter size={16} />
            <span className="text-sm font-medium">Filter</span>
          </button>
          
          <div className="flex-1 overflow-x-auto">
            <div className="flex space-x-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedFilter(category)}
                  className={`flex-shrink-0 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedFilter === category
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Advanced Filters</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="flex space-x-2">
                  {['Free', '$1-25', '$26-50', '$50+'].map((price) => (
                    <button
                      key={price}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                      {price}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Distance</label>
                <select className="input-field">
                  <option>Within 1 mile</option>
                  <option>Within 5 miles</option>
                  <option>Within 10 miles</option>
                  <option>Any distance</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Events List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Upcoming Events ({upcomingEvents.length})
            </h2>
            <button className="text-primary-600 text-sm font-medium">View Calendar</button>
          </div>

          {upcomingEvents.length > 0 ? (
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onClick={() => console.log('Navigate to event:', event.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">
                <Calendar size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your filters or check back later</p>
              <button className="btn-primary">Create an Event</button>
            </div>
          )}
        </div>

        {/* Featured Event Banner */}
        {!showItinerary && (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-6 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2">Summer Music Festival</h3>
              <p className="text-purple-100 mb-3">Join us for three days of amazing music and food!</p>
              <div className="flex space-x-2">
                <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors">
                  Get Tickets
                </button>
                {user && (
                  <button 
                    onClick={() => setShowItinerary(true)}
                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Add to Itinerary
                  </button>
                )}
              </div>
            </div>
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full"></div>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full"></div>
          </div>
        )}
      </ResponsiveLayout>
    </div>
  );
};

export default EventsPage;