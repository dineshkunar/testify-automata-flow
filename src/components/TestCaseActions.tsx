
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, CheckCircle, XCircle, Sync } from "lucide-react";
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
    await executeTestCase(testCase.id, status);
    setExecuting(false);
    onStatusChange?.();
  };

  const handleSync = async () => {
    // In a real app, you'd get the user's preferred integration
    const integrationId = 'default-integration-id';
    await syncWithIntegration(integrationId);
  };

  return (
    <div className="flex items-center gap-2">
      <Badge variant={testCase.status === 'done' ? 'default' : 'secondary'}>
        {testCase.status}
      </Badge>
      
      <div className="flex gap-1">
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleExecute('passed')}
          disabled={executing || loading}
          className="text-green-600 hover:text-green-700"
        >
          <CheckCircle className="h-4 w-4" />
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleExecute('failed')}
          disabled={executing || loading}
          className="text-red-600 hover:text-red-700"
        >
          <XCircle className="h-4 w-4" />
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          onClick={handleSync}
          disabled={loading}
          className="text-blue-600 hover:text-blue-700"
        >
          <Sync className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
