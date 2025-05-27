
import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";

interface TestCase {
  id: string;
  title: string;
  description: string;
  type: string;
  priority: string;
  status: string;
  created_at: string;
}

const TestCases = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchTestCases();
  }, []);

  const fetchTestCases = async () => {
    try {
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
        description: "Failed to load test cases.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    navigate('/filter-test-cases');
  };

  const handleNewTestCase = () => {
    toast({
      title: "Create Test Case",
      description: "Opening new test case form...",
    });
  };

  const filteredTestCases = testCases.filter(testCase =>
    testCase.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testCase.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-white/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Test Cases
            </h1>
            <p className="text-white/90 text-lg">Manage and track all your test cases</p>
          </div>
          <Button onClick={handleNewTestCase} className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30">
            <Plus className="mr-2 h-4 w-4" />
            New Test Case
          </Button>
        </div>

        <Tabs defaultValue="kanban" className="space-y-6">
          <TabsList className="bg-white/20 backdrop-blur-sm">
            <TabsTrigger value="kanban" className="data-[state=active]:bg-white/30">Kanban View</TabsTrigger>
            <TabsTrigger value="generator" className="data-[state=active]:bg-white/30">Test Generator</TabsTrigger>
            <TabsTrigger value="list" className="data-[state=active]:bg-white/30">List View</TabsTrigger>
          </TabsList>

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
              <Button variant="outline" onClick={handleFilter} className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30">
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
                <CardTitle>All Test Cases</CardTitle>
                <CardDescription>Complete list of test cases with detailed information</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading test cases...</div>
                ) : (
                  <div className="space-y-4">
                    {filteredTestCases.map((testCase) => (
                      <div key={testCase.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <TestTube2 className="h-5 w-5 text-primary" />
                          <div>
                            <h4 className="font-medium">{testCase.title}</h4>
                            <p className="text-sm text-muted-foreground">{testCase.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{testCase.type}</Badge>
                          <Badge variant={testCase.status === 'done' ? 'default' : testCase.status === 'blocked' ? 'destructive' : 'outline'}>
                            {testCase.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {filteredTestCases.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No test cases found. Create your first test case!
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TestCases;
