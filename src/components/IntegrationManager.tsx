
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Settings, Sync, Trash2, CheckCircle, XCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDataFlow } from "@/hooks/useDataFlow";
import { supabase } from "@/integrations/supabase/client";

interface Integration {
  id: string;
  name: string;
  provider: string;
  type: string;
  status: string;
  configuration: any;
  created_at: string;
  updated_at: string;
}

export const IntegrationManager = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [syncingIntegrations, setSyncingIntegrations] = useState<Set<string>>(new Set());
  const { syncWithIntegration } = useDataFlow();
  const { toast } = useToast();

  const [newIntegration, setNewIntegration] = useState({
    name: '',
    provider: '',
    type: '',
    configuration: {}
  });

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
      console.error('Failed to fetch integrations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch integrations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddIntegration = async () => {
    if (!newIntegration.name || !newIntegration.provider || !newIntegration.type) {
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
          ...newIntegration,
          user_id: user.id,
          status: 'active'
        }]);

      if (error) throw error;

      toast({
        title: "Integration Added",
        description: "Integration has been successfully added",
      });

      setNewIntegration({ name: '', provider: '', type: '', configuration: {} });
      setShowAddForm(false);
      fetchIntegrations();
    } catch (error) {
      console.error('Failed to add integration:', error);
      toast({
        title: "Error",
        description: "Failed to add integration",
        variant: "destructive",
      });
    }
  };

  const handleSync = async (integrationId: string) => {
    setSyncingIntegrations(prev => new Set(prev).add(integrationId));
    
    try {
      await syncWithIntegration(integrationId);
    } catch (error) {
      // Error handling is done in useDataFlow
    } finally {
      setSyncingIntegrations(prev => {
        const newSet = new Set(prev);
        newSet.delete(integrationId);
        return newSet;
      });
    }
  };

  const handleDeleteIntegration = async (integrationId: string) => {
    try {
      const { error } = await supabase
        .from('integrations')
        .delete()
        .eq('id', integrationId);

      if (error) throw error;

      toast({
        title: "Integration Deleted",
        description: "Integration has been successfully deleted",
      });

      fetchIntegrations();
    } catch (error) {
      console.error('Failed to delete integration:', error);
      toast({
        title: "Error",
        description: "Failed to delete integration",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'inactive':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'destructive';
      case 'pending':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading integrations...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Integration Management
            <Button onClick={() => setShowAddForm(!showAddForm)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Integration
            </Button>
          </CardTitle>
          <CardDescription>
            Manage connections to external testing tools and platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showAddForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Add New Integration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Integration Name</Label>
                    <Input
                      id="name"
                      value={newIntegration.name}
                      onChange={(e) => setNewIntegration({ ...newIntegration, name: e.target.value })}
                      placeholder="My Integration"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="provider">Provider</Label>
                    <Select value={newIntegration.provider} onValueChange={(value) => setNewIntegration({ ...newIntegration, provider: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jira">Jira</SelectItem>
                        <SelectItem value="github">GitHub</SelectItem>
                        <SelectItem value="jenkins">Jenkins</SelectItem>
                        <SelectItem value="slack">Slack</SelectItem>
                        <SelectItem value="teams">Microsoft Teams</SelectItem>
                        <SelectItem value="testlink">TestLink</SelectItem>
                        <SelectItem value="zephyr">Zephyr</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Integration Type</Label>
                  <Select value={newIntegration.type} onValueChange={(value) => setNewIntegration({ ...newIntegration, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="issue_tracking">Issue Tracking</SelectItem>
                      <SelectItem value="ci_cd">CI/CD</SelectItem>
                      <SelectItem value="notification">Notification</SelectItem>
                      <SelectItem value="test_management">Test Management</SelectItem>
                      <SelectItem value="repository">Repository</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddIntegration}>
                    Add Integration
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {integrations.length === 0 ? (
            <div className="text-center py-8">
              <Settings className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No integrations configured yet</p>
              <p className="text-sm text-gray-400">Add your first integration to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {integrations.map((integration) => (
                <div key={integration.id} className="p-4 border rounded-lg bg-white/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(integration.status)}
                      <div>
                        <h4 className="font-medium">{integration.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {integration.provider} • {integration.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusColor(integration.status) as any}>
                        {integration.status}
                      </Badge>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSync(integration.id)}
                          disabled={syncingIntegrations.has(integration.id)}
                        >
                          <Sync className={`h-4 w-4 ${syncingIntegrations.has(integration.id) ? 'animate-spin' : ''}`} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteIntegration(integration.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  {syncingIntegrations.has(integration.id) && (
                    <div className="mt-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Sync className="h-3 w-3 animate-spin" />
                        Syncing with {integration.provider}...
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
