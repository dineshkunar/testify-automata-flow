
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, ExternalLink, Code, Settings, Github, Calendar } from "lucide-react";

const IntegrationDocs = () => {
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
              Integration Documentation
            </h1>
            <p className="text-white/90 text-lg">Complete guides for setting up integrations</p>
          </div>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Book className="h-5 w-5 text-pink-600" />
              Available Integrations
            </CardTitle>
            <CardDescription>Choose an integration to view its documentation</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="jira" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="jira">Jira</TabsTrigger>
                <TabsTrigger value="github">GitHub</TabsTrigger>
                <TabsTrigger value="slack">Slack</TabsTrigger>
                <TabsTrigger value="jenkins">Jenkins</TabsTrigger>
              </TabsList>

              <TabsContent value="jira" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Jira Integration
                    </CardTitle>
                    <CardDescription>Connect TestFlow Pro with Atlassian Jira</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Prerequisites</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Jira Cloud or Server instance</li>
                        <li>Admin access to create API tokens</li>
                        <li>Project permissions in Jira</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Setup Steps</h4>
                      <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Generate an API token in your Jira account settings</li>
                        <li>Copy your Jira instance URL</li>
                        <li>Run the integration setup wizard</li>
                        <li>Test the connection</li>
                      </ol>
                    </div>
                    <Button variant="outline" className="w-full">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Full Documentation
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="github" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Github className="h-5 w-5" />
                      GitHub Actions Integration
                    </CardTitle>
                    <CardDescription>Automate test execution with GitHub Actions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Prerequisites</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>GitHub repository with Actions enabled</li>
                        <li>Personal access token or GitHub App</li>
                        <li>Workflow configuration permissions</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Sample Workflow</h4>
                      <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                        <Code className="inline mr-2 h-4 w-4" />
                        name: TestFlow Integration
                        <br />
                        on: [push, pull_request]
                        <br />
                        jobs: ...
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Full Documentation
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="slack" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Slack Integration
                    </CardTitle>
                    <CardDescription>Get test notifications in Slack channels</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Features</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Real-time test failure notifications</li>
                        <li>Daily test summary reports</li>
                        <li>Interactive test result updates</li>
                        <li>Custom channel configurations</li>
                      </ul>
                    </div>
                    <Button variant="outline" className="w-full">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Full Documentation
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="jenkins" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Jenkins Integration
                    </CardTitle>
                    <CardDescription>Trigger tests from Jenkins pipelines</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Capabilities</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Automated test execution on builds</li>
                        <li>Test result publishing</li>
                        <li>Pipeline integration</li>
                        <li>Build artifact management</li>
                      </ul>
                    </div>
                    <Button variant="outline" className="w-full">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Full Documentation
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IntegrationDocs;
