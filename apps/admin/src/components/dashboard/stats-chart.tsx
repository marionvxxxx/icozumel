'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@cozumel/ui';
import { TrendingUp } from 'lucide-react';

export function StatsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5" />
          <span>Business Growth</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Chart component would go here</p>
            <p className="text-sm">Integration with Recharts for data visualization</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}