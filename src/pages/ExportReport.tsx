
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, FileText, FilePdf, FileSpreadsheet, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const ExportReport = () => {
  const [fileFormat, setFileFormat] = useState("pdf");
  const [sendEmail, setSendEmail] = useState(false);
  const [includeSummary, setIncludeSummary] = useState(true);
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeRawData, setIncludeRawData] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleExport = () => {
    toast({
      title: "Report Exported",
      description: `Report has been exported as ${fileFormat.toUpperCase()}.${sendEmail ? " A copy has been emailed to you." : ""}`,
    });
    navigate('/reports');
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #970747 0%, #FFFFFF 50%, #970747 100%)' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-white/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-pink-100 bg-clip-text text-transparent">
              Export Report
            </h1>
            <p className="text-white/90 text-lg">Configure your report export options</p>
          </div>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0 max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Download className="h-5 w-5 text-pink-600" />
              Export Options
            </CardTitle>
            <CardDescription>Choose your preferred export format and options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>File Format</Label>
              <RadioGroup value={fileFormat} onValueChange={setFileFormat} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2 border rounded p-3 hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="pdf" id="pdf" />
                  <Label htmlFor="pdf" className="flex items-center cursor-pointer">
                    <FilePdf className="mr-2 h-4 w-4 text-red-500" />
                    PDF Document
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded p-3 hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="excel" id="excel" />
                  <Label htmlFor="excel" className="flex items-center cursor-pointer">
                    <FileSpreadsheet className="mr-2 h-4 w-4 text-green-500" />
                    Excel Spreadsheet
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded p-3 hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="csv" id="csv" />
                  <Label htmlFor="csv" className="flex items-center cursor-pointer">
                    <FileText className="mr-2 h-4 w-4 text-blue-500" />
                    CSV File
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <Label>Content Options</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="include-summary" 
                    checked={includeSummary} 
                    onCheckedChange={(checked) => setIncludeSummary(!!checked)} 
                  />
                  <label 
                    htmlFor="include-summary" 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Include executive summary
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="include-charts" 
                    checked={includeCharts} 
                    onCheckedChange={(checked) => setIncludeCharts(!!checked)} 
                  />
                  <label 
                    htmlFor="include-charts" 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Include charts and visualizations
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="include-raw-data" 
                    checked={includeRawData} 
                    onCheckedChange={(checked) => setIncludeRawData(!!checked)} 
                  />
                  <label 
                    htmlFor="include-raw-data" 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Include raw test data
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="send-email" 
                  checked={sendEmail} 
                  onCheckedChange={(checked) => setSendEmail(!!checked)} 
                />
                <label 
                  htmlFor="send-email" 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Send a copy to my email
                </label>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button 
                onClick={handleExport}
                className="bg-gradient-to-r from-pink-600 to-pink-800 hover:from-pink-700 hover:to-pink-900 text-white flex-1"
              >
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/reports')}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExportReport;
