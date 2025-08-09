'use client';

import { Activity, CheckCircle, XCircle, UserPlus, Smartphone, Download } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

const activities = [
  {
    id: '1',
    type: 'app_download',
    message: 'iOS app downloaded 50 times today',
    timestamp: '2 minutes ago',
    icon: Download,
    color: 'text-mobile-600',
  },
  {
    id: '2',
    type: 'verification_approved',
    message: 'Restaurant El Moro verified successfully',
    timestamp: '15 minutes ago',
    icon: CheckCircle,
    color: 'text-green-600',
  },
  {
    id: '3',
    type: 'business_registered',
    message: 'New business registered via Android app',
    timestamp: '1 hour ago',
    icon: Smartphone,
    color: 'text-green-600',
  },
  {
    id: '4',
    type: 'user_registered',
    message: 'New user: Sarah Johnson (iOS)',
    timestamp: '2 hours ago',
    icon: UserPlus,
    color: 'text-purple-600',
  },
  {
    id: '5',
    type: 'verification_rejected',
    message: 'Beach Club Sunset verification rejected',
    timestamp: '3 hours ago',
    icon: XCircle,
    color: 'text-red-600',
  },
];

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5" />
          <span>Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex items-start space-x-3">
                <Icon className={`h-5 w-5 mt-0.5 ${activity.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-500">
                    {activity.timestamp}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}