'use client';

import { lazy, Suspense } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load the chart component
const AnalyticsChart = lazy(() => import('./AnalyticsChart'));

function ChartSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-64 w-full" />
      <div className="flex space-x-4">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}

export function LazyAnalyticsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>📊 Analytics Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<ChartSkeleton />}>
          <AnalyticsChart />
        </Suspense>
      </CardContent>
    </Card>
  );
}