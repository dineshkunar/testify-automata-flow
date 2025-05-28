
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, Loader2, Mail, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar: string;
  joinedAt: string;
}

export const SettingsTeam = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      email: "john@acme.com",
      name: "John Doe",
      role: "admin",
      avatar: "JD",
      joinedAt: "2024-01-15"
    },
    {
      id: "2",
      email: "jane@acme.com",
      name: "Jane Smith",
      role: "qa-lead",
      avatar: "JS",
      joinedAt: "2024-01-20"
    }
  ]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const inviteTeamMember = async () => {
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    if (!email.includes('@')) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newMember: TeamMember = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0],
        role,
        avatar: email.substring(0, 2).toUpperCase(),
        joinedAt: new Date().toISOString().split('T')[0]
      };

      setTeamMembers([...teamMembers, newMember]);
      setEmail("");
      setRole("viewer");

      toast({
        title: "Invitation Sent",
        description: `Invitation sent to ${email} successfully!`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invitation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeTeamMember = (memberId: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== memberId));
    toast({
      title: "Member Removed",
      description: "Team member has been removed successfully.",
    });
  };

  const updateMemberRole = async (memberId: string, newRole: string) => {
    setTeamMembers(teamMembers.map(member => 
      member.id === memberId ? { ...member, role: newRole } : member
    ));
    
    toast({
      title: "Role Updated",
      description: "Team member role has been updated successfully.",
    });
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'default';
      case 'qa-lead': return 'secondary';
      case 'developer': return 'outline';
      case 'viewer': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <Users className="h-5 w-5 text-blue-600" />
          Team Management
        </CardTitle>
        <CardDescription>Manage team members and their permissions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-medium">Invite New Member</h4>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input 
                placeholder="Enter email address" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Select value={role} onValueChange={setRole}>
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
            <Button onClick={inviteTeamMember} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Inviting...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Invite
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-4 border-t pt-4">
          <h4 className="font-medium">Team Members ({teamMembers.length})</h4>
          <div className="space-y-2">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {member.avatar}
                  </div>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                    <p className="text-xs text-muted-foreground">Joined {member.joinedAt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Select 
                    value={member.role} 
                    onValueChange={(newRole) => updateMemberRole(member.id, newRole)}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="qa-lead">QA Lead</SelectItem>
                      <SelectItem value="developer">Developer</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => removeTeamMember(member.id)}
                    disabled={member.role === 'admin'}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 border-t pt-4">
          <h4 className="font-medium">Role Permissions</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="default">Admin</Badge>
                <span>Full access to all features</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">QA Lead</Badge>
                <span>Manage test cases and reports</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Developer</Badge>
                <span>Create and execute tests</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Viewer</Badge>
                <span>View tests and reports only</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
