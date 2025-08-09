'use client';

import { Smartphone, TrendingUp, Users, Download } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@cozumel/ui';

export function MobileAppStats() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Smartphone className="h-5 w-5" />
          <span>Mobile App Statistics</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          {/* iOS Stats */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center space-x-2">
              <Smartphone className="h-4 w-4" />
              <span>iOS App</span>
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Downloads</span>
                <span className="font-semibold">12,543</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Users</span>
                <span className="font-semibold">4,231</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">App Store Rating</span>
                <span className="font-semibold text-mobile-600">4.8 ⭐</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Version</span>
                <span className="font-semibold">1.2.3</span>
              </div>
            </div>
          </div>

          {/* Android Stats */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center space-x-2">
              <Smartphone className="h-4 w-4" />
              <span>Android App</span>
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Downloads</span>
                <span className="font-semibold">18,721</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Users</span>
                <span className="font-semibold">6,892</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Play Store Rating</span>
                <span className="font-semibold text-green-600">4.7 ⭐</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Version</span>
                <span className="font-semibold">1.2.3</span>
              </div>
            </div>
          </div>
        </div>

        {/* Combined Stats */}
        <div className="mt-6 pt-6 border-t">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Download className="h-5 w-5 text-mobile-600" />
              </div>
              <div className="text-2xl font-bold">31,264</div>
              <div className="text-sm text-gray-600">Total Downloads</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-mobile-600" />
              </div>
              <div className="text-2xl font-bold">11,123</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold">+18%</div>
              <div className="text-sm text-gray-600">Growth Rate</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}