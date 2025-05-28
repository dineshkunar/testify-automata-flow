
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TestTube2, Plus, Filter } from "lucide-react";
import { TestCaseGenerator } from "@/components/TestCaseGenerator";
import { TestCaseKanban } from "@/components/TestCaseKanban";
import { TestCaseForm } from "@/components/TestCaseForm";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const TestCases = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewForm, setShowNewForm] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFilter = () => {
    navigate('/filter-test-cases');
  };

  const handleNewTestCase = () => {
    setShowNewForm(true);
  };

  const handleFormSuccess = () => {
    setShowNewForm(false);
    toast({
      title: "Success",
      description: "Test case created successfully!",
    });
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #970747 0%, #FFFFFF 50%, #970747 100%)' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-white/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-pink-100 bg-clip-text text-transparent">
              Test Cases
            </h1>
            <p className="text-white/90 text-lg">Manage and track all your test cases</p>
          </div>
          <Button 
            onClick={handleNewTestCase}
            className="bg-gradient-to-r from-pink-600 to-pink-800 hover:from-pink-700 hover:to-pink-900 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Test Case
          </Button>
        </div>

        {showNewForm ? (
          <div className="mb-6">
            <TestCaseForm onSuccess={handleFormSuccess} />
            <div className="mt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowNewForm(false)}
                className="bg-white/90 hover:bg-white"
              >
                Back to Test Cases
              </Button>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="kanban" className="space-y-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-1 w-fit">
              <TabsList>
                <TabsTrigger value="kanban">Kanban View</TabsTrigger>
                <TabsTrigger value="generator">Test Generator</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="kanban">
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Search test cases..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm bg-white/90 backdrop-blur-sm"
                  />
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleFilter}
                  className="bg-white/90 hover:bg-white backdrop-blur-sm"
                >
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
              <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="text-gray-800">All Test Cases</CardTitle>
                  <CardDescription className="text-gray-600">Complete list of test cases with detailed information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                      <div className="flex items-center gap-4">
                        <TestTube2 className="h-5 w-5 text-primary" />
                        <div>
                          <h4 className="font-medium text-gray-800">User Login Functionality</h4>
                          <p className="text-sm text-gray-600">Verify user can log in with valid credentials</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Smoke Test</Badge>
                        <Badge variant="outline">Passed</Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
                      <div className="flex items-center gap-4">
                        <TestTube2 className="h-5 w-5 text-primary" />
                        <div>
                          <h4 className="font-medium text-gray-800">Payment Processing</h4>
                          <p className="text-sm text-gray-600">Test payment gateway integration</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Integration</Badge>
                        <Badge variant="destructive">Failed</Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50">
                      <div className="flex items-center gap-4">
                        <TestTube2 className="h-5 w-5 text-primary" />
                        <div>
                          <h4 className="font-medium text-gray-800">Database Connection</h4>
                          <p className="text-sm text-gray-600">Verify database connectivity and queries</p>
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
        )}
      </div>
    </div>
  );
};

export default TestCases;
