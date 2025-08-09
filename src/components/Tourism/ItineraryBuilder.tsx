import React, { useState } from 'react';
import { Plus, Clock, MapPin, Star, Trash2, Navigation } from 'lucide-react';
import { Business, Event } from '../../types';

interface ItineraryItem {
  id: string;
  type: 'business' | 'event';
  data: Business | Event;
  timeSlot: string;
  duration: number; // in minutes
  notes?: string;
}

interface ItineraryBuilderProps {
  onSave?: (itinerary: ItineraryItem[]) => void;
}

const ItineraryBuilder: React.FC<ItineraryBuilderProps> = ({ onSave }) => {
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAddModal, setShowAddModal] = useState(false);

  const addToItinerary = (item: Business | Event, type: 'business' | 'event') => {
    const newItem: ItineraryItem = {
      id: Date.now().toString(),
      type,
      data: item,
      timeSlot: '09:00',
      duration: type === 'business' ? 60 : 120,
    };
    setItinerary([...itinerary, newItem]);
    setShowAddModal(false);
  };

  const removeFromItinerary = (id: string) => {
    setItinerary(itinerary.filter(item => item.id !== id));
  };

  const updateTimeSlot = (id: string, timeSlot: string) => {
    setItinerary(itinerary.map(item => 
      item.id === id ? { ...item, timeSlot } : item
    ));
  };

  const calculateTotalTime = () => {
    return itinerary.reduce((total, item) => total + item.duration, 0);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-900">My Itinerary</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>Add Stop</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="text-sm text-gray-600">
            <div>Total time: {formatDuration(calculateTotalTime())}</div>
            <div>{itinerary.length} stops planned</div>
          </div>
        </div>
      </div>

      {/* Itinerary Items */}
      <div className="space-y-3">
        {itinerary.map((item, index) => (
          <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium">
                {index + 1}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {'name' in item.data ? item.data.name : item.data.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin size={12} />
                      <span>
                        {'address' in item.data ? item.data.address : item.data.location}
                      </span>
                    </div>
                    {'rating' in item.data && (
                      <div className="flex items-center space-x-1 mt-1">
                        <Star size={12} className="text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{item.data.rating}</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removeFromItinerary(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <Clock size={14} className="text-gray-400" />
                    <input
                      type="time"
                      value={item.timeSlot}
                      onChange={(e) => updateTimeSlot(item.id, e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                    />
                  </div>
                  <span className="text-sm text-gray-600">
                    ({formatDuration(item.duration)})
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {itinerary.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <MapPin size={48} className="mx-auto mb-2 text-gray-300" />
            <p>No stops added yet</p>
            <p className="text-sm">Start building your perfect day!</p>
          </div>
        )}
      </div>

      {/* Actions */}
      {itinerary.length > 0 && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex space-x-3">
            <button
              onClick={() => onSave?.(itinerary)}
              className="flex-1 btn-primary"
            >
              Save Itinerary
            </button>
            <button className="flex-1 bg-secondary-600 hover:bg-secondary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
              <Navigation size={16} />
              <span>Start Navigation</span>
            </button>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Add to Itinerary</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-3">
              <p className="text-gray-600 text-sm">Choose what to add to your itinerary:</p>
              <button
                onClick={() => {/* Add business selection logic */}}
                className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
              >
                <div className="font-medium text-gray-900">Browse Businesses</div>
                <div className="text-sm text-gray-600">Restaurants, shops, attractions</div>
              </button>
              <button
                onClick={() => {/* Add event selection logic */}}
                className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
              >
                <div className="font-medium text-gray-900">Browse Events</div>
                <div className="text-sm text-gray-600">Concerts, festivals, activities</div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItineraryBuilder;