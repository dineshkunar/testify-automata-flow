
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Puzzle, Github, Calendar, Trello, TestTube, Zap, Settings } from "lucide-react";

const integrations = [
  {
    name: "Jira",
    description: "Sync test cases with Jira tickets and issues",
    icon: Calendar,
    connected: true,
    category: "Project Management"
  },
  {
    name: "Trello",
    description: "Create and update Trello cards from test cases",
    icon: Trello,
    connected: false,
    category: "Project Management"
  },
  {
    name: "GitHub Actions",
    description: "Trigger test execution in CI/CD pipeline",
    icon: Github,
    connected: true,
    category: "CI/CD"
  },
  {
    name: "TestRail",
    description: "Sync with TestRail test management platform",
    icon: TestTube,
    connected: false,
    category: "Testing Tools"
  },
  {
    name: "Jenkins",
    description: "Integrate with Jenkins build automation",
    icon: Settings,
    connected: true,
    category: "CI/CD"
  },
  {
    name: "Slack",
    description: "Get notifications and updates in Slack",
    icon: Zap,
    connected: false,
    category: "Communication"
  }
];

const Integrations = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Integrations</h1>
          <p className="text-muted-foreground">Connect TestFlow Pro with your existing tools and workflows</p>
        </div>
        <Button>Browse Marketplace</Button>
      </div>

      {/* Integration Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => (
          <Card key={integration.name} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <integration.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    <Badge variant="outline" className="text-xs mt-1">
                      {integration.category}
                    </Badge>
                  </div>
                </div>
                <Switch checked={integration.connected} />
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                {integration.description}
              </CardDescription>
              <div className="flex gap-2">
                {integration.connected ? (
                  <>
                    <Button variant="outline" size="sm">Configure</Button>
                    <Button variant="outline" size="sm">Disconnect</Button>
                  </>
                ) : (
                  <Button size="sm">Connect</Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Setup Wizard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Puzzle className="h-5 w-5" />
            Integration Setup Wizard
          </CardTitle>
          <CardDescription>
            Need help setting up integrations? Our wizard will guide you through the process.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button>Start Setup Wizard</Button>
            <Button variant="outline">View Documentation</Button>
          </div>
        </CardContent>
      </Card>

      {/* Connected Services Status */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Status</CardTitle>
          <CardDescription>Monitor the health of your connected services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="font-medium">Jira Integration</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Last sync: 5 minutes ago
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="font-medium">GitHub Actions</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Last sync: 2 minutes ago
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="font-medium">Jenkins</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Last sync: 1 minute ago
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Integrations;
