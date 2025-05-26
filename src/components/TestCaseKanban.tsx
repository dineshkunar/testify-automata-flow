
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TestTube2, Clock, CheckCircle, XCircle } from "lucide-react";

const testCases = {
  todo: [
    { id: 1, title: "API Response Validation", type: "Integration", priority: "High" },
    { id: 2, title: "Database Migration Test", type: "White-box", priority: "Medium" },
  ],
  inProgress: [
    { id: 3, title: "User Registration Flow", type: "Smoke", priority: "Critical" },
    { id: 4, title: "Payment Gateway Integration", type: "Integration", priority: "High" },
  ],
  testing: [
    { id: 5, title: "Mobile Responsive Design", type: "Regression", priority: "Medium" },
  ],
  done: [
    { id: 6, title: "Login Functionality", type: "Smoke", priority: "Critical" },
    { id: 7, title: "Password Reset Flow", type: "Functional", priority: "High" },
  ]
};

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'todo':
      return <Clock className="h-4 w-4 text-gray-500" />;
    case 'inProgress':
      return <TestTube2 className="h-4 w-4 text-blue-500" />;
    case 'testing':
      return <TestTube2 className="h-4 w-4 text-yellow-500" />;
    case 'done':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'Critical':
      return 'destructive';
    case 'High':
      return 'default';
    case 'Medium':
      return 'secondary';
    case 'Low':
      return 'outline';
    default:
      return 'secondary';
  }
};

export const TestCaseKanban = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* To Do Column */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <StatusIcon status="todo" />
            To Do ({testCases.todo.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {testCases.todo.map((testCase) => (
            <Card key={testCase.id} className="p-3 cursor-pointer hover:shadow-md transition-shadow">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">{testCase.title}</h4>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">{testCase.type}</Badge>
                  <Badge variant={getPriorityColor(testCase.priority) as any} className="text-xs">
                    {testCase.priority}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* In Progress Column */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <StatusIcon status="inProgress" />
            In Progress ({testCases.inProgress.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {testCases.inProgress.map((testCase) => (
            <Card key={testCase.id} className="p-3 cursor-pointer hover:shadow-md transition-shadow">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">{testCase.title}</h4>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">{testCase.type}</Badge>
                  <Badge variant={getPriorityColor(testCase.priority) as any} className="text-xs">
                    {testCase.priority}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Testing Column */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <StatusIcon status="testing" />
            Testing ({testCases.testing.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {testCases.testing.map((testCase) => (
            <Card key={testCase.id} className="p-3 cursor-pointer hover:shadow-md transition-shadow">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">{testCase.title}</h4>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">{testCase.type}</Badge>
                  <Badge variant={getPriorityColor(testCase.priority) as any} className="text-xs">
                    {testCase.priority}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Done Column */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <StatusIcon status="done" />
            Done ({testCases.done.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {testCases.done.map((testCase) => (
            <Card key={testCase.id} className="p-3 cursor-pointer hover:shadow-md transition-shadow">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">{testCase.title}</h4>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">{testCase.type}</Badge>
                  <Badge variant={getPriorityColor(testCase.priority) as any} className="text-xs">
                    {testCase.priority}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
