
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TestTube2, Plus, Search, Filter } from "lucide-react";
import { TestCaseGenerator } from "@/components/TestCaseGenerator";
import { TestCaseKanban } from "@/components/TestCaseKanban";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const TestCases = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFilter = () => {
    navigate('/filter-test-cases');
  };

  const handleNewTestCase = () => {
    toast({
      title: "Create Test Case",
      description: "Opening new test case form...",
    });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Test Cases</h1>
          <p className="text-muted-foreground">Manage and track all your test cases</p>
        </div>
        <Button onClick={handleNewTestCase}>
          <Plus className="mr-2 h-4 w-4" />
          New Test Case
        </Button>
      </div>

      <Tabs defaultValue="kanban" className="space-y-6">
        <TabsList>
          <TabsTrigger value="kanban">Kanban View</TabsTrigger>
          <TabsTrigger value="generator">Test Generator</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="kanban">
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search test cases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Button variant="outline" onClick={handleFilter}>
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
          <TestCaseKanban />
        </TabsContent>

        <TabsContent value="generator">
          <TestCaseGenerator />
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>All Test Cases</CardTitle>
              <CardDescription>Complete list of test cases with detailed information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Test Case Items */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <TestTube2 className="h-5 w-5 text-primary" />
                    <div>
                      <h4 className="font-medium">User Login Functionality</h4>
                      <p className="text-sm text-muted-foreground">Verify user can log in with valid credentials</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Smoke Test</Badge>
                    <Badge variant="outline">Passed</Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <TestTube2 className="h-5 w-5 text-primary" />
                    <div>
                      <h4 className="font-medium">Payment Processing</h4>
                      <p className="text-sm text-muted-foreground">Test payment gateway integration</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Integration</Badge>
                    <Badge variant="destructive">Failed</Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <TestTube2 className="h-5 w-5 text-primary" />
                    <div>
                      <h4 className="font-medium">Database Connection</h4>
                      <p className="text-sm text-muted-foreground">Verify database connectivity and queries</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">White-box</Badge>
                    <Badge>In Progress</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TestCases;
