import { Card, CardContent, CardHeader, CardTitle } from '@cozumel/ui';
import { Smartphone, Users, CheckCircle, AlertTriangle, TrendingUp, Download } from 'lucide-react';
import { MobileAppStats } from '@/components/dashboard/mobile-app-stats';
import { VerificationQueue } from '@/components/verification/verification-queue';
import { RecentActivity } from '@/components/dashboard/recent-activity';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mobile App Dashboard</h1>
        <p className="text-gray-600">Manage iOS and Android apps for Cozumel marketplace</p>
      </div>

      {/* Mobile App Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">iOS Downloads</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,543</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Android Downloads</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18,721</div>
            <p className="text-xs text-muted-foreground">+22% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,456</div>
            <p className="text-xs text-muted-foreground">+8% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mobile App Statistics */}
        <div className="lg:col-span-2">
          <MobileAppStats />
        </div>

        {/* Recent Activity */}
        <div>
          <RecentActivity />
        </div>
      </div>

      {/* Verification Queue */}
      <div>
        <VerificationQueue />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>App Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">iOS App Rating</span>
                <span className="text-2xl font-bold text-mobile-600">4.8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Android App Rating</span>
                <span className="text-2xl font-bold text-mobile-600">4.7</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Crash-free Sessions</span>
                <span className="text-2xl font-bold text-green-600">99.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Download className="h-5 w-5" />
              <span>Download Trends</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">This Week</span>
                <span className="text-2xl font-bold">1,234</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">This Month</span>
                <span className="text-2xl font-bold">5,678</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Growth Rate</span>
                <span className="text-2xl font-bold text-green-600">+18%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}