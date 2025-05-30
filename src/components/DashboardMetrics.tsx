
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useDataFlow } from "@/hooks/useDataFlow";
import { TestTube2, Activity, Link, TrendingUp } from "lucide-react";

export const DashboardMetrics = () => {
  const { dashboardMetrics, loading } = useDataFlow();

  if (loading || !dashboardMetrics) {
    return <div className="text-center py-8">Loading dashboard metrics...</div>;
  }

  const {
    totalTestCases,
    activeIntegrations,
    recentExecutions,
    passRate,
    testCasesByType,
    testCasesByStatus,
    executionTrend
  } = dashboardMetrics;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TestTube2 className="h-4 w-4" />
              Total Test Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTestCases}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active test cases in system
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Pass Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(passRate)}%</div>
            <Progress value={passRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Link className="h-4 w-4" />
              Active Integrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeIntegrations}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Connected external tools
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Recent Executions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentExecutions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Test Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Test Cases by Type</CardTitle>
            <CardDescription>Distribution of test case types</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(testCasesByType).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="capitalize">{type}</span>
                <Badge variant="outline">{count as number}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Cases by Status</CardTitle>
            <CardDescription>Current status distribution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(testCasesByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className="capitalize">{status.replace('_', ' ')}</span>
                <Badge variant="outline">{count as number}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Execution Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Execution Trend (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 h-32">
            {executionTrend.map((day: any) => (
              <div key={day.date} className="flex flex-col items-center flex-1">
                <div 
                  className="bg-primary w-full rounded-t"
                  style={{ height: `${Math.max(day.executions * 10, 5)}px` }}
                />
                <span className="text-xs mt-1">
                  {new Date(day.date).getDate()}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
