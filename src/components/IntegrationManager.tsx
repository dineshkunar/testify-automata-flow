
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Settings, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
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
        description: "Failed to fetch integrations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIntegration = async (e: React.FormEvent) => {
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
          name: formData.name,
          type: formData.type,
          provider: formData.provider,
          user_id: user.id,
          status: 'active',
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

  const toggleIntegrationStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      
      const { error } = await supabase
        .from('integrations')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Integration ${newStatus === 'active' ? 'activated' : 'deactivated'}`,
      });

      fetchIntegrations();
    } catch (error) {
      console.error('Error updating integration:', error);
      toast({
        title: "Error",
        description: "Failed to update integration",
        variant: "destructive",
      });
    }
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
        description: "Integration deleted successfully",
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
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Integrations</h3>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add Integration"}
        </Button>
      </div>

      {showForm && (
        <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
          <CardHeader>
            <CardTitle>Add New Integration</CardTitle>
            <CardDescription>Connect with external tools and services</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateIntegration} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Integration Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., Slack Notifications"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provider">Provider *</Label>
                  <Select value={formData.provider} onValueChange={(value) => setFormData({...formData, provider: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="slack">Slack</SelectItem>
                      <SelectItem value="jira">Jira</SelectItem>
                      <SelectItem value="testrail">TestRail</SelectItem>
                      <SelectItem value="github">GitHub</SelectItem>
                      <SelectItem value="jenkins">Jenkins</SelectItem>
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
                    <SelectItem value="ci_cd">CI/CD</SelectItem>
                    <SelectItem value="testing_tool">Testing Tool</SelectItem>
                    <SelectItem value="communication">Communication</SelectItem>
                    <SelectItem value="monitoring">Monitoring</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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

              <Button type="submit" className="w-full">Create Integration</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
        <CardHeader>
          <CardTitle>Active Integrations ({integrations.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {integrations.map((integration) => (
              <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg bg-white/50">
                <div>
                  <h4 className="font-medium">{integration.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {integration.provider} • {integration.type.replace('_', ' ')}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={integration.status === 'active' ? 'default' : 'secondary'}>
                    {integration.status}
                  </Badge>
                  <Switch
                    checked={integration.status === 'active'}
                    onCheckedChange={() => toggleIntegrationStatus(integration.id, integration.status)}
                  />
                  <div className="flex gap-1">
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
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
