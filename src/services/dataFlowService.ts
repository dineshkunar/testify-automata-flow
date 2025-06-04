
import { supabase } from '@/integrations/supabase/client';

export interface TestExecution {
  id?: string;
  test_case_id: string;
  executed_by?: string;
  status: 'passed' | 'failed' | 'skipped';
  execution_time?: number;
  error_message?: string;
  executed_at?: string;
  environment?: string;
  browser?: string;
  screenshots?: any[];
}

export interface IntegrationSync {
  id?: string;
  integration_id: string;
  sync_status: 'pending' | 'in_progress' | 'success' | 'failed';
  synced_items?: number;
  error_message?: string;
  started_at?: string;
  completed_at?: string;
  sync_data?: any;
}

export interface DashboardMetrics {
  totalTestCases: number;
  passedTests: number;
  failedTests: number;
  pendingTests: number;
  totalExecutions: number;
  avgExecutionTime: number;
  recentActivity: any[];
  activeIntegrations: number;
  passRate: number;
  testCasesByType: Record<string, number>;
  testCasesByStatus: Record<string, number>;
  executionTrend: Array<{ date: string; executions: number }>;
}

class DataFlowService {
  // Get real dashboard metrics from database
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    try {
      // Get metrics from database function
      const { data: metricsData, error: metricsError } = await supabase
        .rpc('get_dashboard_metrics');

      if (metricsError) throw metricsError;

      const metrics = metricsData?.[0] || {};

      // Get additional metrics
      const { data: testCases } = await supabase
        .from('test_cases')
        .select('type, status');

      const { data: integrations } = await supabase
        .from('integrations')
        .select('status')
        .eq('status', 'active');

      // Calculate derived metrics
      const testCasesByType = testCases?.reduce((acc: Record<string, number>, tc) => {
        acc[tc.type] = (acc[tc.type] || 0) + 1;
        return acc;
      }, {}) || {};

      const testCasesByStatus = testCases?.reduce((acc: Record<string, number>, tc) => {
        acc[tc.status] = (acc[tc.status] || 0) + 1;
        return acc;
      }, {}) || {};

      // Get execution trend for last 7 days
      const { data: executionTrend } = await supabase
        .from('test_executions')
        .select('executed_at')
        .gte('executed_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      const trendData = this.calculateExecutionTrend(executionTrend || []);

      const totalTests = metrics.passed_tests + metrics.failed_tests;
      const passRate = totalTests > 0 ? (metrics.passed_tests / totalTests) * 100 : 0;

      return {
        totalTestCases: Number(metrics.total_test_cases) || 0,
        passedTests: Number(metrics.passed_tests) || 0,
        failedTests: Number(metrics.failed_tests) || 0,
        pendingTests: Number(metrics.pending_tests) || 0,
        totalExecutions: Number(metrics.total_executions) || 0,
        avgExecutionTime: Number(metrics.avg_execution_time) || 0,
        recentActivity: metrics.recent_activity || [],
        activeIntegrations: integrations?.length || 0,
        passRate,
        testCasesByType,
        testCasesByStatus,
        executionTrend: trendData
      };
    } catch (error) {
      console.error('Error getting dashboard metrics:', error);
      throw error;
    }
  }

  // Record test execution
  async recordTestExecution(execution: TestExecution): Promise<any> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('test_executions')
        .insert([{
          ...execution,
          executed_by: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      // Create notification for test execution
      await this.createNotification({
        title: 'Test Execution Complete',
        message: `Test case execution ${execution.status}`,
        type: execution.status === 'passed' ? 'success' : 'error'
      });

      return data;
    } catch (error) {
      console.error('Error recording test execution:', error);
      throw error;
    }
  }

  // Sync with integration
  async syncWithIntegration(integrationId: string, testCases: any[] = []): Promise<any> {
    try {
      // Create sync record
      const { data: syncRecord, error: syncError } = await supabase
        .from('integration_syncs')
        .insert([{
          integration_id: integrationId,
          sync_status: 'in_progress',
          synced_items: 0
        }])
        .select()
        .single();

      if (syncError) throw syncError;

      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update sync status
      const syncedCount = Math.min(testCases.length, 20);
      const { error: updateError } = await supabase
        .from('integration_syncs')
        .update({
          sync_status: 'success',
          synced_items: syncedCount,
          completed_at: new Date().toISOString(),
          sync_data: { syncedTestCases: testCases.slice(0, syncedCount) }
        })
        .eq('id', syncRecord.id);

      if (updateError) throw updateError;

      // Create notification
      await this.createNotification({
        title: 'Integration Sync Complete',
        message: `Successfully synced ${syncedCount} test cases`,
        type: 'success'
      });

      return {
        syncedCount,
        message: `Successfully synced ${syncedCount} test cases`
      };
    } catch (error) {
      console.error('Sync failed:', error);
      
      // Update sync status to failed if we have a sync record
      // Note: In a real implementation, you'd want to track the sync ID properly
      
      throw error;
    }
  }

  // Get test metrics for reporting
  async getTestMetrics(dateFrom: string, dateTo: string): Promise<any> {
    try {
      const { data: executions, error } = await supabase
        .from('test_executions')
        .select(`
          *,
          test_cases (
            title,
            type,
            priority
          )
        `)
        .gte('executed_at', dateFrom)
        .lte('executed_at', dateTo);

      if (error) throw error;

      const totalTests = executions?.length || 0;
      const passedTests = executions?.filter(e => e.status === 'passed').length || 0;
      const failedTests = executions?.filter(e => e.status === 'failed').length || 0;
      const avgExecutionTime = executions?.reduce((sum, e) => sum + (e.execution_time || 0), 0) / Math.max(totalTests, 1);

      return {
        totalTests,
        passedTests,
        failedTests,
        passRate: totalTests > 0 ? (passedTests / totalTests) * 100 : 0,
        avgExecutionTime,
        executions: executions || []
      };
    } catch (error) {
      console.error('Error getting test metrics:', error);
      throw error;
    }
  }

  // Create notification
  async createNotification(notification: {
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    action_url?: string;
  }): Promise<any> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('notifications')
        .insert([{
          ...notification,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating notification:', error);
      // Don't throw here, notifications are not critical
    }
  }

  // Get notifications for user
  async getNotifications(limit: number = 10): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  }

  // Mark notification as read
  async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  // Calculate execution trend for chart
  private calculateExecutionTrend(executions: any[]): Array<{ date: string; executions: number }> {
    const today = new Date();
    const trend = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const executionsOnDate = executions.filter(e => 
        e.executed_at.startsWith(dateStr)
      ).length;

      trend.push({
        date: dateStr,
        executions: executionsOnDate
      });
    }

    return trend;
  }
}

export const dataFlowService = new DataFlowService();
