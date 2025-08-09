import { Suspense } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@cozumel/ui';
import { Skeleton } from '@cozumel/ui';
import { LazyAnalyticsChart } from '../components/dashboard/LazyAnalyticsChart';

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mobile App Dashboard</h1>
        <p className="text-gray-600">Manage iOS and Android apps for Cozumel marketplace</p>
      </div>

      {/* Mobile App Stats Cards */}
      <Suspense fallback={<StatsSkeleton />}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium">iOS Downloads</h3>
                <span className="text-2xl">📱</span>
              </div>
              <div className="text-2xl font-bold">12,543</div>
              <p className="text-xs text-gray-600">+15% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium">Android Downloads</h3>
                <span className="text-2xl">🤖</span>
              </div>
              <div className="text-2xl font-bold">18,721</div>
              <p className="text-xs text-gray-600">+22% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium">Active Users</h3>
                <span className="text-2xl">👥</span>
              </div>
              <div className="text-2xl font-bold">8,456</div>
              <p className="text-xs text-gray-600">+8% from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium">Pending Verifications</h3>
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-gray-600">Requires attention</p>
            </CardContent>
          </Card>
        </div>
      </Suspense>

      {/* Analytics Chart */}
      <LazyAnalyticsChart />

      {/* Mobile App Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>📊</span>
            <span>Mobile App Statistics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            {/* iOS Stats */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg flex items-center space-x-2">
                <span>🍎</span>
                <span>iOS App</span>
              </h4>
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
              <h4 className="font-semibold text-lg flex items-center space-x-2">
                <span>🤖</span>
                <span>Android App</span>
              </h4>
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
                <div className="text-2xl mb-2">📥</div>
                <div className="text-2xl font-bold">31,264</div>
                <div className="text-sm text-gray-600">Total Downloads</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">👥</div>
                <div className="text-2xl font-bold">11,123</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">📈</div>
                <div className="text-2xl font-bold text-green-600">+18%</div>
                <div className="text-sm text-gray-600">Growth Rate</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Verification Queue */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>✅</span>
            <span>Business Verification Queue</span>
            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">3</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                name: 'Restaurant El Moro',
                owner: 'Carlos Rodriguez',
                platform: 'iOS',
                status: 'pending',
                risk: 'low'
              },
              {
                name: 'Dive Shop Paradise',
                owner: 'Sarah Johnson',
                platform: 'Android',
                status: 'review',
                risk: 'medium'
              },
              {
                name: 'Beach Club Sunset',
                owner: 'Miguel Hernandez',
                platform: 'iOS',
                status: 'pending',
                risk: 'low'
              }
            ].map((business, index) => (
              <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">{business.name}</h4>
                    <p className="text-sm text-gray-600 flex items-center space-x-2">
                      <span>{business.owner}</span>
                      <span>•</span>
                      <span className={business.platform === 'iOS' ? 'text-blue-600' : 'text-green-600'}>
                        {business.platform === 'iOS' ? '🍎' : '🤖'} {business.platform}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      business.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {business.status.toUpperCase()}
                    </span>
                    <span className={`text-sm font-medium ${
                      business.risk === 'low' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {business.risk === 'low' ? '🟢' : '🟡'} {business.risk} risk
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {['RFC', 'INE', 'Proof of Address'].map((doc) => (
                      <span key={doc} className="border border-gray-200 text-gray-600 text-xs px-2 py-1 rounded">
                        {doc}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                      👁️ Review
                    </button>
                    <button className="px-3 py-1 text-sm border border-green-300 text-green-600 rounded hover:bg-green-50">
                      ✅ Approve
                    </button>
                    <button className="px-3 py-1 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50">
                      ❌ Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}