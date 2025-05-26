
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const ReportDateRange = () => {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleApply = () => {
    if (!startDate || !endDate) {
      toast({
        title: "Date Selection Required",
        description: "Please select both start and end dates.",
        variant: "destructive",
      });
      return;
    }

    // Check if end date is before start date
    if (endDate < startDate) {
      toast({
        title: "Invalid Date Range",
        description: "End date cannot be before start date.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Date Range Applied",
      description: `Reports will show data from ${format(startDate, "PPP")} to ${format(endDate, "PPP")}.`,
    });
    
    // Return to reports page with date range set
    navigate('/reports', { 
      state: { 
        startDate: startDate.toISOString(), 
        endDate: endDate.toISOString() 
      } 
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
              Select Date Range
            </h1>
            <p className="text-white/90 text-lg">Choose a time period for your reports</p>
          </div>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0 max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <CalendarIcon className="h-5 w-5 text-pink-600" />
              Date Range Selection
            </CardTitle>
            <CardDescription>Select start and end dates for your reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="block mb-2 font-medium">Start Date</Label>
                <div className="border rounded-md p-3 bg-white">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    className="p-3 pointer-events-auto"
                  />
                </div>
                {startDate && (
                  <p className="text-sm text-gray-600 mt-2">
                    Selected: {format(startDate, "PPPP")}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="block mb-2 font-medium">End Date</Label>
                <div className="border rounded-md p-3 bg-white">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    className="p-3 pointer-events-auto"
                  />
                </div>
                {endDate && (
                  <p className="text-sm text-gray-600 mt-2">
                    Selected: {format(endDate, "PPPP")}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-end">
              <Button variant="outline" onClick={() => navigate('/reports')}>
                Cancel
              </Button>
              <Button 
                onClick={handleApply}
                className="bg-gradient-to-r from-pink-600 to-pink-800 hover:from-pink-700 hover:to-pink-900 text-white"
              >
                Apply Date Range
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportDateRange;
