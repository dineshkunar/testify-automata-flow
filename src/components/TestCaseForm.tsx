
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TestCaseFormProps {
  onSuccess?: () => void;
}

const TestCaseForm = ({ onSuccess }: TestCaseFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    priority: '',
    expected_result: '',
    environment: '',
    test_data: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.type || !formData.priority) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('test_cases')
        .insert([formData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Test case created successfully!",
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        type: '',
        priority: '',
        expected_result: '',
        environment: '',
        test_data: ''
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error creating test case:', error);
      toast({
        title: "Error",
        description: "Failed to create test case.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Test Case</CardTitle>
        <CardDescription>Add a new test case to your testing suite</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Enter test case title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe what this test case does"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
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
              <Label>Priority *</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
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

          <div className="space-y-2">
            <Label htmlFor="expected_result">Expected Result</Label>
            <Textarea
              id="expected_result"
              value={formData.expected_result}
              onChange={(e) => setFormData({...formData, expected_result: e.target.value})}
              placeholder="What should happen when this test passes"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="environment">Environment</Label>
              <Input
                id="environment"
                value={formData.environment}
                onChange={(e) => setFormData({...formData, environment: e.target.value})}
                placeholder="Test environment (e.g., staging, production)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="test_data">Test Data</Label>
              <Input
                id="test_data"
                value={formData.test_data}
                onChange={(e) => setFormData({...formData, test_data: e.target.value})}
                placeholder="Required test data"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Test Case"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setFormData({
                title: '',
                description: '',
                type: '',
                priority: '',
                expected_result: '',
                environment: '',
                test_data: ''
              })}
            >
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TestCaseForm;
