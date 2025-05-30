
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface TestExecution {
  id: string;
  test_case_id: string;
  status: 'passed' | 'failed' | 'skipped';
  executed_at: string;
  execution_time: number;
  error_message?: string;
}

export interface IntegrationSync {
  integration_id: string;
  last_sync: string;
  sync_status: 'success' | 'failed' | 'in_progress';
  synced_items: number;
}

class DataFlowService {
  // Test Cases to Reports data flow
  async recordTestExecution(execution: Omit<TestExecution, 'id'>) {
    const { data, error } = await supabase
      .from('test_executions')
      .insert(execution)
      .select()
      .single();

    if (error) throw error;
    
    // Update test case status
    await supabase
      .from('test_cases')
      .update({ 
        status: execution.status === 'passed' ? 'done' : 'failed',
        actual_result: execution.error_message || 'Test executed successfully'
      })
      .eq('id', execution.test_case_id);

    return data;
  }

  // Get test metrics for reports
  async getTestMetrics(dateFrom: string, dateTo: string) {
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

    // Calculate metrics
    const totalTests = executions?.length || 0;
    const passedTests = executions?.filter(e => e.status === 'passed').length || 0;
    const failedTests = executions?.filter(e => e.status === 'failed').length || 0;
    const avgExecutionTime = executions?.reduce((acc, e) => acc + (e.execution_time || 0), 0) / totalTests || 0;

    return {
      totalTests,
      passedTests,
      failedTests,
      passRate: totalTests > 0 ? (passedTests / totalTests) * 100 : 0,
      avgExecutionTime: Math.round(avgExecutionTime * 100) / 100,
      executions
    };
  }

  // Integration sync with external tools
  async syncWithIntegration(integrationId: string, testCases: any[]) {
    try {
      const { data: integration, error } = await supabase
        .from('integrations')
        .select('*')
        .eq('id', integrationId)
        .single();

      if (error) throw error;

      // Record sync attempt
      await supabase
        .from('integration_syncs')
        .insert({
          integration_id: integrationId,
          sync_status: 'in_progress',
          started_at: new Date().toISOString()
        });

      // Simulate integration sync based on provider
      const syncResult = await this.performIntegrationSync(integration, testCases);

      // Update sync status
      await supabase
        .from('integration_syncs')
        .update({
          sync_status: syncResult.success ? 'success' : 'failed',
          synced_items: syncResult.syncedCount,
          completed_at: new Date().toISOString(),
          error_message: syncResult.error
        })
        .eq('integration_id', integrationId);

      return syncResult;
    } catch (error) {
      console.error('Integration sync failed:', error);
      throw error;
    }
  }

  private async performIntegrationSync(integration: any, testCases: any[]) {
    // Mock implementation - in real app, this would call actual APIs
    const { provider, configuration } = integration;
    
    switch (provider) {
      case 'jira':
        return await this.syncWithJira(configuration, testCases);
      case 'trello':
        return await this.syncWithTrello(configuration, testCases);
      case 'slack':
        return await this.syncWithSlack(configuration, testCases);
      default:
        return { success: false, syncedCount: 0, error: 'Unsupported provider' };
    }
  }

  private async syncWithJira(config: any, testCases: any[]) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock sync - would create/update JIRA issues
    const syncedCount = Math.min(testCases.length, 10);
    return { 
      success: true, 
      syncedCount,
      message: `Synced ${syncedCount} test cases to JIRA project ${config.project_key}`
    };
  }

  private async syncWithTrello(config: any, testCases: any[]) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const syncedCount = Math.min(testCases.length, 8);
    return { 
      success: true, 
      syncedCount,
      message: `Created ${syncedCount} cards in Trello board`
    };
  }

  private async syncWithSlack(config: any, testCases: any[]) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { 
      success: true, 
      syncedCount: 1,
      message: `Sent test summary to ${config.channel}`
    };
  }

  // Dashboard data aggregation
  async getDashboardMetrics() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [testCasesData, executionsData, integrationsData] = await Promise.all([
      supabase.from('test_cases').select('*'),
      supabase.from('test_executions').select('*').gte('executed_at', thirtyDaysAgo.toISOString()),
      supabase.from('integrations').select('*')
    ]);

    const testCases = testCasesData.data || [];
    const executions = executionsData.data || [];
    const integrations = integrationsData.data || [];

    return {
      totalTestCases: testCases.length,
      activeIntegrations: integrations.filter(i => i.status === 'active').length,
      recentExecutions: executions.length,
      passRate: executions.length > 0 
        ? (executions.filter(e => e.status === 'passed').length / executions.length) * 100 
        : 0,
      testCasesByType: this.groupBy(testCases, 'type'),
      testCasesByStatus: this.groupBy(testCases, 'status'),
      executionTrend: this.getExecutionTrend(executions)
    };
  }

  private groupBy(array: any[], key: string) {
    return array.reduce((result, item) => {
      const group = item[key] || 'unknown';
      result[group] = (result[group] || 0) + 1;
      return result;
    }, {});
  }

  private getExecutionTrend(executions: any[]) {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => ({
      date,
      executions: executions.filter(e => e.executed_at.startsWith(date)).length
    }));
  }
}

export const dataFlowService = new DataFlowService();
