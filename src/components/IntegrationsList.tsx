
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Puzzle, Settings, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Integration {
  id: string;
  name: string;
  type: string;
  provider: string;
  status: string;
  created_at: string;
}

const IntegrationsList = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setIntegrations(data || []);
    } catch (error) {
      console.error('Error fetching integrations:', error);
      toast({
        title: "Error",
        description: "Failed to load integrations.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (integrationId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    try {
      const { error } = await supabase
        .from('integrations')
        .update({ status: newStatus })
        .eq('id', integrationId);

      if (error) throw error;

      setIntegrations(prev => 
        prev.map(integration => 
          integration.id === integrationId 
            ? { ...integration, status: newStatus }
            : integration
        )
      );

      toast({
        title: "Success",
        description: `Integration ${newStatus === 'active' ? 'activated' : 'deactivated'}.`,
      });
    } catch (error) {
      console.error('Error updating integration:', error);
      toast({
        title: "Error",
        description: "Failed to update integration status.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (integrationId: string) => {
    try {
      const { error } = await supabase
        .from('integrations')
        .delete()
        .eq('id', integrationId);

      if (error) throw error;

      setIntegrations(prev => prev.filter(integration => integration.id !== integrationId));

      toast({
        title: "Success",
        description: "Integration deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting integration:', error);
      toast({
        title: "Error",
        description: "Failed to delete integration.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading integrations...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Integrations</CardTitle>
        <CardDescription>Manage your connected tools and services</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {integrations.map((integration) => (
            <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <Puzzle className="h-5 w-5 text-primary" />
                <div>
                  <h4 className="font-medium">{integration.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {integration.provider} • {integration.type}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={integration.status === 'active' ? 'default' : 'secondary'}>
                  {integration.status}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleStatus(integration.id, integration.status)}
                >
                  <Settings className="h-4 w-4 mr-1" />
                  {integration.status === 'active' ? 'Deactivate' : 'Activate'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(integration.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
          {integrations.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No integrations configured yet. Add your first integration!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegrationsList;
