
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TestTube2, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TestCase {
  id: string;
  title: string;
  type: string;
  priority: string;
  status: string;
  description?: string;
}

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'todo':
      return <Clock className="h-4 w-4 text-gray-500" />;
    case 'in_progress':
      return <TestTube2 className="h-4 w-4 text-blue-500" />;
    case 'testing':
      return <TestTube2 className="h-4 w-4 text-yellow-500" />;
    case 'done':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'critical':
      return 'destructive';
    case 'high':
      return 'default';
    case 'medium':
      return 'secondary';
    case 'low':
      return 'outline';
    default:
      return 'secondary';
  }
};

const getStatusTitle = (status: string) => {
  switch (status) {
    case 'todo':
      return 'To Do';
    case 'in_progress':
      return 'In Progress';
    case 'testing':
      return 'Testing';
    case 'done':
      return 'Done';
    default:
      return status;
  }
};

export const DraggableTestCaseKanban = () => {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedItem, setDraggedItem] = useState<TestCase | null>(null);
  const { toast } = useToast();

  const columns = ['todo', 'in_progress', 'testing', 'done'];

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

  const updateTestCaseStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('test_cases')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setTestCases(prev => 
        prev.map(tc => tc.id === id ? { ...tc, status: newStatus } : tc)
      );

      toast({
        title: "Status Updated",
        description: `Test case moved to ${getStatusTitle(newStatus)}`,
      });
    } catch (error) {
      console.error('Error updating test case:', error);
      toast({
        title: "Error",
        description: "Failed to update test case status",
        variant: "destructive",
      });
    }
  };

  const handleDragStart = (e: React.DragEvent, testCase: TestCase) => {
    setDraggedItem(testCase);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    if (draggedItem && draggedItem.status !== newStatus) {
      updateTestCaseStatus(draggedItem.id, newStatus);
    }
    setDraggedItem(null);
  };

  const getTestCasesByStatus = (status: string) => {
    return testCases.filter(tc => tc.status === status);
  };

  if (loading) {
    return <div className="text-center py-8">Loading test cases...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {columns.map((status) => {
        const statusTestCases = getTestCasesByStatus(status);
        return (
          <Card key={status} className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <StatusIcon status={status} />
                {getStatusTitle(status)} ({statusTestCases.length})
              </CardTitle>
            </CardHeader>
            <CardContent 
              className="space-y-3 min-h-[400px]"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, status)}
            >
              {statusTestCases.map((testCase) => (
                <Card 
                  key={testCase.id} 
                  className="p-3 cursor-pointer hover:shadow-md transition-shadow bg-white border border-gray-200"
                  draggable
                  onDragStart={(e) => handleDragStart(e, testCase)}
                >
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">{testCase.title}</h4>
                    {testCase.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {testCase.description}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">{testCase.type}</Badge>
                      <Badge variant={getPriorityColor(testCase.priority) as any} className="text-xs">
                        {testCase.priority}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
              {statusTestCases.length === 0 && (
                <div className="text-center text-muted-foreground text-sm py-8">
                  Drop test cases here
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
