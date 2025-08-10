@@ .. @@
 import { Suspense } from 'react';
 import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
 import { Skeleton } from '@/components/ui/skeleton';
+import { ErrorBoundary } from '@/components/ui/error-boundary';
 import { LazyAnalyticsChart } from '@/components/dashboard/LazyAnalyticsChart';
+import { RealTimeVerificationQueue } from '@/components/dashboard/real-time-verification-queue';

 function StatsSkeleton() {
@@ .. @@
       {/* Analytics Chart */}
       <LazyAnalyticsChart />

-      {/* Business Verification Queue */}
-      <Card>
-        <CardHeader>
-          <CardTitle className="flex items-center space-x-2">
-            <span>✅</span>
-            <span>Business Verification Queue</span>
-            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">3</span>
-          </CardTitle>
-        </CardHeader>
-        <CardContent>
-          <div className="space-y-4">
-            {[
-              {
-                name: 'Restaurant El Moro',
-                owner: 'Carlos Rodriguez',
-                platform: 'iOS',
-                status: 'pending',
-                risk: 'low'
-              },
-              {
-                name: 'Dive Shop Paradise',
-                owner: 'Sarah Johnson',
-                platform: 'Android',
-                status: 'review',
-                risk: 'medium'
-              },
-              {
-                name: 'Beach Club Sunset',
-                owner: 'Miguel Hernandez',
-                platform: 'iOS',
-                status: 'pending',
-                risk: 'low'
-              }
-            ].map((business, index) => (
-              <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
-                <div className="flex items-center justify-between mb-3">
-                  <div>
-                    <h4 className="font-semibold text-lg">{business.name}</h4>
-                    <p className="text-sm text-gray-600 flex items-center space-x-2">
-                      <span>{business.owner}</span>
-                      <span>•</span>
-                      <span className={business.platform === 'iOS' ? 'text-blue-600' : 'text-green-600'}>
-                        {business.platform === 'iOS' ? '🍎' : '🤖'} {business.platform}
-                      </span>
-                    </p>
-                  </div>
-                  <div className="flex items-center space-x-2">
-                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
-                      business.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-orange-100 text-orange-800'
-                    }`}>
-                      {business.status.toUpperCase()}
-                    </span>
-                    <span className={`text-sm font-medium ${
-                      business.risk === 'low' ? 'text-green-600' : 'text-yellow-600'
-                    }`}>
-                      {business.risk === 'low' ? '🟢' : '🟡'} {business.risk} risk
-                    </span>
-                  </div>
-                </div>
-                <div className="flex items-center justify-between">
-                  <div className="flex flex-wrap gap-1">
-                    {['RFC', 'INE', 'Proof of Address'].map((doc) => (
-                      <span key={doc} className="border border-gray-200 text-gray-600 text-xs px-2 py-1 rounded">
-                        {doc}
-                      </span>
-                    ))}
-                  </div>
-                  <div className="flex items-center space-x-2">
-                    <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
-                      👁️ Review
-                    </button>
-                    <button className="px-3 py-1 text-sm border border-green-300 text-green-600 rounded hover:bg-green-50">
-                      ✅ Approve
-                    </button>
-                    <button className="px-3 py-1 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50">
-                      ❌ Reject
-                    </button>
-                  </div>
-                </div>
-              </div>
-            ))}
-          </div>
-        </CardContent>
-      </Card>
+      {/* Real-time Business Verification Queue */}
+      <ErrorBoundary>
+        <Suspense fallback={<Skeleton className="h-64 w-full" />}>
+          <RealTimeVerificationQueue />
+        </Suspense>
+      </ErrorBoundary>
     </div>
   );
 }