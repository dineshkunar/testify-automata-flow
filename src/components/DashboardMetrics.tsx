
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useDataFlow } from "@/hooks/useDataFlow";
import { TestTube2, Activity, Link, TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react";

export const DashboardMetrics = () => {
  const { dashboardMetrics, loading } = useDataFlow();

  if (loading || !dashboardMetrics) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const {
    totalTestCases,
    activeIntegrations,
    totalExecutions,
    passRate,
    testCasesByType,
    testCasesByStatus,
    executionTrend,
    recentActivity,
    passedTests,
    failedTests,
    pendingTests
  } = dashboardMetrics;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TestTube2 className="h-4 w-4 text-blue-600" />
              Total Test Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{totalTestCases}</div>
            <p className="text-xs text-blue-600 mt-1">
              Active test cases in system
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-600" />
              Pass Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{Math.round(passRate)}%</div>
            <Progress value={passRate} className="mt-2 bg-green-200" />
            <p className="text-xs text-green-600 mt-1">
              {passedTests} passed, {failedTests} failed
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Link className="h-4 w-4 text-purple-600" />
              Active Integrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{activeIntegrations}</div>
            <p className="text-xs text-purple-600 mt-1">
              Connected external tools
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              Recent Executions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">{totalExecutions}</div>
            <p className="text-xs text-orange-600 mt-1">
              Last 7 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Test Distribution and Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
          <CardHeader>
            <CardTitle>Test Cases by Type</CardTitle>
            <CardDescription>Distribution of test case types</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(testCasesByType).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                <span className="capitalize font-medium">{type.replace('_', ' ')}</span>
                <Badge variant="outline" className="font-semibold">{count as number}</Badge>
              </div>
            ))}
            {Object.keys(testCasesByType).length === 0 && (
              <p className="text-center text-muted-foreground py-4">No test cases yet</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
          <CardHeader>
            <CardTitle>Test Cases by Status</CardTitle>
            <CardDescription>Current status distribution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(testCasesByStatus).map(([status, count]) => {
              const getStatusIcon = (status: string) => {
                switch (status) {
                  case 'done':
                    return <CheckCircle className="h-4 w-4 text-green-600" />;
                  case 'in_progress':
                    return <Clock className="h-4 w-4 text-blue-600" />;
                  case 'todo':
                    return <Clock className="h-4 w-4 text-gray-600" />;
                  default:
                    return <Clock className="h-4 w-4 text-gray-600" />;
                }
              };

              return (
                <div key={status} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(status)}
                    <span className="capitalize font-medium">{status.replace('_', ' ')}</span>
                  </div>
                  <Badge variant="outline" className="font-semibold">{count as number}</Badge>
                </div>
              );
            })}
            {Object.keys(testCasesByStatus).length === 0 && (
              <p className="text-center text-muted-foreground py-4">No test cases yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Execution Trend and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
          <CardHeader>
            <CardTitle>Execution Trend (Last 7 Days)</CardTitle>
            <CardDescription>Daily test execution activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-32">
              {executionTrend.map((day: any) => (
                <div key={day.date} className="flex flex-col items-center flex-1">
                  <div 
                    className="bg-primary w-full rounded-t min-h-[4px]"
                    style={{ height: `${Math.max(day.executions * 10, 4)}px` }}
                    title={`${day.executions} executions`}
                  />
                  <span className="text-xs mt-1">
                    {new Date(day.date).getDate()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest test executions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-32 overflow-y-auto">
              {recentActivity.length > 0 ? recentActivity.map((activity: any) => (
                <div key={activity.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-2">
                    {activity.status === 'passed' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm font-medium truncate">{activity.test_case_title}</span>
                  </div>
                  <Badge variant={activity.status === 'passed' ? 'default' : 'destructive'}>
                    {activity.status}
                  </Badge>
                </div>
              )) : (
                <p className="text-center text-muted-foreground py-4">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
