
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sync, RefreshCw, CheckCircle, XCircle, Clock } from "lucide-react";
import { useDataFlow } from "@/hooks/useDataFlow";
import { supabase } from "@/integrations/supabase/client";

export const IntegrationSyncStatus = () => {
  const [syncs, setSyncs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { syncWithIntegration } = useDataFlow();

  useEffect(() => {
    fetchSyncHistory();
  }, []);

  const fetchSyncHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('integration_syncs')
        .select(`
          *,
          integrations (
            name,
            provider
          )
        `)
        .order('started_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setSyncs(data || []);
    } catch (error) {
      console.error('Failed to fetch sync history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManualSync = async (integrationId: string) => {
    await syncWithIntegration(integrationId);
    fetchSyncHistory();
  };

  const getSyncIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <RefreshCw className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading sync status...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sync className="h-5 w-5" />
          Integration Sync Status
        </CardTitle>
        <CardDescription>Recent synchronization activities with external tools</CardDescription>
      </CardHeader>
      <CardContent>
        {syncs.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No sync history available</p>
        ) : (
          <div className="space-y-3">
            {syncs.map((sync) => (
              <div key={sync.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getSyncIcon(sync.sync_status)}
                  <div>
                    <h4 className="font-medium">
                      {sync.integrations?.name || 'Unknown Integration'}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {sync.integrations?.provider} • {sync.synced_items || 0} items synced
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={sync.sync_status === 'success' ? 'default' : 'destructive'}>
                    {sync.sync_status}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleManualSync(sync.integration_id)}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
