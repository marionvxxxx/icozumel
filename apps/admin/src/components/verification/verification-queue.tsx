'use client';

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@cozumel/ui';
import { Eye, CheckCircle, XCircle, Clock, AlertTriangle, Smartphone } from 'lucide-react';

const mockVerifications = [
  {
    id: '1',
    businessName: 'Restaurant El Moro',
    ownerName: 'Carlos Rodriguez',
    type: 'Mexican Business',
    status: 'pending',
    riskScore: 0.2,
    submittedAt: '2024-01-15T10:30:00Z',
    documents: ['RFC', 'INE', 'Proof of Address'],
    platform: 'iOS',
  },
  {
    id: '2',
    businessName: 'Dive Shop Paradise',
    ownerName: 'Sarah Johnson',
    type: 'Expat Business',
    status: 'review',
    riskScore: 0.7,
    submittedAt: '2024-01-15T09:15:00Z',
    documents: ['Passport', 'Storefront Photo', 'Liveness Check'],
    platform: 'Android',
  },
  {
    id: '3',
    businessName: 'Beach Club Sunset',
    ownerName: 'Miguel Hernandez',
    type: 'Mexican Business',
    status: 'pending',
    riskScore: 0.1,
    submittedAt: '2024-01-15T08:45:00Z',
    documents: ['RFC', 'INE', 'Proof of Address', 'Business License'],
    platform: 'iOS',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'review': return 'bg-orange-100 text-orange-800';
    case 'approved': return 'bg-green-100 text-green-800';
    case 'rejected': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getRiskColor = (score: number) => {
  if (score < 0.3) return 'text-green-600';
  if (score < 0.7) return 'text-yellow-600';
  return 'text-red-600';
};

const getPlatformColor = (platform: string) => {
  return platform === 'iOS' ? 'text-mobile-600' : 'text-green-600';
};

export function VerificationQueue() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>Business Verification Queue</span>
          <Badge variant="secondary">{mockVerifications.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockVerifications.map((verification) => (
            <div key={verification.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
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
                  <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}