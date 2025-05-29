
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Crown } from "lucide-react";

interface IntegrationConfigDialogProps {
  integration: {
    name: string;
    type: string;
    provider: string;
    description: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: any) => void;
}

export const IntegrationConfigDialog = ({ integration, isOpen, onClose, onSave }: IntegrationConfigDialogProps) => {
  const [config, setConfig] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Only admins can configure integrations
  if (user?.role !== 'admin') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              Admin Access Required
            </DialogTitle>
            <DialogDescription>
              Only administrators can configure integrations. Please contact your admin to set up {integration.name}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={onClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  const getConfigFields = () => {
    switch (integration.provider) {
      case 'slack':
        return [
          { key: 'webhook_url', label: 'Webhook URL', type: 'url', placeholder: 'https://hooks.slack.com/...' },
          { key: 'channel', label: 'Channel', type: 'text', placeholder: '#general' },
          { key: 'bot_token', label: 'Bot Token', type: 'password', placeholder: 'xoxb-...' }
        ];
      case 'jira':
        return [
          { key: 'server_url', label: 'Server URL', type: 'url', placeholder: 'https://yourcompany.atlassian.net' },
          { key: 'username', label: 'Username', type: 'text', placeholder: 'your-email@company.com' },
          { key: 'api_token', label: 'API Token', type: 'password', placeholder: 'Your JIRA API token' },
          { key: 'project_key', label: 'Project Key', type: 'text', placeholder: 'TEST' }
        ];
      case 'testrail':
        return [
          { key: 'base_url', label: 'TestRail URL', type: 'url', placeholder: 'https://yourcompany.testrail.io' },
          { key: 'username', label: 'Username', type: 'text', placeholder: 'your-email@company.com' },
          { key: 'api_key', label: 'API Key', type: 'password', placeholder: 'Your TestRail API key' },
          { key: 'project_id', label: 'Project ID', type: 'number', placeholder: '1' }
        ];
      case 'trello':
        return [
          { key: 'api_key', label: 'API Key', type: 'password', placeholder: 'Your Trello API key' },
          { key: 'token', label: 'Token', type: 'password', placeholder: 'Your Trello token' },
          { key: 'board_id', label: 'Board ID', type: 'text', placeholder: 'Your Trello board ID' }
        ];
      default:
        return [
          { key: 'api_url', label: 'API URL', type: 'url', placeholder: 'https://api.example.com' },
          { key: 'api_key', label: 'API Key', type: 'password', placeholder: 'Your API key' }
        ];
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('integrations')
        .insert({
          name: integration.name,
          type: integration.type,
          provider: integration.provider,
          configuration: config,
          status: 'active',
          user_id: user?.id
        });

      if (error) throw error;

      toast({
        title: "Integration Configured",
        description: `${integration.name} has been successfully configured.`
      });

      onSave(config);
      onClose();
    } catch (error: any) {
      console.error('Error saving integration:', error);
      toast({
        title: "Configuration Failed",
        description: error.message || "Failed to save integration configuration",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const configFields = getConfigFields();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Configure {integration.name}</DialogTitle>
          <DialogDescription>
            {integration.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {configFields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key}>{field.label}</Label>
              <Input
                id={field.key}
                type={field.type}
                placeholder={field.placeholder}
                value={config[field.key] || ''}
                onChange={(e) => setConfig({ ...config, [field.key]: e.target.value })}
              />
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Configuration'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
