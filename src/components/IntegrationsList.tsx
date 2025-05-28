
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Settings, Trash2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Integration {
  id: string;
  name: string;
  type: string;
  provider: string;
  status: string;
  created_at: string;
}

export const IntegrationsList = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockIntegrations: Integration[] = [
        {
          id: "1",
          name: "GitHub Actions",
          type: "ci_cd",
          provider: "github",
          status: "active",
          created_at: "2024-01-10T09:00:00Z"
        },
        {
          id: "2",
          name: "Slack Notifications",
          type: "communication",
          provider: "slack",
          status: "inactive",
          created_at: "2024-01-12T15:30:00Z"
        }
      ];
      
      setIntegrations(mockIntegrations);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch integrations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setIntegrations(integrations.map(integration => 
        integration.id === id 
          ? { ...integration, status: newStatus }
          : integration
      ));
      
      toast({
        title: "Integration Updated",
        description: `Integration ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update integration status",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setIntegrations(integrations.filter(integration => integration.id !== id));
      toast({
        title: "Integration Deleted",
        description: "Integration has been deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete integration",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'secondary';
      case 'error':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading integrations...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Active Integrations</h3>
        <Button onClick={fetchIntegrations} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      {integrations.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <Settings className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No integrations configured yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {integrations.map((integration) => (
            <Card key={integration.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <h4 className="font-medium">{integration.name}</h4>
                      <p className="text-sm text-muted-foreground capitalize">
                        {integration.type.replace('_', ' ')} • {integration.provider}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={getStatusColor(integration.status) as any}>
                      {integration.status}
                    </Badge>
                    <Switch
                      checked={integration.status === 'active'}
                      onCheckedChange={() => handleStatusToggle(integration.id, integration.status)}
                    />
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDelete(integration.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
