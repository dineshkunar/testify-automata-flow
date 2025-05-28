
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface NotificationSettings {
  test_execution_completed: boolean;
  test_failures: boolean;
  new_team_member: boolean;
  weekly_reports: boolean;
  integration_updates: boolean;
  email_notifications: boolean;
  slack_notifications: boolean;
  sms_notifications: boolean;
}

export const SettingsNotifications = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    test_execution_completed: true,
    test_failures: true,
    new_team_member: true,
    weekly_reports: false,
    integration_updates: true,
    email_notifications: true,
    slack_notifications: false,
    sms_notifications: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('preferences')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data?.preferences?.notifications) {
        setSettings({ ...settings, ...data.preferences.notifications });
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('preferences')
        .eq('id', user.id)
        .single();

      const updatedPreferences = {
        ...currentProfile?.preferences,
        notifications: settings
      };

      const { error } = await supabase
        .from('profiles')
        .update({ preferences: updatedPreferences })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Settings Saved",
        description: "Your notification preferences have been updated successfully.",
      });
    } catch (error) {
      console.error('Error saving notification settings:', error);
      toast({
        title: "Error",
        description: "Failed to save notification settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return <div className="text-center py-8">Loading notification settings...</div>;
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <Bell className="h-5 w-5 text-blue-600" />
          Notification Preferences
        </CardTitle>
        <CardDescription>Choose what notifications you want to receive</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-medium">Test Notifications</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Test execution completed</Label>
                <p className="text-sm text-muted-foreground">Get notified when test runs finish</p>
              </div>
              <Switch 
                checked={settings.test_execution_completed}
                onCheckedChange={(checked) => updateSetting('test_execution_completed', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Test failures</Label>
                <p className="text-sm text-muted-foreground">Immediate alerts for failed tests</p>
              </div>
              <Switch 
                checked={settings.test_failures}
                onCheckedChange={(checked) => updateSetting('test_failures', checked)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 border-t pt-4">
          <h4 className="font-medium">Team Notifications</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>New team member added</Label>
                <p className="text-sm text-muted-foreground">When someone joins your team</p>
              </div>
              <Switch 
                checked={settings.new_team_member}
                onCheckedChange={(checked) => updateSetting('new_team_member', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Weekly reports</Label>
                <p className="text-sm text-muted-foreground">Summary of your testing activity</p>
              </div>
              <Switch 
                checked={settings.weekly_reports}
                onCheckedChange={(checked) => updateSetting('weekly_reports', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Integration updates</Label>
                <p className="text-sm text-muted-foreground">When integrations sync or fail</p>
              </div>
              <Switch 
                checked={settings.integration_updates}
                onCheckedChange={(checked) => updateSetting('integration_updates', checked)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 border-t pt-4">
          <h4 className="font-medium">Notification Channels</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Email notifications</Label>
              <Switch 
                checked={settings.email_notifications}
                onCheckedChange={(checked) => updateSetting('email_notifications', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Slack notifications</Label>
              <Switch 
                checked={settings.slack_notifications}
                onCheckedChange={(checked) => updateSetting('slack_notifications', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>SMS notifications</Label>
              <Switch 
                checked={settings.sms_notifications}
                onCheckedChange={(checked) => updateSetting('sms_notifications', checked)}
              />
            </div>
          </div>
        </div>

        <Button onClick={saveSettings} disabled={saving} className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white">
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Preferences"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
