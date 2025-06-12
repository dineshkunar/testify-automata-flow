import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, RefreshCw, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface IntegrationSyncStatusProps {
  integrationName: string;
  status: 'idle' | 'syncing' | 'success' | 'failed';
  lastSync?: Date | null;
  syncProgress?: number;
  onRetry: () => void;
}

const statusMessages = {
  idle: 'Waiting for initial sync',
  syncing: 'Syncing data...',
  success: 'Successfully synced',
  failed: 'Sync failed',
};

const IntegrationSyncStatus: React.FC<IntegrationSyncStatusProps> = ({
  integrationName,
  status,
  lastSync,
  syncProgress,
  onRetry,
}) => {
  const { toast } = useToast();
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (status === 'success') {
      toast({
        title: `${integrationName} Synced`,
        description: `Successfully synced ${integrationName} data.`,
      });
    } else if (status === 'failed') {
      toast({
        title: `${integrationName} Sync Failed`,
        description: `Failed to sync ${integrationName} data. Please check your settings and try again.`,
        variant: 'destructive',
      });
    }
  }, [status, integrationName, toast]);

  const getStatusIcon = () => {
    switch (status) {
      case 'idle':
        return <Clock className="w-4 h-4 mr-2 text-gray-500" />;
      case 'syncing':
        return <RefreshCw className="w-4 h-4 mr-2 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 mr-2 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 mr-2 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'idle':
        return 'text-gray-500';
      case 'syncing':
        return 'text-blue-500';
      case 'success':
        return 'text-green-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{integrationName} Sync Status</CardTitle>
        <CardDescription>
          Status and details of the data synchronization with {integrationName}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {getStatusIcon()}
            <span className={`font-medium ${getStatusColor()}`}>
              {statusMessages[status] || 'Unknown Status'}
            </span>
          </div>
          {status === 'failed' && (
            <Button variant="outline" size="sm" onClick={onRetry}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry Sync
            </Button>
          )}
        </div>
        {status === 'syncing' && syncProgress !== undefined && (
          <div className="mt-4">
            <Progress value={syncProgress} />
            <p className="text-sm text-muted-foreground mt-2">
              {syncProgress}% Complete
            </p>
          </div>
        )}
        {lastSync && (
          <div className="mt-4">
            <Button variant="link" size="sm" onClick={() => setShowDetails(!showDetails)}>
              {showDetails ? 'Hide Details' : 'Show Details'}
            </Button>
            {showDetails && (
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">
                  Last Sync: {lastSync.toLocaleString()}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IntegrationSyncStatus;
