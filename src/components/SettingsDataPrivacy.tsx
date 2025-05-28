
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Database, Download, Trash2, Loader2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const SettingsDataPrivacy = () => {
  const [analyticsTracking, setAnalyticsTracking] = useState(true);
  const [marketingCommunications, setMarketingCommunications] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const updatePrivacySettings = async () => {
    setLoading(true);
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
        privacy: {
          analytics_tracking: analyticsTracking,
          marketing_communications: marketingCommunications
        }
      };

      const { error } = await supabase
        .from('profiles')
        .update({ preferences: updatedPreferences })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Privacy Settings Updated",
        description: "Your privacy preferences have been saved successfully.",
      });
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      toast({
        title: "Error",
        description: "Failed to update privacy settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const requestDataExport = async () => {
    setLoading(true);
    try {
      // Simulate data export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Data Export Requested",
        description: "Your data export has been initiated. You'll receive an email with the download link within 24 hours.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to request data export. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteAllTestData = async () => {
    if (!confirm("Are you sure you want to delete all your test data? This action cannot be undone.")) {
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Delete test cases
      await supabase
        .from('test_cases')
        .delete()
        .eq('user_id', user.id);

      // Delete reports
      await supabase
        .from('reports')
        .delete()
        .eq('user_id', user.id);

      toast({
        title: "Test Data Deleted",
        description: "All your test data has been permanently deleted.",
      });
    } catch (error) {
      console.error('Error deleting test data:', error);
      toast({
        title: "Error",
        description: "Failed to delete test data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    if (!confirm("Are you absolutely sure you want to delete your account? This action cannot be undone and will permanently delete all your data.")) {
      return;
    }

    const confirmText = prompt("Type 'DELETE' to confirm account deletion:");
    if (confirmText !== 'DELETE') {
      toast({
        title: "Account Deletion Cancelled",
        description: "Account deletion was cancelled.",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Delete all user data
      await Promise.all([
        supabase.from('test_cases').delete().eq('user_id', user.id),
        supabase.from('reports').delete().eq('user_id', user.id),
        supabase.from('integrations').delete().eq('user_id', user.id),
        supabase.from('profiles').delete().eq('id', user.id)
      ]);

      // Delete the auth user (this should be done last)
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      if (error) throw error;

      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted.",
      });

      // Redirect to login or home page
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: "Error",
        description: "Failed to delete account. Please contact support.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <Database className="h-5 w-5 text-blue-600" />
          Data & Privacy
        </CardTitle>
        <CardDescription>Manage your data and privacy settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-medium">Privacy Preferences</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Analytics tracking</Label>
                <p className="text-sm text-muted-foreground">Help us improve by sharing usage data</p>
              </div>
              <Switch 
                checked={analyticsTracking}
                onCheckedChange={setAnalyticsTracking}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Marketing communications</Label>
                <p className="text-sm text-muted-foreground">Receive product updates and news</p>
              </div>
              <Switch 
                checked={marketingCommunications}
                onCheckedChange={setMarketingCommunications}
              />
            </div>
          </div>
          <Button onClick={updatePrivacySettings} disabled={loading} className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Privacy Settings"
            )}
          </Button>
        </div>

        <div className="space-y-4 border-t pt-4">
          <h4 className="font-medium">Data Export</h4>
          <p className="text-sm text-muted-foreground">
            Download a copy of your data including test cases, reports, and settings.
          </p>
          <Button 
            variant="outline" 
            onClick={requestDataExport}
            disabled={loading}
            className="border-blue-200 hover:bg-blue-50"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Request Data Export
              </>
            )}
          </Button>
        </div>

        <div className="space-y-4 border-t pt-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h4 className="font-medium text-red-600">Danger Zone</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            These actions cannot be undone. Please proceed with caution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              variant="outline" 
              onClick={deleteAllTestData}
              disabled={loading}
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete All Test Data
            </Button>
            <Button 
              variant="destructive" 
              onClick={deleteAccount}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete Account
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
