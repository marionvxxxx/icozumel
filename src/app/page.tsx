import { Suspense } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { LazyAnalyticsChart } from '@/components/dashboard/LazyAnalyticsChart';
import { RealTimeVerificationQueue } from '@/components/dashboard/real-time-verification-queue';

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-3 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <Suspense fallback={<StatsSkeleton />}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold">12,847</p>
                  <p className="text-xs text-green-600">+12% from last month</p>
                </div>
                <div className="text-2xl">👥</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Businesses</p>
                  <p className="text-2xl font-bold">3,421</p>
                  <p className="text-xs text-green-600">+8% from last month</p>
                </div>
                <div className="text-2xl">🏪</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                  <p className="text-2xl font-bold">$89,432</p>
                  <p className="text-xs text-green-600">+15% from last month</p>
                </div>
                <div className="text-2xl">💰</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Support Tickets</p>
                  <p className="text-2xl font-bold">127</p>
                  <p className="text-xs text-red-600">+3% from last month</p>
                </div>
                <div className="text-2xl">🎫</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Suspense>

      {/* Analytics Chart */}
      <LazyAnalyticsChart />

      {/* Real-time Business Verification Queue */}
      <ErrorBoundary>
        <Suspense fallback={<Skeleton className="h-64 w-full" />}>
          <RealTimeVerificationQueue />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}