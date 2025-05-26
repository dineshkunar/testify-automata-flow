
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Download, FileText, BarChart3 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const GenerateReport = () => {
  const [reportName, setReportName] = useState("");
  const [reportType, setReportType] = useState("");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeDetails, setIncludeDetails] = useState(true);
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  const handleGenerateReport = () => {
    if (!reportName || !reportType || !dateFrom || !dateTo) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Report Generated",
      description: `${reportName} has been generated successfully.`,
    });
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
              Generate Report
            </h1>
            <p className="text-white/90 text-lg">Create custom reports for your testing activities</p>
          </div>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0 max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <FileText className="h-5 w-5 text-pink-600" />
              Report Configuration
            </CardTitle>
            <CardDescription>Configure your custom report settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="report-name">Report Name *</Label>
                <Input
                  id="report-name"
                  placeholder="Enter report name"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="report-type">Report Type *</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summary">Test Summary Report</SelectItem>
                    <SelectItem value="detailed">Detailed Test Report</SelectItem>
                    <SelectItem value="performance">Performance Report</SelectItem>
                    <SelectItem value="coverage">Coverage Report</SelectItem>
                    <SelectItem value="trend">Trend Analysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date From *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateFrom && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={setDateFrom}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Date To *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateTo && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateTo}
                      onSelect={setDateTo}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Report Options</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-charts"
                    checked={includeCharts}
                    onCheckedChange={setIncludeCharts}
                  />
                  <label htmlFor="include-charts" className="text-sm font-medium">
                    Include charts and graphs
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-details"
                    checked={includeDetails}
                    onCheckedChange={setIncludeDetails}
                  />
                  <label htmlFor="include-details" className="text-sm font-medium">
                    Include detailed test case information
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Add a description for this report..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-24"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleGenerateReport}
                className="bg-gradient-to-r from-pink-600 to-pink-800 hover:from-pink-700 hover:to-pink-900 text-white"
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setReportName("");
                  setReportType("");
                  setDateFrom(undefined);
                  setDateTo(undefined);
                  setDescription("");
                }}
              >
                Reset Form
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GenerateReport;
