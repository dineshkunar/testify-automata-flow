
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TestCase {
  id: string;
  title: string;
  description: string;
  type: string;
  priority: string;
  status: string;
  steps: string;
  expected_result: string;
  environment: string;
  test_data: string;
}

export const TestCaseManager = () => {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    priority: "",
    steps: "",
    expected_result: "",
    environment: "",
    test_data: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTestCases();
  }, []);

  const fetchTestCases = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('test_cases')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTestCases(data || []);
    } catch (error) {
      console.error('Error fetching test cases:', error);
      toast({
        title: "Error",
        description: "Failed to fetch test cases",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.type || !formData.priority) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('test_cases')
        .insert([{
          ...formData,
          user_id: user.id,
          status: 'todo'
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Test case created successfully!",
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        type: "",
        priority: "",
        steps: "",
        expected_result: "",
        environment: "",
        test_data: ""
      });

      fetchTestCases();
    } catch (error) {
      console.error('Error creating test case:', error);
      toast({
        title: "Error",
        description: "Failed to create test case",
        variant: "destructive",
      });
    }
  };

  const updateTestCaseStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('test_cases')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Test case status updated!",
      });

      fetchTestCases();
    } catch (error) {
      console.error('Error updating test case:', error);
      toast({
        title: "Error",
        description: "Failed to update test case",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading test cases...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
        <CardHeader>
          <CardTitle>Create New Test Case</CardTitle>
          <CardDescription>Add a new test case to your project</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter test case title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Test Type *</Label>
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
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Describe what this test case validates"
              />
            </div>

            <Button type="submit" className="w-full">Create Test Case</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
        <CardHeader>
          <CardTitle>Test Cases ({testCases.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {testCases.map((testCase) => (
              <div key={testCase.id} className="p-4 border rounded-lg bg-white/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{testCase.title}</h4>
                    <p className="text-sm text-muted-foreground">{testCase.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Select value={testCase.status} onValueChange={(value) => updateTestCaseStatus(testCase.id, value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="testing">Testing</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
