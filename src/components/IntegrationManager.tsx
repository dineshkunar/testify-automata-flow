
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, upload, Settings, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDataFlow } from "@/hooks/useDataFlow";
import { supabase } from "@/integrations/supabase/client";

interface Integration {
  id: string;
  name: string;
  type: string;
  provider: string;
  status: string;
  configuration: any;
}

export const IntegrationManager = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    provider: "",
    api_key: "",
    webhook_url: ""
  });
  const { toast } = useToast();
  const { syncWithIntegration, loading: syncLoading } = useDataFlow();

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setIntegrations(data || []);
    } catch (error) {
      console.error('Error fetching integrations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch integrations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type || !formData.provider) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('integrations')
        .insert([{
          ...formData,
          user_id: user.id,
          status: 'inactive',
          configuration: {
            api_key: formData.api_key,
            webhook_url: formData.webhook_url
          }
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Integration created successfully!",
      });

      setFormData({
        name: "",
        type: "",
        provider: "",
        api_key: "",
        webhook_url: ""
      });
      setShowForm(false);
      fetchIntegrations();
    } catch (error) {
      console.error('Error creating integration:', error);
      toast({
        title: "Error",
        description: "Failed to create integration",
        variant: "destructive",
      });
    }
  };

  const handleSync = async (integrationId: string) => {
    await syncWithIntegration(integrationId);
    fetchIntegrations();
  };

  const deleteIntegration = async (id: string) => {
    try {
      const { error } = await supabase
        .from('integrations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Integration deleted successfully!",
      });

      fetchIntegrations();
    } catch (error) {
      console.error('Error deleting integration:', error);
      toast({
        title: "Error",
        description: "Failed to delete integration",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading integrations...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Integration Manager</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Integration
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Integration</CardTitle>
            <CardDescription>Connect with external testing tools and platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Integration Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter integration name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provider">Provider *</Label>
                  <Select value={formData.provider} onValueChange={(value) => setFormData({...formData, provider: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jira">Jira</SelectItem>
                      <SelectItem value="confluence">Confluence</SelectItem>
                      <SelectItem value="slack">Slack</SelectItem>
                      <SelectItem value="teams">Microsoft Teams</SelectItem>
                      <SelectItem value="github">GitHub</SelectItem>
                      <SelectItem value="gitlab">GitLab</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Integration Type *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reporting">Reporting</SelectItem>
                    <SelectItem value="notification">Notification</SelectItem>
                    <SelectItem value="sync">Data Sync</SelectItem>
                    <SelectItem value="webhook">Webhook</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="api_key">API Key</Label>
                  <Input
                    id="api_key"
                    type="password"
                    value={formData.api_key}
                    onChange={(e) => setFormData({...formData, api_key: e.target.value})}
                    placeholder="Enter API key"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="webhook_url">Webhook URL</Label>
                  <Input
                    id="webhook_url"
                    value={formData.webhook_url}
                    onChange={(e) => setFormData({...formData, webhook_url: e.target.value})}
                    placeholder="Enter webhook URL"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit">Create Integration</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {integrations.map((integration) => (
          <Card key={integration.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="font-semibold">{integration.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {integration.provider} • {integration.type}
                    </p>
                  </div>
                  <Badge variant={integration.status === 'active' ? 'default' : 'secondary'}>
                    {integration.status}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSync(integration.id)}
                    disabled={syncLoading}
                  >
                    <upload className="h-4 w-4 mr-2" />
                    Sync
                  </Button>
                  <Button size="sm" variant="outline">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => deleteIntegration(integration.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {integrations.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No integrations configured yet.</p>
              <Button onClick={() => setShowForm(true)} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Integration
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
