'use client';

import { useMemo } from 'react';

// Mock data - replace with real analytics data
const mockData = [
  { name: 'Jan', downloads: 4000, users: 2400 },
  { name: 'Feb', downloads: 3000, users: 1398 },
  { name: 'Mar', downloads: 2000, users: 9800 },
  { name: 'Apr', downloads: 2780, users: 3908 },
  { name: 'May', downloads: 1890, users: 4800 },
  { name: 'Jun', downloads: 2390, users: 3800 },
];

export default function AnalyticsChart() {
  const chartData = useMemo(() => mockData, []);

  const totalDownloads = useMemo(
    () => chartData.reduce((sum, item) => sum + item.downloads, 0),
    [chartData]
  );

  const totalUsers = useMemo(
    () => chartData.reduce((sum, item) => sum + item.users, 0),
    [chartData]
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-mobile-600">
            {totalDownloads.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total Downloads</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {totalUsers.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Active Users</div>
        </div>
      </div>
      
      {/* Placeholder for actual chart */}
      <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">📊</div>
          <p>Chart visualization would go here</p>
          <p className="text-sm">Integration with Recharts or similar</p>
        </div>
      </div>
    </div>
  );
}