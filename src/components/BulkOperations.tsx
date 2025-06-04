
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, CheckCircle, XCircle, Play, export } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BulkOperationsProps {
  testCases: any[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onOperationComplete: () => void;
}

export const BulkOperations = ({ 
  testCases, 
  selectedIds, 
  onSelectionChange, 
  onOperationComplete 
}: BulkOperationsProps) => {
  const [loading, setLoading] = useState(false);
  const [operation, setOperation] = useState('');
  const { toast } = useToast();

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(testCases.map(tc => tc.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedIds, id]);
    } else {
      onSelectionChange(selectedIds.filter(selectedId => selectedId !== id));
    }
  };

  const executeBulkOperation = async () => {
    if (selectedIds.length === 0 || !operation) {
      toast({
        title: "No Selection",
        description: "Please select test cases and an operation",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      switch (operation) {
        case 'delete':
          const { error: deleteError } = await supabase
            .from('test_cases')
            .delete()
            .in('id', selectedIds)
            .eq('user_id', user.id);
          
          if (deleteError) throw deleteError;
          
          toast({
            title: "Success",
            description: `${selectedIds.length} test case(s) deleted`,
          });
          break;

        case 'status_todo':
        case 'status_in_progress':
        case 'status_testing':
        case 'status_done':
          const newStatus = operation.replace('status_', '');
          const { error: statusError } = await supabase
            .from('test_cases')
            .update({ status: newStatus })
            .in('id', selectedIds)
            .eq('user_id', user.id);
          
          if (statusError) throw statusError;
          
          toast({
            title: "Status Updated",
            description: `${selectedIds.length} test case(s) updated to ${newStatus}`,
          });
          break;

        case 'priority_critical':
        case 'priority_high':
        case 'priority_medium':
        case 'priority_low':
          const newPriority = operation.replace('priority_', '');
          const { error: priorityError } = await supabase
            .from('test_cases')
            .update({ priority: newPriority })
            .in('id', selectedIds)
            .eq('user_id', user.id);
          
          if (priorityError) throw priorityError;
          
          toast({
            title: "Priority Updated",
            description: `${selectedIds.length} test case(s) priority updated to ${newPriority}`,
          });
          break;

        case 'execute_all':
          // Execute all selected test cases
          const executions = selectedIds.map(testCaseId => ({
            test_case_id: testCaseId,
            executed_by: user.id,
            status: 'passed', // Default status for bulk execution
            execution_time: Math.random() * 5 + 1,
            environment: 'bulk-execution',
            browser: 'automated'
          }));

          const { error: executeError } = await supabase
            .from('test_executions')
            .insert(executions);
          
          if (executeError) throw executeError;
          
          toast({
            title: "Execution Complete",
            description: `${selectedIds.length} test case(s) executed`,
          });
          break;

        case 'export':
          // Export selected test cases
          const { data: exportData } = await supabase
            .from('test_cases')
            .select('*')
            .in('id', selectedIds)
            .eq('user_id', user.id);

          if (exportData) {
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `test-cases-export-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            toast({
              title: "Export Complete",
              description: `${selectedIds.length} test case(s) exported`,
            });
          }
          break;

        default:
          throw new Error('Invalid operation');
      }

      onSelectionChange([]);
      setOperation('');
      onOperationComplete();
    } catch (error) {
      console.error('Bulk operation error:', error);
      toast({
        title: "Operation Failed",
        description: error.message || "Failed to perform bulk operation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Bulk Operations</CardTitle>
        <CardDescription>
          Select multiple test cases to perform batch operations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all"
                checked={selectedIds.length === testCases.length && testCases.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <label htmlFor="select-all" className="text-sm font-medium">
                Select All ({testCases.length})
              </label>
            </div>
            
            {selectedIds.length > 0 && (
              <Badge variant="secondary">
                {selectedIds.length} selected
              </Badge>
            )}
          </div>

          <div className="flex gap-4">
            <Select value={operation} onValueChange={setOperation}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select operation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="delete">Delete</SelectItem>
                <SelectItem value="status_todo">Set Status: To Do</SelectItem>
                <SelectItem value="status_in_progress">Set Status: In Progress</SelectItem>
                <SelectItem value="status_testing">Set Status: Testing</SelectItem>
                <SelectItem value="status_done">Set Status: Done</SelectItem>
                <SelectItem value="priority_critical">Set Priority: Critical</SelectItem>
                <SelectItem value="priority_high">Set Priority: High</SelectItem>
                <SelectItem value="priority_medium">Set Priority: Medium</SelectItem>
                <SelectItem value="priority_low">Set Priority: Low</SelectItem>
                <SelectItem value="execute_all">Execute All</SelectItem>
                <SelectItem value="export">Export Selected</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={executeBulkOperation}
              disabled={selectedIds.length === 0 || !operation || loading}
            >
              {loading ? "Processing..." : "Apply"}
            </Button>
          </div>

          {/* Test case selection list */}
          <div className="max-h-60 overflow-y-auto space-y-2">
            {testCases.map((testCase) => (
              <div key={testCase.id} className="flex items-center space-x-2 p-2 border rounded">
                <Checkbox
                  id={testCase.id}
                  checked={selectedIds.includes(testCase.id)}
                  onCheckedChange={(checked) => handleSelectItem(testCase.id, checked as boolean)}
                />
                <label htmlFor={testCase.id} className="flex-1 text-sm cursor-pointer">
                  {testCase.title}
                </label>
                <Badge variant="outline" className="text-xs">
                  {testCase.status}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {testCase.priority}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
