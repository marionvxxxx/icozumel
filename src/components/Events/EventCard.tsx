import React from 'react';
import { Calendar, MapPin, Users, DollarSign } from 'lucide-react';
import { Event } from '../../types';

interface EventCardProps {
  event: Event;
  onClick?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getAttendancePercentage = () => {
    if (!event.maxAttendees) return 0;
    return (event.attendees / event.maxAttendees) * 100;
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      {event.image && (
        <div className="relative">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-40 object-cover"
          />
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
            <div className="text-xs font-medium text-gray-900">{formatDate(event.date)}</div>
            <div className="text-xs text-gray-600">{event.time}</div>
          </div>
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 flex-1">{event.title}</h3>
          <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full ml-2">
            {event.category}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.description}</p>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar size={14} className="mr-2" />
            <span>{formatDate(event.date)} at {event.time}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <MapPin size={14} className="mr-2" />
            <span className="truncate">{event.location}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <Users size={14} className="mr-2" />
              <span>{event.attendees} attending</span>
              {event.maxAttendees && (
                <span className="text-gray-400"> / {event.maxAttendees}</span>
              )}
            </div>
            
            {event.price && (
              <div className="flex items-center text-sm font-medium text-gray-900">
                <DollarSign size={14} className="mr-1" />
                <span>{event.price}</span>
              </div>
            )}
          </div>
          
          {event.maxAttendees && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(getAttendancePercentage(), 100)}%` }}
              ></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;