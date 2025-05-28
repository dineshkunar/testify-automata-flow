
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface IntegrationConfigProps {
  integration: {
    name: string;
    provider: string;
    type: string;
  };
  onClose: () => void;
  onSave: () => void;
}

export const IntegrationConfig = ({ integration, onClose, onSave }: IntegrationConfigProps) => {
  const [config, setConfig] = useState({
    apiKey: "",
    webhookUrl: "",
    serverUrl: "",
    username: "",
    projectKey: "",
    notifications: true,
    autoSync: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('integrations')
        .upsert({
          name: integration.name,
          provider: integration.provider,
          type: integration.type,
          user_id: user.id,
          status: 'active',
          configuration: config
        });

      if (error) throw error;

      toast({
        title: "Configuration Saved",
        description: `${integration.name} has been configured successfully.`,
      });

      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast({
        title: "Error",
        description: "Failed to save configuration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getConfigFields = () => {
    switch (integration.provider.toLowerCase()) {
      case 'slack':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="webhookUrl">Webhook URL *</Label>
              <Input
                id="webhookUrl"
                placeholder="https://hooks.slack.com/services/..."
                value={config.webhookUrl}
                onChange={(e) => setConfig({...config, webhookUrl: e.target.value})}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={config.notifications}
                onCheckedChange={(checked) => setConfig({...config, notifications: checked})}
              />
              <Label>Enable notifications</Label>
            </div>
          </div>
        );

      case 'jira':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="serverUrl">Server URL *</Label>
              <Input
                id="serverUrl"
                placeholder="https://yourcompany.atlassian.net"
                value={config.serverUrl}
                onChange={(e) => setConfig({...config, serverUrl: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="username">Username/Email *</Label>
              <Input
                id="username"
                placeholder="your-email@company.com"
                value={config.username}
                onChange={(e) => setConfig({...config, username: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="apiKey">API Token *</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Your Jira API token"
                value={config.apiKey}
                onChange={(e) => setConfig({...config, apiKey: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="projectKey">Project Key</Label>
              <Input
                id="projectKey"
                placeholder="e.g., TEST"
                value={config.projectKey}
                onChange={(e) => setConfig({...config, projectKey: e.target.value})}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={config.autoSync}
                onCheckedChange={(checked) => setConfig({...config, autoSync: checked})}
              />
              <Label>Auto-sync test cases</Label>
            </div>
          </div>
        );

      case 'testrail':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="serverUrl">TestRail URL *</Label>
              <Input
                id="serverUrl"
                placeholder="https://yourcompany.testrail.io"
                value={config.serverUrl}
                onChange={(e) => setConfig({...config, serverUrl: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                placeholder="Your TestRail username"
                value={config.username}
                onChange={(e) => setConfig({...config, username: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="apiKey">API Key *</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Your TestRail API key"
                value={config.apiKey}
                onChange={(e) => setConfig({...config, apiKey: e.target.value})}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={config.autoSync}
                onCheckedChange={(checked) => setConfig({...config, autoSync: checked})}
              />
              <Label>Auto-sync test results</Label>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter API key"
                value={config.apiKey}
                onChange={(e) => setConfig({...config, apiKey: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="webhookUrl">Webhook URL</Label>
              <Input
                id="webhookUrl"
                placeholder="Enter webhook URL"
                value={config.webhookUrl}
                onChange={(e) => setConfig({...config, webhookUrl: e.target.value})}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
      <CardHeader>
        <CardTitle>Configure {integration.name}</CardTitle>
        <CardDescription>
          Set up your {integration.provider} integration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {getConfigFields()}
        
        <div className="flex gap-4 pt-4">
          <Button onClick={handleSave} disabled={isSaving} className="flex-1">
            {isSaving ? "Saving..." : "Save Configuration"}
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
