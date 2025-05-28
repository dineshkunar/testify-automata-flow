import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Settings as SettingsIcon, Bell, Shield, Users, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const [settings, setSettings] = useState({
    company: "Acme Corp",
    timezone: "utc",
    language: "en",
    dateFormat: "mdy",
    autoSave: true,
    darkMode: false,
  });
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully.",
    });
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #2563eb 0%, #FFFFFF 50%, #2563eb 100%)' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-white/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-white/90 text-lg">Manage your account and application preferences</p>
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-1 w-fit">
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="data">Data & Privacy</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="general" className="space-y-6">
            <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-gray-800">General Settings</CardTitle>
                <CardDescription className="text-gray-600">Configure your basic application preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input 
                      id="company" 
                      value={settings.company}
                      onChange={(e) => setSettings({...settings, company: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={settings.timezone} onValueChange={(value) => setSettings({...settings, timezone: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc">UTC</SelectItem>
                        <SelectItem value="est">Eastern Time</SelectItem>
                        <SelectItem value="pst">Pacific Time</SelectItem>
                        <SelectItem value="gmt">GMT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select value={settings.language} onValueChange={(value) => setSettings({...settings, language: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateformat">Date Format</Label>
                    <Select value={settings.dateFormat} onValueChange={(value) => setSettings({...settings, dateFormat: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-save">Auto-save test cases</Label>
                      <p className="text-sm text-muted-foreground">Automatically save changes as you work</p>
                    </div>
                    <Switch 
                      id="auto-save" 
                      checked={settings.autoSave}
                      onCheckedChange={(checked) => setSettings({...settings, autoSave: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="dark-mode">Dark mode</Label>
                      <p className="text-sm text-muted-foreground">Switch to dark theme</p>
                    </div>
                    <Switch 
                      id="dark-mode" 
                      checked={settings.darkMode}
                      onCheckedChange={(checked) => setSettings({...settings, darkMode: checked})}
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleSave}
                  className="bg-gradient-to-r from-pink-600 to-pink-800 hover:from-pink-700 hover:to-pink-900 text-white"
                >
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Choose what notifications you want to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Test execution completed</Label>
                      <p className="text-sm text-muted-foreground">Get notified when test runs finish</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Test failures</Label>
                      <p className="text-sm text-muted-foreground">Immediate alerts for failed tests</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>New team member added</Label>
                      <p className="text-sm text-muted-foreground">When someone joins your team</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Weekly reports</Label>
                      <p className="text-sm text-muted-foreground">Summary of your testing activity</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Integration updates</Label>
                      <p className="text-sm text-muted-foreground">When integrations sync or fail</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <h4 className="font-medium">Notification Channels</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Email notifications</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Slack notifications</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>SMS notifications</Label>
                      <Switch />
                    </div>
                  </div>
                </div>

                <Button>Save Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>Manage your account security and access controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <Button>Update Password</Button>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable 2FA</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <h4 className="font-medium">Session Management</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Current Session</p>
                        <p className="text-sm text-muted-foreground">Chrome on MacOS - Active now</p>
                      </div>
                      <Button variant="outline" size="sm">Current</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Mobile Session</p>
                        <p className="text-sm text-muted-foreground">Safari on iOS - 2 hours ago</p>
                      </div>
                      <Button variant="outline" size="sm">Revoke</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Management
                </CardTitle>
                <CardDescription>Manage team members and their permissions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-4">
                  <Input placeholder="Enter email address" className="flex-1" />
                  <Select defaultValue="viewer">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="qa-lead">QA Lead</SelectItem>
                      <SelectItem value="developer">Developer</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button>Invite</Button>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Team Members</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                          JD
                        </div>
                        <div>
                          <p className="font-medium">John Doe</p>
                          <p className="text-sm text-muted-foreground">john@acme.com</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Admin</Badge>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                          JS
                        </div>
                        <div>
                          <p className="font-medium">Jane Smith</p>
                          <p className="text-sm text-muted-foreground">jane@acme.com</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">QA Lead</Badge>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data & Privacy
                </CardTitle>
                <CardDescription>Manage your data and privacy settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Analytics tracking</Label>
                      <p className="text-sm text-muted-foreground">Help us improve by sharing usage data</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Marketing communications</Label>
                      <p className="text-sm text-muted-foreground">Receive product updates and news</p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <h4 className="font-medium">Data Export</h4>
                  <p className="text-sm text-muted-foreground">
                    Download a copy of your data including test cases, reports, and settings.
                  </p>
                  <Button variant="outline">Request Data Export</Button>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <h4 className="font-medium text-red-600">Danger Zone</h4>
                  <p className="text-sm text-muted-foreground">
                    These actions cannot be undone. Please proceed with caution.
                  </p>
                  <div className="flex gap-4">
                    <Button variant="outline">Delete All Test Data</Button>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
