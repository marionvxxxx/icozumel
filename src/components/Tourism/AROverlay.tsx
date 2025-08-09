import React, { useState } from 'react';
import { Camera, MapPin, Star, Info, Navigation } from 'lucide-react';

interface ARPoint {
  id: string;
  name: string;
  type: 'business' | 'landmark' | 'event';
  distance: string;
  rating?: number;
  description: string;
  x: number; // Position on screen (percentage)
  y: number;
}

const AROverlay: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<ARPoint | null>(null);

  // Mock AR points
  const arPoints: ARPoint[] = [
    {
      id: '1',
      name: 'Coastal Café',
      type: 'business',
      distance: '50m',
      rating: 4.8,
      description: 'Artisan coffee with ocean views',
      x: 30,
      y: 40
    },
    {
      id: '2',
      name: 'Historic Lighthouse',
      type: 'landmark',
      distance: '200m',
      description: 'Built in 1892, offers panoramic views',
      x: 70,
      y: 25
    },
    {
      id: '3',
      name: 'Summer Music Festival',
      type: 'event',
      distance: '150m',
      description: 'Live music tonight at 7 PM',
      x: 50,
      y: 60
    }
  ];

  const getPointIcon = (type: string) => {
    switch (type) {
      case 'business':
        return <Star size={16} className="text-yellow-400" />;
      case 'landmark':
        return <MapPin size={16} className="text-blue-400" />;
      case 'event':
        return <Navigation size={16} className="text-green-400" />;
      default:
        return <Info size={16} />;
    }
  };

  if (!isActive) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Camera className="text-white" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AR Discovery</h3>
            <p className="text-sm text-gray-600">Point your camera to explore</p>
          </div>
        </div>
        <button
          onClick={() => setIsActive(true)}
          className="w-full btn-primary"
        >
          Start AR Experience
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Camera View Simulation */}
      <div className="relative w-full h-full bg-gradient-to-b from-blue-400 via-blue-300 to-green-200">
        {/* AR Points */}
        {arPoints.map((point) => (
          <div
            key={point.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
            onClick={() => setSelectedPoint(point)}
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg animate-pulse">
              {getPointIcon(point.type)}
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 mt-1 text-xs font-medium text-center min-w-max">
              {point.name}
              <div className="text-gray-600">{point.distance}</div>
            </div>
          </div>
        ))}

        {/* Controls */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <button
            onClick={() => setIsActive(false)}
            className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full"
          >
            <X size={24} />
          </button>
          <div className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
            AR Mode Active
          </div>
        </div>

        {/* Point Details Modal */}
        {selectedPoint && (
          <div className="absolute bottom-4 left-4 right-4 bg-white rounded-xl p-4 shadow-lg">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-gray-900">{selectedPoint.name}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>{selectedPoint.distance} away</span>
                  {selectedPoint.rating && (
                    <>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Star size={12} className="text-yellow-400 fill-current" />
                        <span>{selectedPoint.rating}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedPoint(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-700 text-sm mb-3">{selectedPoint.description}</p>
            <div className="flex space-x-2">
              <button className="flex-1 btn-primary">Navigate</button>
              <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                More Info
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AROverlay;