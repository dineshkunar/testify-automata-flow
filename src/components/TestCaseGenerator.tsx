
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Wand2, FileText, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const TestCaseGenerator = () => {
  const [requirements, setRequirements] = useState("");
  const [testType, setTestType] = useState("");
  const [priority, setPriority] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!requirements || !testType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "Test Cases Generated!",
        description: "Successfully generated 12 test cases based on your requirements",
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            AI Test Case Generator
          </CardTitle>
          <CardDescription>
            Generate comprehensive test cases automatically from your requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="requirements">Requirements/User Story</Label>
                <Textarea
                  id="requirements"
                  placeholder="Describe the feature or user story you want to test..."
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  className="min-h-32"
                />
              </div>

              <div>
                <Label htmlFor="test-type">Test Type</Label>
                <Select value={testType} onValueChange={setTestType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select test type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="smoke">Smoke Tests</SelectItem>
                    <SelectItem value="regression">Regression Tests</SelectItem>
                    <SelectItem value="integration">Integration Tests</SelectItem>
                    <SelectItem value="whitebox">White-box Tests</SelectItem>
                    <SelectItem value="functional">Functional Tests</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority">Priority Level</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Additional Options</Label>
                <div className="space-y-3 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="edge-cases" />
                    <Label htmlFor="edge-cases">Include edge cases</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="negative-tests" />
                    <Label htmlFor="negative-tests">Generate negative test cases</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="performance" />
                    <Label htmlFor="performance">Include performance tests</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="security" />
                    <Label htmlFor="security">Add security test cases</Label>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="environment">Test Environment</Label>
                <Input
                  id="environment"
                  placeholder="e.g., Chrome, Firefox, Mobile"
                />
              </div>

              <div>
                <Label htmlFor="test-data">Test Data Requirements</Label>
                <Textarea
                  id="test-data"
                  placeholder="Specify any test data requirements..."
                  className="min-h-20"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating}
              className="flex-1"
            >
              {isGenerating ? "Generating..." : "Generate Test Cases"}
              <Wand2 className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Test Cases Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Generated Test Cases
            </span>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">TC001: Valid User Login</h4>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Description:</strong> Verify that a user can successfully log in with valid credentials
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Steps:</strong>
              </p>
              <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
                <li>Navigate to login page</li>
                <li>Enter valid username</li>
                <li>Enter valid password</li>
                <li>Click login button</li>
                <li>Verify successful login and redirection</li>
              </ol>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">TC002: Invalid Password Login</h4>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Description:</strong> Verify that login fails with invalid password
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Steps:</strong>
              </p>
              <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
                <li>Navigate to login page</li>
                <li>Enter valid username</li>
                <li>Enter invalid password</li>
                <li>Click login button</li>
                <li>Verify error message is displayed</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
