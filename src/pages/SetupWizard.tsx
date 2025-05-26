
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ArrowRight, ArrowLeft, Puzzle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SetupWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedIntegration, setSelectedIntegration] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [serverUrl, setServerUrl] = useState("");
  const [projectId, setProjectId] = useState("");
  const { toast } = useToast();

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    toast({
      title: "Setup Complete",
      description: `${selectedIntegration} integration has been configured successfully.`,
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select Integration</h3>
            <p className="text-muted-foreground">Choose which integration you'd like to set up</p>
            <Select value={selectedIntegration} onValueChange={setSelectedIntegration}>
              <SelectTrigger>
                <SelectValue placeholder="Select an integration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jira">Jira</SelectItem>
                <SelectItem value="github">GitHub Actions</SelectItem>
                <SelectItem value="slack">Slack</SelectItem>
                <SelectItem value="jenkins">Jenkins</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Authentication</h3>
            <p className="text-muted-foreground">Provide your authentication credentials</p>
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="Enter your API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Configuration</h3>
            <p className="text-muted-foreground">Configure the connection settings</p>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="server-url">Server URL</Label>
                <Input
                  id="server-url"
                  placeholder="https://your-instance.atlassian.net"
                  value={serverUrl}
                  onChange={(e) => setServerUrl(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-id">Project ID</Label>
                <Input
                  id="project-id"
                  placeholder="Enter project identifier"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h3 className="text-lg font-semibold">Setup Complete!</h3>
            <p className="text-muted-foreground">
              Your {selectedIntegration} integration is now ready to use. You can start syncing your test cases and data.
            </p>
          </div>
        );
    }
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
              Integration Setup Wizard
            </h1>
            <p className="text-white/90 text-lg">Step-by-step integration configuration</p>
          </div>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0 max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Puzzle className="h-5 w-5 text-pink-600" />
              Step {currentStep} of {totalSteps}
            </CardTitle>
            <CardDescription>
              <Progress value={progress} className="mt-2" />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderStep()}

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="border-gray-200 hover:bg-gray-50"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  onClick={handleNext}
                  disabled={currentStep === 1 && !selectedIntegration}
                  className="bg-gradient-to-r from-pink-600 to-pink-800 hover:from-pink-700 hover:to-pink-900 text-white"
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleFinish}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                >
                  Finish Setup
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SetupWizard;
