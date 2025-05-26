
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, TestTube2, Clock, CheckCircle, AlertTriangle, TrendingUp, Users, Target } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #970747 0%, #FFFFFF 50%, #970747 100%)' }}>
      <div className="relative z-10 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-pink-100 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-white/90 text-lg">Monitor your testing progress and team performance</p>
          </div>
          <Button className="bg-gradient-to-r from-pink-600 to-pink-800 hover:from-pink-700 hover:to-pink-900 text-white">
            Generate Report
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Test Cases</CardTitle>
              <TestTube2 className="h-4 w-4 text-pink-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-600">1,234</div>
              <p className="text-xs text-muted-foreground">+15% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">95.2%</div>
              <p className="text-xs text-muted-foreground">+2.1% from last week</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Tests</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">47</div>
              <p className="text-xs text-muted-foreground">12 in progress</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed Tests</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">8</div>
              <p className="text-xs text-muted-foreground">-3 from yesterday</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Test Runs */}
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-gray-800">Recent Test Runs</CardTitle>
              <CardDescription>Latest test execution results</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">User Authentication Suite</p>
                    <p className="text-sm text-muted-foreground">Completed 5 minutes ago</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-200">Passed</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Payment Processing</p>
                    <p className="text-sm text-muted-foreground">Running for 12 minutes</p>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">Running</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg bg-red-50">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-medium">API Integration Tests</p>
                    <p className="text-sm text-muted-foreground">Failed 1 hour ago</p>
                  </div>
                </div>
                <Badge className="bg-red-100 text-red-800 border-red-200">Failed</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Team Performance */}
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-gray-800">Team Performance</CardTitle>
              <CardDescription>Current sprint progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between text-sm">
                  <span>Test Cases Completed</span>
                  <span>78/100</span>
                </div>
                <Progress value={78} className="mt-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm">
                  <span>Bug Reports Filed</span>
                  <span>23/30</span>
                </div>
                <Progress value={76} className="mt-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm">
                  <span>Code Coverage</span>
                  <span>92%</span>
                </div>
                <Progress value={92} className="mt-2" />
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-lg font-semibold text-pink-600">12</div>
                  <div className="text-xs text-muted-foreground">Active Members</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-600">47</div>
                  <div className="text-xs text-muted-foreground">Tests Today</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-blue-600">8.5h</div>
                  <div className="text-xs text-muted-foreground">Avg Response</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
