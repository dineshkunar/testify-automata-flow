
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useDataFlow } from '@/hooks/useDataFlow';
import { useToast } from '@/hooks/use-toast';

interface BulkOperationsProps {
  testCases: Array<{
    id: string;
    title: string;
    status: string;
    priority: string;
  }>;
  onRefresh: () => void;
}

export const BulkOperations = ({ testCases, onRefresh }: BulkOperationsProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { executeTestCase } = useDataFlow();
  const { toast } = useToast();

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(testCases.map(tc => tc.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectCase = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedIds.length === 0) return;

    setLoading(true);
    try {
      const promises = selectedIds.map(id => {
        switch (bulkAction) {
          case 'mark_passed':
            return executeTestCase(id, 'passed');
          case 'mark_failed':
            return executeTestCase(id, 'failed');
          default:
            return Promise.resolve();
        }
      });

      await Promise.all(promises);
      
      toast({
        title: 'Bulk Operation Complete',
        description: `Successfully processed ${selectedIds.length} test cases`,
      });
      
      setSelectedIds([]);
      setBulkAction('');
      onRefresh();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to complete bulk operation',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Operations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="select-all"
            checked={selectedIds.length === testCases.length && testCases.length > 0}
            onCheckedChange={handleSelectAll}
          />
          <label htmlFor="select-all" className="text-sm font-medium">
            Select All ({selectedIds.length} selected)
          </label>
        </div>

        <div className="max-h-40 overflow-y-auto space-y-2">
          {testCases.map((testCase) => (
            <div key={testCase.id} className="flex items-center space-x-2">
              <Checkbox
                id={testCase.id}
                checked={selectedIds.includes(testCase.id)}
                onCheckedChange={(checked) => handleSelectCase(testCase.id, checked as boolean)}
              />
              <label htmlFor={testCase.id} className="text-sm truncate">
                {testCase.title}
              </label>
            </div>
          ))}
        </div>

        <div className="flex space-x-2">
          <Select value={bulkAction} onValueChange={setBulkAction}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mark_passed">Mark as Passed</SelectItem>
              <SelectItem value="mark_failed">Mark as Failed</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            onClick={handleBulkAction}
            disabled={!bulkAction || selectedIds.length === 0 || loading}
          >
            {loading ? 'Processing...' : 'Apply'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
