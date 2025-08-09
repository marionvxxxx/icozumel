'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@cozumel/ui';
import { Activity, CheckCircle, XCircle, UserPlus, Building2 } from 'lucide-react';

const activities = [
  {
    id: '1',
    type: 'verification_approved',
    message: 'Restaurant El Moro verified successfully',
    timestamp: '2 minutes ago',
    icon: CheckCircle,
    color: 'text-green-600',
  },
  {
    id: '2',
    type: 'business_registered',
    message: 'New business: Dive Shop Paradise',
    timestamp: '15 minutes ago',
    icon: Building2,
    color: 'text-blue-600',
  },
  {
    id: '3',
    type: 'user_registered',
    message: 'New user: Sarah Johnson',
    timestamp: '1 hour ago',
    icon: UserPlus,
    color: 'text-purple-600',
  },
  {
    id: '4',
    type: 'verification_rejected',
    message: 'Beach Club Sunset verification rejected',
    timestamp: '2 hours ago',
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