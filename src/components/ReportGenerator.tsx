
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, FileText } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const ReportGenerator = () => {
  const [reportName, setReportName] = useState("");
  const [reportType, setReportType] = useState("");
  const [description, setDescription] = useState("");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateReport = async () => {
    if (!reportName || !reportType || !dateFrom || !dateTo) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('reports')
        .insert([{
          name: reportName,
          type: reportType,
          description,
          date_from: format(dateFrom, 'yyyy-MM-dd'),
          date_to: format(dateTo, 'yyyy-MM-dd'),
          user_id: user.id,
          status: 'generating'
        }]);

      if (error) throw error;

      // Simulate report generation process
      setTimeout(async () => {
        await supabase
          .from('reports')
          .update({ status: 'completed' })
          .eq('user_id', user.id)
          .eq('name', reportName);
      }, 3000);

      toast({
        title: "Report Generation Started",
        description: `${reportName} is being generated. You'll be notified when it's ready.`,
      });
      
      // Reset form
      setReportName("");
      setReportType("");
      setDescription("");
      setDateFrom(undefined);
      setDateTo(undefined);
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Generate Report
        </CardTitle>
        <CardDescription>Create custom reports for your testing activities</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  variant="outline"
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
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Date To *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
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
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            placeholder="Add a description for this report..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <Button onClick={handleGenerateReport} disabled={isGenerating} className="w-full">
          {isGenerating ? "Generating..." : "Generate Report"}
        </Button>
      </CardContent>
    </Card>
  );
};
