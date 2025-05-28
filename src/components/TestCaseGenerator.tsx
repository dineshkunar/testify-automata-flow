
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
import { supabase } from "@/integrations/supabase/client";

interface GeneratedTestCase {
  title: string;
  description: string;
  steps: string[];
  expectedResult: string;
  priority: string;
  type: string;
}

export const TestCaseGenerator = () => {
  const [requirements, setRequirements] = useState("");
  const [testType, setTestType] = useState("");
  const [priority, setPriority] = useState("");
  const [environment, setEnvironment] = useState("");
  const [testData, setTestData] = useState("");
  const [includeEdgeCases, setIncludeEdgeCases] = useState(false);
  const [includeNegativeTests, setIncludeNegativeTests] = useState(false);
  const [includePerformance, setIncludePerformance] = useState(false);
  const [includeSecurity, setIncludeSecurity] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTestCases, setGeneratedTestCases] = useState<GeneratedTestCase[]>([]);
  const { toast } = useToast();

  const generateTestCases = async () => {
    if (!requirements || !testType || !priority) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // AI-like test case generation based on requirements
      const baseTestCases: GeneratedTestCase[] = [
        {
          title: `Valid ${requirements} Test`,
          description: `Verify that ${requirements} works correctly with valid inputs`,
          steps: [
            "Navigate to the relevant page/section",
            "Enter valid data as per requirements",
            "Submit/execute the action",
            "Verify successful completion"
          ],
          expectedResult: `${requirements} should complete successfully`,
          priority,
          type: testType
        },
        {
          title: `Invalid Input ${requirements} Test`,
          description: `Verify that ${requirements} handles invalid inputs correctly`,
          steps: [
            "Navigate to the relevant page/section",
            "Enter invalid data",
            "Attempt to submit/execute",
            "Verify appropriate error handling"
          ],
          expectedResult: "System should display appropriate error message",
          priority,
          type: testType
        }
      ];

      let testCases = [...baseTestCases];

      // Add edge cases if requested
      if (includeEdgeCases) {
        testCases.push({
          title: `${requirements} Edge Case Test`,
          description: `Test edge cases for ${requirements}`,
          steps: [
            "Set up edge case scenario",
            "Execute the test with boundary values",
            "Verify system behavior"
          ],
          expectedResult: "System should handle edge cases gracefully",
          priority,
          type: testType
        });
      }

      // Add negative tests if requested
      if (includeNegativeTests) {
        testCases.push({
          title: `${requirements} Negative Test`,
          description: `Verify negative scenarios for ${requirements}`,
          steps: [
            "Set up negative test scenario",
            "Execute with invalid conditions",
            "Verify error handling"
          ],
          expectedResult: "System should fail gracefully with proper error messages",
          priority,
          type: testType
        });
      }

      // Add performance tests if requested
      if (includePerformance) {
        testCases.push({
          title: `${requirements} Performance Test`,
          description: `Verify performance requirements for ${requirements}`,
          steps: [
            "Set up performance monitoring",
            "Execute with expected load",
            "Measure response times",
            "Verify performance criteria"
          ],
          expectedResult: "System should meet performance requirements",
          priority,
          type: "performance"
        });
      }

      // Add security tests if requested
      if (includeSecurity) {
        testCases.push({
          title: `${requirements} Security Test`,
          description: `Verify security aspects of ${requirements}`,
          steps: [
            "Identify security test vectors",
            "Execute security tests",
            "Verify authentication/authorization",
            "Check for vulnerabilities"
          ],
          expectedResult: "System should be secure against common vulnerabilities",
          priority,
          type: "security"
        });
      }

      setGeneratedTestCases(testCases);

      toast({
        title: "Test Cases Generated!",
        description: `Successfully generated ${testCases.length} test cases`,
      });
    } catch (error) {
      console.error('Error generating test cases:', error);
      toast({
        title: "Error",
        description: "Failed to generate test cases",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveTestCasesToDatabase = async () => {
    if (generatedTestCases.length === 0) {
      toast({
        title: "No Test Cases",
        description: "Please generate test cases first",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to save test cases",
          variant: "destructive",
        });
        return;
      }

      const testCasesToInsert = generatedTestCases.map(tc => ({
        title: tc.title,
        description: tc.description,
        type: tc.type,
        priority: tc.priority,
        steps: JSON.stringify(tc.steps),
        expected_result: tc.expectedResult,
        environment: environment || 'Web',
        test_data: testData || 'Standard test data',
        user_id: user.id,
        status: 'todo'
      }));

      const { error } = await supabase
        .from('test_cases')
        .insert(testCasesToInsert);

      if (error) throw error;

      toast({
        title: "Test Cases Saved",
        description: `${generatedTestCases.length} test cases saved to database`,
      });

      // Reset form
      setRequirements("");
      setTestType("");
      setPriority("");
      setEnvironment("");
      setTestData("");
      setGeneratedTestCases([]);
      setIncludeEdgeCases(false);
      setIncludeNegativeTests(false);
      setIncludePerformance(false);
      setIncludeSecurity(false);
    } catch (error) {
      console.error('Error saving test cases:', error);
      toast({
        title: "Error",
        description: "Failed to save test cases to database",
        variant: "destructive",
      });
    }
  };

  const exportTestCases = () => {
    if (generatedTestCases.length === 0) return;
    
    const exportData = {
      generatedAt: new Date().toISOString(),
      requirements,
      testType,
      priority,
      testCases: generatedTestCases
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `generated_test_cases_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Complete",
      description: "Test cases exported successfully",
    });
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
                <Label htmlFor="requirements">Requirements/User Story *</Label>
                <Textarea
                  id="requirements"
                  placeholder="Describe the feature or user story you want to test..."
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  className="min-h-32"
                />
              </div>

              <div>
                <Label htmlFor="test-type">Test Type *</Label>
                <Select value={testType} onValueChange={setTestType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select test type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="smoke">Smoke Tests</SelectItem>
                    <SelectItem value="regression">Regression Tests</SelectItem>
                    <SelectItem value="integration">Integration Tests</SelectItem>
                    <SelectItem value="unit">Unit Tests</SelectItem>
                    <SelectItem value="e2e">End-to-End Tests</SelectItem>
                    <SelectItem value="functional">Functional Tests</SelectItem>
                    <SelectItem value="whitebox">White-box Tests</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority">Priority Level *</Label>
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
                    <Checkbox 
                      id="edge-cases" 
                      checked={includeEdgeCases}
                      onCheckedChange={setIncludeEdgeCases}
                    />
                    <Label htmlFor="edge-cases">Include edge cases</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="negative-tests" 
                      checked={includeNegativeTests}
                      onCheckedChange={setIncludeNegativeTests}
                    />
                    <Label htmlFor="negative-tests">Generate negative test cases</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="performance" 
                      checked={includePerformance}
                      onCheckedChange={setIncludePerformance}
                    />
                    <Label htmlFor="performance">Include performance tests</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="security" 
                      checked={includeSecurity}
                      onCheckedChange={setIncludeSecurity}
                    />
                    <Label htmlFor="security">Add security test cases</Label>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="environment">Test Environment</Label>
                <Input
                  id="environment"
                  placeholder="e.g., Chrome, Firefox, Mobile"
                  value={environment}
                  onChange={(e) => setEnvironment(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="test-data">Test Data Requirements</Label>
                <Textarea
                  id="test-data"
                  placeholder="Specify any test data requirements..."
                  className="min-h-20"
                  value={testData}
                  onChange={(e) => setTestData(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              onClick={generateTestCases} 
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
      {generatedTestCases.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Generated Test Cases ({generatedTestCases.length})
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={exportTestCases}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button size="sm" onClick={saveTestCasesToDatabase}>
                  Save to Database
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {generatedTestCases.map((testCase, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">{testCase.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Description:</strong> {testCase.description}
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Steps:</strong>
                  </p>
                  <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1 mb-2">
                    {testCase.steps.map((step, stepIndex) => (
                      <li key={stepIndex}>{step}</li>
                    ))}
                  </ol>
                  <p className="text-sm text-muted-foreground">
                    <strong>Expected Result:</strong> {testCase.expectedResult}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
