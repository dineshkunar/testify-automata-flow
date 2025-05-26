
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { BarChart3, TrendingUp, Download, Calendar } from "lucide-react";

const Reports = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Track testing metrics and get insights to improve your QA process</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Date Range
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="coverage">Coverage</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Test Execution Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87.5%</div>
                <div className="flex items-center gap-2 mt-2">
                  <Progress value={87.5} className="flex-1" />
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">92.3%</div>
                <div className="flex items-center gap-2 mt-2">
                  <Progress value={92.3} className="flex-1" />
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Execution Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.2m</div>
                <p className="text-xs text-muted-foreground mt-2">
                  -0.5m from last week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Test Cases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground mt-2">
                  +12 from last week
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Test Type Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Test Type Distribution</CardTitle>
                <CardDescription>Breakdown of test cases by type</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Smoke Tests</span>
                    <span>234 (19%)</span>
                  </div>
                  <Progress value={19} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Regression Tests</span>
                    <span>456 (37%)</span>
                  </div>
                  <Progress value={37} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Integration Tests</span>
                    <span>321 (26%)</span>
                  </div>
                  <Progress value={26} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>White-box Tests</span>
                    <span>223 (18%)</span>
                  </div>
                  <Progress value={18} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Test Runs</CardTitle>
                <CardDescription>Latest test execution results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Sprint 23 Regression</p>
                      <p className="text-sm text-muted-foreground">2 hours ago</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-600 font-medium">98% Passed</p>
                      <p className="text-sm text-muted-foreground">234/239 tests</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">API Integration Suite</p>
                      <p className="text-sm text-muted-foreground">4 hours ago</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-600 font-medium">100% Passed</p>
                      <p className="text-sm text-muted-foreground">45/45 tests</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Login Flow Tests</p>
                      <p className="text-sm text-muted-foreground">6 hours ago</p>
                    </div>
                    <div className="text-right">
                      <p className="text-red-600 font-medium">87% Passed</p>
                      <p className="text-sm text-muted-foreground">13/15 tests</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Test Execution Trends
              </CardTitle>
              <CardDescription>Track your testing progress over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Interactive charts would be rendered here</p>
                  <p className="text-sm text-muted-foreground">Using Recharts library for data visualization</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Monitor test execution performance and bottlenecks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">4.2m</div>
                  <p className="text-sm text-muted-foreground">Avg. Test Duration</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">15s</div>
                  <p className="text-sm text-muted-foreground">Avg. Setup Time</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">234</div>
                  <p className="text-sm text-muted-foreground">Tests/Hour</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="coverage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Coverage Analysis</CardTitle>
              <CardDescription>Monitor test coverage across different areas of your application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-4">Feature Coverage</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Authentication</span>
                        <span>95%</span>
                      </div>
                      <Progress value={95} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Payment Processing</span>
                        <span>87%</span>
                      </div>
                      <Progress value={87} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>User Management</span>
                        <span>92%</span>
                      </div>
                      <Progress value={92} />
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-4">Platform Coverage</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Web (Desktop)</span>
                        <span>98%</span>
                      </div>
                      <Progress value={98} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Mobile (iOS)</span>
                        <span>78%</span>
                      </div>
                      <Progress value={78} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Mobile (Android)</span>
                        <span>82%</span>
                      </div>
                      <Progress value={82} />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
