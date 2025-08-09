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
      className="card overflow-hidden cursor-pointer glow-on-hover animate-slide-up"
      onClick={onClick}
    >
      {event.image && (
        <div className="relative">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-40 object-cover"
          />
          <div className="absolute top-3 right-3 glass rounded-lg px-2 py-1">
            <div className="text-xs font-medium text-white">{formatDate(event.date)}</div>
            <div className="text-xs text-white/70">{event.time}</div>
          </div>
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-white flex-1">{event.title}</h3>
          <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full ml-2">
            {event.category}
          </span>
        </div>
        
        <p className="text-white/70 text-sm mb-3 line-clamp-2">{event.description}</p>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm text-white/60">
            <Calendar size={14} className="mr-2" />
            <span>{formatDate(event.date)} at {event.time}</span>
          </div>
          
          <div className="flex items-center text-sm text-white/60">
            <MapPin size={14} className="mr-2" />
            <span className="truncate">{event.location}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-white/60">
              <Users size={14} className="mr-2" />
              <span>{event.attendees} attending</span>
              {event.maxAttendees && (
                <span className="text-white/40"> / {event.maxAttendees}</span>
              )}
            </div>
            
            {event.price && (
              <div className="flex items-center text-sm font-medium text-white">
                <DollarSign size={14} className="mr-1" />
                <span>{event.price}</span>
              </div>
            )}
          </div>
          
          {event.maxAttendees && (
            <div className="w-full bg-white/20 rounded-full h-2">
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