
import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { export as exportIcon, import as importIcon, FileText, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ExportImportProps {
  onImportComplete?: () => void;
}

export const ExportImport = ({ onImportComplete }: ExportImportProps) => {
  const [exportFormat, setExportFormat] = useState('json');
  const [exportOptions, setExportOptions] = useState({
    includeExecutions: true,
    includeScreenshots: false,
    includeMetadata: true
  });
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const exportData = async () => {
    setExporting(true);
    setProgress(0);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Fetch test cases
      const { data: testCases, error: testCasesError } = await supabase
        .from('test_cases')
        .select('*')
        .eq('user_id', user.id);

      if (testCasesError) throw testCasesError;
      setProgress(25);

      let exportData: any = { testCases };

      // Include executions if selected
      if (exportOptions.includeExecutions) {
        const { data: executions, error: executionsError } = await supabase
          .from('test_executions')
          .select('*')
          .in('test_case_id', testCases?.map(tc => tc.id) || []);

        if (executionsError) throw executionsError;
        exportData.executions = executions;
      }
      setProgress(50);

      // Include metadata if selected
      if (exportOptions.includeMetadata) {
        exportData.metadata = {
          exportedAt: new Date().toISOString(),
          exportedBy: user.id,
          version: '1.0',
          totalTestCases: testCases?.length || 0
        };
      }
      setProgress(75);

      // Generate file based on format
      let fileContent: string;
      let fileName: string;
      let mimeType: string;

      switch (exportFormat) {
        case 'json':
          fileContent = JSON.stringify(exportData, null, 2);
          fileName = `testflow-export-${new Date().toISOString().split('T')[0]}.json`;
          mimeType = 'application/json';
          break;

        case 'csv':
          // Convert test cases to CSV
          const csvHeader = 'ID,Title,Description,Type,Priority,Status,Created At\n';
          const csvRows = testCases?.map(tc => 
            `"${tc.id}","${tc.title}","${tc.description || ''}","${tc.type}","${tc.priority}","${tc.status}","${tc.created_at}"`
          ).join('\n') || '';
          fileContent = csvHeader + csvRows;
          fileName = `testflow-export-${new Date().toISOString().split('T')[0]}.csv`;
          mimeType = 'text/csv';
          break;

        case 'xml':
          // Convert to XML
          fileContent = `<?xml version="1.0" encoding="UTF-8"?>
<testflow-export>
  <metadata>
    <exportedAt>${new Date().toISOString()}</exportedAt>
    <totalTestCases>${testCases?.length || 0}</totalTestCases>
  </metadata>
  <testCases>
    ${testCases?.map(tc => `
    <testCase>
      <id>${tc.id}</id>
      <title><![CDATA[${tc.title}]]></title>
      <description><![CDATA[${tc.description || ''}]]></description>
      <type>${tc.type}</type>
      <priority>${tc.priority}</priority>
      <status>${tc.status}</status>
      <createdAt>${tc.created_at}</createdAt>
    </testCase>`).join('') || ''}
  </testCases>
</testflow-export>`;
          fileName = `testflow-export-${new Date().toISOString().split('T')[0]}.xml`;
          mimeType = 'application/xml';
          break;

        default:
          throw new Error('Unsupported export format');
      }

      setProgress(90);

      // Download file
      const blob = new Blob([fileContent], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setProgress(100);

      toast({
        title: "Export Successful",
        description: `${testCases?.length || 0} test cases exported as ${exportFormat.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: error.message || "Failed to export data",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
      setProgress(0);
    }
  };

  const importData = async (file: File) => {
    setImporting(true);
    setProgress(0);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const fileContent = await file.text();
      setProgress(25);

      let importData: any;
      
      if (file.name.endsWith('.json')) {
        importData = JSON.parse(fileContent);
      } else if (file.name.endsWith('.csv')) {
        // Parse CSV
        const lines = fileContent.split('\n');
        const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
        const testCases = lines.slice(1).filter(line => line.trim()).map(line => {
          const values = line.split(',').map(v => v.replace(/"/g, ''));
          const testCase: any = {};
          headers.forEach((header, index) => {
            testCase[header.toLowerCase().replace(' ', '_')] = values[index];
          });
          return testCase;
        });
        importData = { testCases };
      } else {
        throw new Error('Unsupported file format. Please use JSON or CSV.');
      }

      setProgress(50);

      // Validate and clean import data
      const testCasesToImport = importData.testCases?.map((tc: any) => ({
        title: tc.title || 'Imported Test Case',
        description: tc.description || '',
        type: tc.type || 'functional',
        priority: tc.priority || 'medium',
        status: 'todo',
        user_id: user.id,
        steps: tc.steps || null,
        expected_result: tc.expected_result || '',
        environment: tc.environment || '',
        test_data: tc.test_data || ''
      })) || [];

      setProgress(75);

      // Insert test cases
      if (testCasesToImport.length > 0) {
        const { error } = await supabase
          .from('test_cases')
          .insert(testCasesToImport);

        if (error) throw error;
      }

      setProgress(100);

      toast({
        title: "Import Successful",
        description: `${testCasesToImport.length} test cases imported successfully`,
      });

      onImportComplete?.();
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import Failed",
        description: error.message || "Failed to import data",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
      setProgress(0);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importData(file);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <exportIcon className="h-5 w-5" />
            Export Data
          </CardTitle>
          <CardDescription>
            Export your test cases and execution data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Export Format</Label>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="xml">XML</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Export Options</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-executions"
                  checked={exportOptions.includeExecutions}
                  onCheckedChange={(checked) => 
                    setExportOptions(prev => ({ ...prev, includeExecutions: checked as boolean }))
                  }
                />
                <label htmlFor="include-executions" className="text-sm">
                  Include test executions
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-screenshots"
                  checked={exportOptions.includeScreenshots}
                  onCheckedChange={(checked) => 
                    setExportOptions(prev => ({ ...prev, includeScreenshots: checked as boolean }))
                  }
                />
                <label htmlFor="include-screenshots" className="text-sm">
                  Include screenshots (JSON only)
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-metadata"
                  checked={exportOptions.includeMetadata}
                  onCheckedChange={(checked) => 
                    setExportOptions(prev => ({ ...prev, includeMetadata: checked as boolean }))
                  }
                />
                <label htmlFor="include-metadata" className="text-sm">
                  Include export metadata
                </label>
              </div>
            </div>
          </div>

          {exporting && (
            <div className="space-y-2">
              <Label>Export Progress</Label>
              <Progress value={progress} />
              <p className="text-xs text-muted-foreground">
                Exporting data... {progress}%
              </p>
            </div>
          )}

          <Button
            onClick={exportData}
            disabled={exporting}
            className="w-full"
          >
            {exporting ? (
              <>
                <exportIcon className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <importIcon className="h-5 w-5" />
            Import Data
          </CardTitle>
          <CardDescription>
            Import test cases from JSON or CSV files
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file-import">Select File</Label>
            <Input
              id="file-import"
              type="file"
              ref={fileInputRef}
              accept=".json,.csv"
              onChange={handleFileSelect}
              disabled={importing}
            />
            <p className="text-xs text-muted-foreground">
              Supported formats: JSON, CSV
            </p>
          </div>

          {importing && (
            <div className="space-y-2">
              <Label>Import Progress</Label>
              <Progress value={progress} />
              <p className="text-xs text-muted-foreground">
                Processing file... {progress}%
              </p>
            </div>
          )}

          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Import Guidelines:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• JSON files should contain a 'testCases' array</li>
              <li>• CSV files should have headers: Title, Description, Type, Priority</li>
              <li>• Existing test cases will not be modified</li>
              <li>• All imported test cases will have status 'todo'</li>
            </ul>
          </div>

          <Button
            variant="outline"
            className="w-full"
            disabled={importing}
            onClick={() => fileInputRef.current?.click()}
          >
            <FileText className="mr-2 h-4 w-4" />
            Choose File to Import
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
