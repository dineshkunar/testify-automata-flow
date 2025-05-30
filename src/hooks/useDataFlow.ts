
import { useState, useEffect } from 'react';
import { dataFlowService } from '@/services/dataFlowService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useDataFlow = () => {
  const [loading, setLoading] = useState(false);
  const [dashboardMetrics, setDashboardMetrics] = useState<any>(null);
  const { toast } = useToast();

  // Load dashboard metrics
  const loadDashboardMetrics = async () => {
    try {
      setLoading(true);
      const metrics = await dataFlowService.getDashboardMetrics();
      setDashboardMetrics(metrics);
    } catch (error) {
      console.error('Failed to load dashboard metrics:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard metrics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Execute test case
  const executeTestCase = async (testCaseId: string, status: 'passed' | 'failed', errorMessage?: string) => {
    try {
      setLoading(true);
      await dataFlowService.recordTestExecution({
        test_case_id: testCaseId,
        status,
        executed_at: new Date().toISOString(),
        execution_time: Math.random() * 5 + 1, // Mock execution time
        error_message: errorMessage
      });

      toast({
        title: "Test Executed",
        description: `Test case ${status} successfully`,
      });

      // Refresh metrics
      await loadDashboardMetrics();
    } catch (error) {
      console.error('Failed to execute test:', error);
      toast({
        title: "Execution Failed",
        description: "Failed to record test execution",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Sync with integration
  const syncWithIntegration = async (integrationId: string) => {
    try {
      setLoading(true);
      
      // Get test cases to sync
      const { data: testCases } = await supabase
        .from('test_cases')
        .select('*')
        .limit(20);

      const result = await dataFlowService.syncWithIntegration(integrationId, testCases || []);
      
      toast({
        title: "Sync Complete",
        description: result.message || `Synced ${result.syncedCount} items`,
      });

      return result;
    } catch (error) {
      console.error('Sync failed:', error);
      toast({
        title: "Sync Failed",
        description: "Failed to sync with integration",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Generate report with real data
  const generateReport = async (type: string, dateFrom: string, dateTo: string) => {
    try {
      setLoading(true);
      const metrics = await dataFlowService.getTestMetrics(dateFrom, dateTo);
      
      // Save report
      const { data: report, error } = await supabase
        .from('reports')
        .insert({
          name: `${type} Report - ${new Date().toLocaleDateString()}`,
          type,
          date_from: dateFrom,
          date_to: dateTo,
          status: 'completed',
          description: `Generated report with ${metrics.totalTests} test cases`
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Report Generated",
        description: `${type} report created successfully`,
      });

      return { report, metrics };
    } catch (error) {
      console.error('Failed to generate report:', error);
      toast({
        title: "Report Failed",
        description: "Failed to generate report",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardMetrics();
  }, []);

  return {
    loading,
    dashboardMetrics,
    executeTestCase,
    syncWithIntegration,
    generateReport,
    loadDashboardMetrics
  };
};
