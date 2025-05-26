
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Puzzle, Github, Calendar, Trello, TestTube, Zap, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

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
  const [integrationStates, setIntegrationStates] = useState(integrations);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleConnect = (name: string) => {
    setIntegrationStates(prev => 
      prev.map(integration => 
        integration.name === name 
          ? { ...integration, connected: true }
          : integration
      )
    );
    toast({
      title: "Integration Connected",
      description: `${name} has been connected successfully.`,
    });
  };

  const handleDisconnect = (name: string) => {
    setIntegrationStates(prev => 
      prev.map(integration => 
        integration.name === name 
          ? { ...integration, connected: false }
          : integration
      )
    );
    toast({
      title: "Integration Disconnected",
      description: `${name} has been disconnected.`,
    });
  };

  const handleConfigure = (name: string) => {
    toast({
      title: "Configuration",
      description: `Opening configuration for ${name}...`,
    });
  };

  const handleStartWizard = () => {
    navigate('/setup-wizard');
  };

  const handleViewDocumentation = () => {
    navigate('/integration-docs');
  };

  const handleBrowseMarketplace = () => {
    navigate('/marketplace');
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #970747 0%, #FFFFFF 50%, #970747 100%)' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-white/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-pink-100 bg-clip-text text-transparent">
              Integrations
            </h1>
            <p className="text-white/90 text-lg">Connect TestFlow Pro with your existing tools and workflows</p>
          </div>
          <Button 
            onClick={handleBrowseMarketplace}
            className="bg-gradient-to-r from-pink-600 to-pink-800 hover:from-pink-700 hover:to-pink-900 text-white"
          >
            Browse Marketplace
          </Button>
        </div>

        {/* Integration Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrationStates.map((integration) => (
            <Card key={integration.name} className="relative bg-white/90 backdrop-blur-sm shadow-xl border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-pink-700 shadow-lg">
                      <integration.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-gray-800">{integration.name}</CardTitle>
                      <Badge variant="outline" className="text-xs mt-1 border-pink-200 text-pink-600">
                        {integration.category}
                      </Badge>
                    </div>
                  </div>
                  <Switch 
                    checked={integration.connected}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handleConnect(integration.name);
                      } else {
                        handleDisconnect(integration.name);
                      }
                    }}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4 text-gray-600">
                  {integration.description}
                </CardDescription>
                <div className="flex gap-2">
                  {integration.connected ? (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleConfigure(integration.name)}
                        className="border-gray-200 hover:bg-gray-50"
                      >
                        Configure
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDisconnect(integration.name)}
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <Button 
                      size="sm"
                      onClick={() => handleConnect(integration.name)}
                      className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white border-0"
                    >
                      Connect
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Setup Wizard */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Puzzle className="h-5 w-5 text-pink-600" />
              Integration Setup Wizard
            </CardTitle>
            <CardDescription className="text-gray-600">
              Need help setting up integrations? Our wizard will guide you through the process.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button 
                onClick={handleStartWizard}
                className="bg-gradient-to-r from-pink-600 to-pink-800 hover:from-pink-700 hover:to-pink-900 text-white"
              >
                Start Setup Wizard
              </Button>
              <Button 
                variant="outline" 
                onClick={handleViewDocumentation}
                className="border-pink-200 text-pink-600 hover:bg-pink-50"
              >
                View Documentation
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Connected Services Status */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-gray-800">Integration Status</CardTitle>
            <CardDescription className="text-gray-600">Monitor the health of your connected services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {integrationStates.filter(i => i.connected).map(integration => (
                <div key={integration.name} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gradient-to-r from-green-50 to-blue-50">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-gray-800">{integration.name} Integration</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Last sync: {Math.floor(Math.random() * 10) + 1} minutes ago
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Integrations;
