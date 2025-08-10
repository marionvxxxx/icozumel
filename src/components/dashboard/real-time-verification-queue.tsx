'use client';

import React, { useMemo } from 'react';
import { Eye, CheckCircle, XCircle, Clock, AlertTriangle, Smartphone } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { useRealTimeData } from '@/hooks/useRealTimeData';

interface BusinessVerification {
  id: string;
  businessName: string;
  ownerName: string;
  type: string;
  status: string;
  riskScore: number;
  documents: string[];
  submittedAt: string;
  platform: string;
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'review': return 'bg-orange-100 text-orange-800';
    case 'approved': return 'bg-green-100 text-green-800';
    case 'rejected': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getRiskColor = (score: number): string => {
  if (score < 0.3) return 'text-green-600';
  if (score < 0.7) return 'text-yellow-600';
  return 'text-red-600';
};

const getPlatformColor = (platform: string): string => {
  return platform === 'iOS' ? 'text-mobile-600' : 'text-green-600';
};

const VerificationItem = React.memo<{ verification: BusinessVerification }>(
  ({ verification }) => {
    const handleApprove = async () => {
      try {
        const response = await fetch('/api/businesses/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            businessId: verification.id,
            status: 'APPROVED',
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to approve verification');
        }
      } catch (error) {
        console.error('Error approving verification:', error);
      }
    };

    const handleReject = async () => {
      try {
        const response = await fetch('/api/businesses/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            businessId: verification.id,
            status: 'REJECTED',
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to reject verification');
        }
      } catch (error) {
        console.error('Error rejecting verification:', error);
      }
    };

    return (
      <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-lg">{verification.businessName}</h3>
            <p className="text-sm text-gray-600 flex items-center space-x-2">
              <span>{verification.ownerName} • {verification.type}</span>
              <Smartphone className={`h-4 w-4 ${getPlatformColor(verification.platform)}`} />
              <span className={getPlatformColor(verification.platform)}>{verification.platform}</span>
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(verification.status)}>
              {verification.status.toUpperCase()}
            </Badge>
            <div className="flex items-center space-x-1">
              <AlertTriangle className={`h-4 w-4 ${getRiskColor(verification.riskScore)}`} />
              <span className={`text-sm font-medium ${getRiskColor(verification.riskScore)}`}>
                {Math.round(verification.riskScore * 100)}%
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {verification.documents.map((doc) => (
              <Badge key={doc} variant="outline" className="text-xs">
                {doc}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">
              {new Date(verification.submittedAt).toLocaleDateString()}
            </span>
            <Button size="sm" variant="outline">
              <Eye className="h-4 w-4 mr-1" />
              Review
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="text-green-600 hover:text-green-700"
              onClick={handleApprove}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Approve
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="text-red-600 hover:text-red-700"
              onClick={handleReject}
            >
              <XCircle className="h-4 w-4 mr-1" />
              Reject
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

VerificationItem.displayName = 'VerificationItem';

export function RealTimeVerificationQueue() {
  const { data: verifications, loading, error, lastUpdate } = useRealTimeData<BusinessVerification[]>({
    table: 'business_verifications',
    filter: {
      status: 'pending'
    },
  });

  const pendingCount = useMemo(() => 
    verifications?.filter(v => v.status === 'pending').length || 0,
    [verifications]
  );

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p>Error loading verifications: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <ErrorBoundary>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Business Verification Queue</span>
            <Badge variant="secondary">{pendingCount}</Badge>
            {loading && (
              <div className="animate-pulse h-2 w-2 bg-green-500 rounded-full ml-2" />
            )}
            {lastUpdate && (
              <span className="text-xs text-gray-500 ml-auto">
                Last updated: {new Date(lastUpdate).toLocaleTimeString()}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading && !verifications && (
            <div className="text-center py-4">Loading verifications...</div>
          )}
          
          {verifications && verifications.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No pending verifications
            </div>
          )}
          
          <div className="space-y-4">
            {verifications?.map((verification) => (
              <VerificationItem key={verification.id} verification={verification} />
            ))}
          </div>
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
}