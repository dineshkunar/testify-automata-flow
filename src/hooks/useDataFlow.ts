
import { useState, useEffect } from 'react';
import { dataFlowService } from '@/services/dataFlowService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useDataFlow = () => {
  const [loading, setLoading] = useState(false);
  const [dashboardMetrics, setDashboardMetrics] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
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

  // Load notifications
  const loadNotifications = async () => {
    try {
      const notifs = await dataFlowService.getNotifications();
      setNotifications(notifs);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  // Execute test case
  const executeTestCase = async (testCaseId: string, status: 'passed' | 'failed', errorMessage?: string) => {
    try {
      setLoading(true);
      await dataFlowService.recordTestExecution({
        test_case_id: testCaseId,
        status,
        execution_time: Math.random() * 5 + 1, // Mock execution time
        error_message: errorMessage,
        environment: 'test',
        browser: 'chrome'
      });

      toast({
        title: "Test Executed",
        description: `Test case ${status} successfully`,
      });

      // Refresh metrics and notifications
      await Promise.all([loadDashboardMetrics(), loadNotifications()]);
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

      // Refresh notifications
      await loadNotifications();

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
          description: `Generated report with ${metrics.totalTests} test executions`
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Report Generated",
        description: `${type} report created successfully`,
      });

      // Create notification
      await dataFlowService.createNotification({
        title: 'Report Generated',
        message: `${type} report has been generated successfully`,
        type: 'success'
      });

      await loadNotifications();

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

  // Mark notification as read
  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await dataFlowService.markNotificationAsRead(notificationId);
      await loadNotifications();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    const setupRealtimeSubscriptions = () => {
      // Subscribe to test executions
      const executionsChannel = supabase
        .channel('test_executions_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'test_executions'
          },
          () => {
            loadDashboardMetrics();
          }
        )
        .subscribe();

      // Subscribe to notifications
      const notificationsChannel = supabase
        .channel('notifications_changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications'
          },
          () => {
            loadNotifications();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(executionsChannel);
        supabase.removeChannel(notificationsChannel);
      };
    };

    const cleanup = setupRealtimeSubscriptions();
    loadDashboardMetrics();
    loadNotifications();

    return cleanup;
  }, []);

  return {
    loading,
    dashboardMetrics,
    notifications,
    executeTestCase,
    syncWithIntegration,
    generateReport,
    loadDashboardMetrics,
    markNotificationAsRead
  };
};
