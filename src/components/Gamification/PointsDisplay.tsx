import React from 'react';
import { Star, Trophy, Gift, TrendingUp } from 'lucide-react';

interface PointsDisplayProps {
  points: number;
  level: number;
  nextLevelPoints: number;
  recentEarnings?: Array<{
    action: string;
    points: number;
    timestamp: string;
  }>;
}

const PointsDisplay: React.FC<PointsDisplayProps> = ({ 
  points, 
  level, 
  nextLevelPoints, 
  recentEarnings = [] 
}) => {
  const progressPercentage = (points / nextLevelPoints) * 100;
  const pointsToNext = nextLevelPoints - points;

  const getLevelBadge = (level: number) => {
    if (level >= 10) return { color: 'from-purple-500 to-pink-500', title: 'Local Legend' };
    if (level >= 7) return { color: 'from-yellow-400 to-orange-500', title: 'Community Champion' };
    if (level >= 4) return { color: 'from-blue-500 to-indigo-500', title: 'Explorer' };
    return { color: 'from-green-500 to-teal-500', title: 'Newcomer' };
  };

  const badge = getLevelBadge(level);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-white">Your Progress</h3>
          <p className="text-sm text-white/70">Keep exploring to earn more points!</p>
        </div>
        <div className={`w-12 h-12 bg-gradient-to-r ${badge.color} rounded-full flex items-center justify-center`}>
          <Trophy className="text-white" size={20} />
        </div>
      </div>

      {/* Level and Points */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-white">{points}</span>
            <span className="text-sm text-white/70">points</span>
          </div>
          <div className={`bg-gradient-to-r ${badge.color} text-white px-3 py-1 rounded-full text-sm font-medium`}>
            Level {level} • {badge.title}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-2 mb-2">
          <div 
            className={`bg-gradient-to-r ${badge.color} h-2 rounded-full transition-all duration-500`}
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-xs text-white/60">
          <span>Level {level}</span>
          <span>{pointsToNext} points to Level {level + 1}</span>
        </div>
      </div>

      {/* Recent Earnings */}
      {recentEarnings.length > 0 && (
        <div>
          <h4 className="font-medium text-white mb-2 flex items-center">
            <TrendingUp size={16} className="mr-1 text-green-500" />
            Recent Activity
          </h4>
          <div className="space-y-2">
            {recentEarnings.slice(0, 3).map((earning, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-white/80">{earning.action}</span>
                <div className="flex items-center space-x-1 text-green-600">
                  <span>+{earning.points}</span>
                  <Star size={12} className="fill-current" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-2">
          <button className="flex flex-col items-center p-2 glass text-white rounded-lg hover:bg-white/20 transition-colors">
            <Star size={16} className="mb-1" />
            <span className="text-xs font-medium">Review</span>
            <span className="text-xs text-primary-500">+10 pts</span>
          </button>
          <button className="flex flex-col items-center p-2 glass text-white rounded-lg hover:bg-white/20 transition-colors">
            <Gift size={16} className="mb-1" />
            <span className="text-xs font-medium">Check-in</span>
            <span className="text-xs text-secondary-500">+5 pts</span>
          </button>
          <button className="flex flex-col items-center p-2 glass text-white rounded-lg hover:bg-white/20 transition-colors">
            <Trophy size={16} className="mb-1" />
            <span className="text-xs font-medium">Share</span>
            <span className="text-xs text-green-500">+3 pts</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PointsDisplay;