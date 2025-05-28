
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface TestCaseFormProps {
  onSuccess?: () => void;
}

export const TestCaseForm = ({ onSuccess }: TestCaseFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [priority, setPriority] = useState("");
  const [steps, setSteps] = useState("");
  const [expectedResult, setExpectedResult] = useState("");
  const [environment, setEnvironment] = useState("");
  const [testData, setTestData] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !type || !priority) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Test Case Created",
        description: `Test case "${title}" has been created successfully.`,
      });

      // Reset form
      setTitle("");
      setDescription("");
      setType("");
      setPriority("");
      setSteps("");
      setExpectedResult("");
      setEnvironment("");
      setTestData("");

      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create test case. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Test Case</CardTitle>
        <CardDescription>Add a new test case to your project</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter test case title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Test Type *</Label>
              <Select value={type} onValueChange={setType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select test type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="smoke">Smoke Test</SelectItem>
                  <SelectItem value="regression">Regression Test</SelectItem>
                  <SelectItem value="integration">Integration Test</SelectItem>
                  <SelectItem value="unit">Unit Test</SelectItem>
                  <SelectItem value="e2e">End-to-End Test</SelectItem>
                  <SelectItem value="functional">Functional Test</SelectItem>
                  <SelectItem value="whitebox">White-box Test</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority *</Label>
              <Select value={priority} onValueChange={setPriority} required>
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
              <Label htmlFor="environment">Test Environment</Label>
              <Input
                id="environment"
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
                placeholder="e.g., Chrome, Firefox, Mobile"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this test case validates"
              className="min-h-24"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="steps">Test Steps</Label>
            <Textarea
              id="steps"
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              placeholder="1. Step one&#10;2. Step two&#10;3. Step three"
              className="min-h-32"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedResult">Expected Result</Label>
            <Textarea
              id="expectedResult"
              value={expectedResult}
              onChange={(e) => setExpectedResult(e.target.value)}
              placeholder="Describe the expected outcome"
              className="min-h-24"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="testData">Test Data Requirements</Label>
            <Textarea
              id="testData"
              value={testData}
              onChange={(e) => setTestData(e.target.value)}
              placeholder="Specify any test data requirements"
              className="min-h-20"
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Creating..." : "Create Test Case"}
            </Button>
            <Button type="button" variant="outline" onClick={() => {
              setTitle("");
              setDescription("");
              setType("");
              setPriority("");
              setSteps("");
              setExpectedResult("");
              setEnvironment("");
              setTestData("");
            }}>
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
