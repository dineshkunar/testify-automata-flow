
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, upload, Play } from "lucide-react";
import { useDataFlow } from "@/hooks/useDataFlow";
import { useState } from "react";

interface TestCaseActionsProps {
  testCase: {
    id: string;
    title: string;
    status: string;
  };
  onStatusChange?: () => void;
}

export const TestCaseActions = ({ testCase, onStatusChange }: TestCaseActionsProps) => {
  const { executeTestCase, syncWithIntegration, loading } = useDataFlow();
  const [executing, setExecuting] = useState(false);

  const handleExecute = async (status: 'passed' | 'failed') => {
    setExecuting(true);
    try {
      await executeTestCase(testCase.id, status);
      onStatusChange?.();
    } catch (error) {
      console.error('Failed to execute test case:', error);
    } finally {
      setExecuting(false);
    }
  };

  const handleSync = async () => {
    // In a real app, you'd get the user's preferred integration
    const integrationId = 'default-integration-id';
    await syncWithIntegration(integrationId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return 'default';
      case 'in_progress':
        return 'secondary';
      case 'testing':
        return 'outline';
      case 'todo':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Badge variant={getStatusColor(testCase.status) as any}>
        {testCase.status.replace('_', ' ')}
      </Badge>
      
      <div className="flex gap-1">
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleExecute('passed')}
          disabled={executing || loading}
          className="text-green-600 hover:text-green-700 hover:bg-green-50"
          title="Mark as Passed"
        >
          <CheckCircle className="h-4 w-4" />
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleExecute('failed')}
          disabled={executing || loading}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          title="Mark as Failed"
        >
          <XCircle className="h-4 w-4" />
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          onClick={handleSync}
          disabled={loading}
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          title="Sync with Integration"
        >
          <upload className="h-4 w-4" />
        </Button>
      </div>
      
      {executing && (
        <span className="text-xs text-muted-foreground">Executing...</span>
      )}
    </div>
  );
};
