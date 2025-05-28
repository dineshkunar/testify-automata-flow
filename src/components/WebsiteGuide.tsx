
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  TestTube, 
  BarChart3, 
  Settings, 
  Users, 
  Database, 
  Lock, 
  FileText,
  Workflow,
  Bell,
  Cloud
} from "lucide-react";

export const WebsiteGuide = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Complete Website Guide</h1>
        <p className="text-lg text-gray-600">Understanding how to use the Test Management System</p>
      </div>

      {/* Authentication & Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Getting Started - Authentication & Profile Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">1. Account Creation</h4>
              <p className="text-sm text-gray-600">Sign up with email and password through Supabase authentication</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">2. Profile Setup</h4>
              <p className="text-sm text-gray-600">Complete your profile with personal info, photo upload, and preferences</p>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm"><strong>Database Storage:</strong> User data is stored in the 'profiles' table with RLS policies ensuring data privacy</p>
          </div>
        </CardContent>
      </Card>

      {/* Test Case Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5 text-green-600" />
            Test Case Management System
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-medium text-lg">Test Case Creation & Storage</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h5 className="font-medium mb-2">Manual Creation</h5>
                <p className="text-sm text-gray-600">Create test cases using the form with title, description, steps, priority, and type</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h5 className="font-medium mb-2">AI Generation</h5>
                <p className="text-sm text-gray-600">Use AI to generate comprehensive test cases based on feature descriptions</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h5 className="font-medium mb-2">Bulk Import</h5>
                <p className="text-sm text-gray-600">Import test cases from CSV or Excel files for batch processing</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-lg">Kanban Board Workflow</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="bg-gray-500">To Do</Badge>
              <Badge className="bg-blue-500">In Progress</Badge>
              <Badge className="bg-yellow-500 text-black">Testing</Badge>
              <Badge className="bg-green-500">Done</Badge>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm"><strong>Drag & Drop:</strong> Move test cases between columns to update status. Changes are automatically saved to the 'test_cases' table</p>
              <p className="text-sm mt-2"><strong>Real-time Updates:</strong> All changes are reflected immediately across the application</p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Database Schema - test_cases table</h4>
            <div className="bg-gray-50 p-4 rounded-lg text-sm font-mono">
              <p>• id (UUID) - Primary key</p>
              <p>• user_id (UUID) - Links to authenticated user</p>
              <p>• title, description, type, priority, status</p>
              <p>• steps (JSONB) - Array of test steps</p>
              <p>• expected_result, actual_result</p>
              <p>• created_at, updated_at timestamps</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports & Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            Reports & Analytics System
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Report Generation</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Dashboard reports with real-time metrics</li>
                <li>• Custom date range selection</li>
                <li>• Multiple export formats (PDF, CSV, Excel)</li>
                <li>• Automated report scheduling</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Analytics Features</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Test execution trends and patterns</li>
                <li>• Pass/fail rate analysis</li>
                <li>• Performance metrics tracking</li>
                <li>• Team productivity insights</li>
              </ul>
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm"><strong>Storage:</strong> Reports are stored in the 'reports' table with metadata and file paths for generated documents</p>
          </div>
        </CardContent>
      </Card>

      {/* Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-orange-600" />
            Integration Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h5 className="font-medium mb-2">Slack Integration</h5>
              <p className="text-sm text-gray-600">Connect to Slack for notifications and test result updates</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h5 className="font-medium mb-2">Jira Integration</h5>
              <p className="text-sm text-gray-600">Sync test cases with Jira issues and track progress</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h5 className="font-medium mb-2">TestRail Integration</h5>
              <p className="text-sm text-gray-600">Import/export test cases and sync execution results</p>
            </div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <p className="text-sm"><strong>Security:</strong> API keys are encrypted and stored in Supabase secrets. Configuration data is stored in 'integrations' table</p>
          </div>
        </CardContent>
      </Card>

      {/* Permissions & Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-red-600" />
            Security & Permissions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <h4 className="font-medium">Row Level Security (RLS)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h5 className="font-medium text-sm">Data Isolation</h5>
                <p className="text-sm text-gray-600">Each user can only access their own test cases, reports, and integrations</p>
              </div>
              <div className="space-y-2">
                <h5 className="font-medium text-sm">Team Access</h5>
                <p className="text-sm text-gray-600">Team members can share data based on configured permissions</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">User Roles & Permissions</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Badge variant="default">Admin - Full access</Badge>
              <Badge variant="secondary">QA Lead - Manage tests</Badge>
              <Badge variant="outline">Developer - Create/Execute</Badge>
              <Badge variant="outline">Viewer - Read only</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Database Architecture */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-indigo-600" />
            Database Architecture
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Core Tables</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>profiles</strong> - User information and preferences</li>
                <li>• <strong>test_cases</strong> - All test case data</li>
                <li>• <strong>reports</strong> - Generated reports metadata</li>
                <li>• <strong>integrations</strong> - Third-party connections</li>
                <li>• <strong>marketplace_tools</strong> - Installed tools</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Data Relationships</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• All tables linked to user via user_id</li>
                <li>• Foreign key constraints ensure data integrity</li>
                <li>• JSONB fields for flexible configuration storage</li>
                <li>• Timestamps for audit trails</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Example */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Workflow className="h-5 w-5 text-teal-600" />
            Complete Workflow Example
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium">1. User Registration & Setup</h4>
              <p className="text-sm text-gray-600">User signs up → Profile created in database → Email verification → Complete profile setup</p>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-medium">2. Test Case Creation</h4>
              <p className="text-sm text-gray-600">Navigate to Test Cases → Use AI Generator or Manual Form → Save to database → Appears in Kanban board</p>
            </div>
            
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-medium">3. Test Execution</h4>
              <p className="text-sm text-gray-600">Drag test case to "In Progress" → Execute tests → Update status to "Testing" → Mark as "Done" when complete</p>
            </div>
            
            <div className="border-l-4 border-orange-500 pl-4">
              <h4 className="font-medium">4. Reporting & Analysis</h4>
              <p className="text-sm text-gray-600">Generate reports → Export in desired format → Share with team → Schedule automated reports</p>
            </div>
            
            <div className="border-l-4 border-red-500 pl-4">
              <h4 className="font-medium">5. Integration & Collaboration</h4>
              <p className="text-sm text-gray-600">Configure Slack/Jira → Set up notifications → Invite team members → Share test results</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-yellow-600" />
            Common Issues & Solutions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium">Data Issues</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Can't see test cases:</strong> Check RLS policies and user authentication</p>
                <p><strong>Upload fails:</strong> Verify file size limits and storage bucket permissions</p>
                <p><strong>Sync issues:</strong> Check integration credentials and API limits</p>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Performance</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Slow loading:</strong> Check database indices and query optimization</p>
                <p><strong>Large reports:</strong> Use pagination and date range filters</p>
                <p><strong>Real-time updates:</strong> Verify Supabase realtime subscription</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
