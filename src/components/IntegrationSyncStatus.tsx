
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { upload, CheckCircle, XCircle, Clock } from "lucide-react";
import { useDataFlow } from "@/hooks/useDataFlow";
import { supabase } from "@/integrations/supabase/client";

interface SyncStatus {
  id: string;
  integration_name: string;
  sync_status: string;
  synced_items: number;
  started_at: string;
  completed_at?: string;
  error_message?: string;
}

export const IntegrationSyncStatus = () => {
  const [syncStatuses, setSyncStatuses] = useState<SyncStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const { syncWithIntegration } = useDataFlow();

  useEffect(() => {
    fetchSyncStatuses();
    setupRealtimeSubscription();
  }, []);

  const fetchSyncStatuses = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('integration_syncs')
        .select(`
          *,
          integrations!inner(name, user_id)
        `)
        .eq('integrations.user_id', user.id)
        .order('started_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      const formattedData = data?.map(item => ({
        id: item.id,
        integration_name: item.integrations.name,
        sync_status: item.sync_status,
        synced_items: item.synced_items || 0,
        started_at: item.started_at,
        completed_at: item.completed_at,
        error_message: item.error_message
      })) || [];

      setSyncStatuses(formattedData);
    } catch (error) {
      console.error('Error fetching sync statuses:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('integration_syncs_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'integration_syncs'
        },
        () => {
          fetchSyncStatuses();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'in_progress':
        return <upload className="h-4 w-4 text-blue-600 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'default';
      case 'failed':
        return 'destructive';
      case 'in_progress':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getProgress = (status: string) => {
    switch (status) {
      case 'success':
        return 100;
      case 'failed':
        return 0;
      case 'in_progress':
        return 50;
      default:
        return 0;
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading sync status...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <upload className="h-5 w-5" />
          Integration Sync Status
        </CardTitle>
        <CardDescription>Monitor your integration synchronization progress</CardDescription>
      </CardHeader>
      <CardContent>
        {syncStatuses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No sync activities yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {syncStatuses.map((sync) => (
              <div key={sync.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(sync.sync_status)}
                    <span className="font-medium">{sync.integration_name}</span>
                  </div>
                  <Badge variant={getStatusColor(sync.sync_status) as any}>
                    {sync.sync_status.replace('_', ' ')}
                  </Badge>
                </div>
                
                <Progress value={getProgress(sync.sync_status)} className="mb-2" />
                
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Items synced: {sync.synced_items}</span>
                  <span>
                    Started: {new Date(sync.started_at).toLocaleString()}
                  </span>
                </div>
                
                {sync.error_message && (
                  <p className="text-sm text-red-600 mt-2">{sync.error_message}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
