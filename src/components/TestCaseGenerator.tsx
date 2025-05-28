
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Wand2, Download, Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const TestCaseGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [testType, setTestType] = useState("");
  const [priority, setPriority] = useState("");
  const [environment, setEnvironment] = useState("");
  const [includeSteps, setIncludeSteps] = useState(true);
  const [includeExpected, setIncludeExpected] = useState(true);
  const [includePreconditions, setIncludePreconditions] = useState(false);
  const [includeTestData, setIncludeTestData] = useState(false);
  const [generatedTests, setGeneratedTests] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const generateTestCases = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a description for test case generation",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate AI generation with realistic test cases
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockTestCases = [
        {
          title: `Verify ${prompt} - Happy Path`,
          description: `Test the main functionality of ${prompt} with valid inputs`,
          type: testType || "functional",
          priority: priority || "medium",
          environment: environment || "staging",
          steps: includeSteps ? [
            "Navigate to the application",
            "Enter valid test data",
            "Submit the form",
            "Verify the result"
          ] : [],
          expected_result: includeExpected ? "The system should process the request successfully and display the expected outcome" : "",
          test_data: includeTestData ? "Valid test data set 1" : "",
        },
        {
          title: `Verify ${prompt} - Error Handling`,
          description: `Test error scenarios for ${prompt}`,
          type: testType || "negative",
          priority: priority || "high",
          environment: environment || "staging",
          steps: includeSteps ? [
            "Navigate to the application",
            "Enter invalid test data",
            "Submit the form",
            "Verify error handling"
          ] : [],
          expected_result: includeExpected ? "The system should display appropriate error messages and handle the error gracefully" : "",
          test_data: includeTestData ? "Invalid test data set 1" : "",
        }
      ];

      setGeneratedTests(mockTestCases);
      toast({
        title: "Success",
        description: `Generated ${mockTestCases.length} test cases successfully!`,
      });
    } catch (error) {
      console.error('Error generating test cases:', error);
      toast({
        title: "Error",
        description: "Failed to generate test cases. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveTestCases = async () => {
    if (generatedTests.length === 0) {
      toast({
        title: "Error",
        description: "No test cases to save",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const testCasesToInsert = generatedTests.map(testCase => ({
        ...testCase,
        user_id: user.id,
        status: 'todo'
      }));

      const { error } = await supabase
        .from('test_cases')
        .insert(testCasesToInsert);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Saved ${generatedTests.length} test cases to database!`,
      });
      
      // Clear generated tests after saving
      setGeneratedTests([]);
      setPrompt("");
    } catch (error) {
      console.error('Error saving test cases:', error);
      toast({
        title: "Error",
        description: "Failed to save test cases. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const exportTestCases = () => {
    if (generatedTests.length === 0) {
      toast({
        title: "Error",
        description: "No test cases to export",
        variant: "destructive",
      });
      return;
    }

    const csvContent = [
      ['Title', 'Description', 'Type', 'Priority', 'Environment', 'Steps', 'Expected Result', 'Test Data'],
      ...generatedTests.map(tc => [
        tc.title,
        tc.description,
        tc.type,
        tc.priority,
        tc.environment,
        tc.steps.join('; '),
        tc.expected_result,
        tc.test_data
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-test-cases.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Test cases exported successfully!",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Wand2 className="h-5 w-5 text-purple-600" />
            AI Test Case Generator
          </CardTitle>
          <CardDescription>Generate comprehensive test cases using AI based on your requirements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prompt">Feature/Functionality Description</Label>
              <Textarea
                id="prompt"
                placeholder="Describe the feature or functionality you want to test (e.g., 'User login with email and password')"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-20"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Test Type</Label>
                <Select value={testType} onValueChange={setTestType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="functional">Functional</SelectItem>
                    <SelectItem value="smoke">Smoke</SelectItem>
                    <SelectItem value="regression">Regression</SelectItem>
                    <SelectItem value="integration">Integration</SelectItem>
                    <SelectItem value="negative">Negative</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
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

              <div className="space-y-2">
                <Label>Environment</Label>
                <Select value={environment} onValueChange={setEnvironment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select environment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="staging">Staging</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Include in Generated Test Cases:</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="include-steps" 
                    checked={includeSteps} 
                    onCheckedChange={(checked) => setIncludeSteps(checked === true)}
                  />
                  <Label htmlFor="include-steps">Detailed Test Steps</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="include-expected" 
                    checked={includeExpected} 
                    onCheckedChange={(checked) => setIncludeExpected(checked === true)}
                  />
                  <Label htmlFor="include-expected">Expected Results</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="include-preconditions" 
                    checked={includePreconditions} 
                    onCheckedChange={(checked) => setIncludePreconditions(checked === true)}
                  />
                  <Label htmlFor="include-preconditions">Preconditions</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="include-testdata" 
                    checked={includeTestData} 
                    onCheckedChange={(checked) => setIncludeTestData(checked === true)}
                  />
                  <Label htmlFor="include-testdata">Test Data</Label>
                </div>
              </div>
            </div>

            <Button 
              onClick={generateTestCases} 
              disabled={isGenerating || !prompt.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Test Cases...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Test Cases
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {generatedTests.length > 0 && (
        <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-gray-800">Generated Test Cases</CardTitle>
            <CardDescription>Review and save the generated test cases</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 mb-4">
              <Button onClick={saveTestCases} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save to Database
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={exportTestCases}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>

            <div className="space-y-4">
              {generatedTests.map((testCase, index) => (
                <Card key={index} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-800">{testCase.title}</h4>
                        <div className="flex gap-2">
                          <Badge variant="outline">{testCase.type}</Badge>
                          <Badge variant="secondary">{testCase.priority}</Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600">{testCase.description}</p>
                      
                      {testCase.steps && testCase.steps.length > 0 && (
                        <div>
                          <h5 className="font-medium text-sm mb-2">Test Steps:</h5>
                          <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                            {testCase.steps.map((step: string, stepIndex: number) => (
                              <li key={stepIndex}>{step}</li>
                            ))}
                          </ol>
                        </div>
                      )}
                      
                      {testCase.expected_result && (
                        <div>
                          <h5 className="font-medium text-sm mb-1">Expected Result:</h5>
                          <p className="text-sm text-gray-600">{testCase.expected_result}</p>
                        </div>
                      )}
                      
                      {testCase.test_data && (
                        <div>
                          <h5 className="font-medium text-sm mb-1">Test Data:</h5>
                          <p className="text-sm text-gray-600">{testCase.test_data}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
