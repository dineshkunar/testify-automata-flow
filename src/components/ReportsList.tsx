
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Report {
  id: string;
  name: string;
  type: string;
  status: string;
  created_at: string;
  date_from: string;
  date_to: string;
}

const ReportsList = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast({
        title: "Error",
        description: "Failed to load reports.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (reportId: string) => {
    toast({
      title: "Download Started",
      description: "Your report download has started.",
    });
  };

  const handleView = (reportId: string) => {
    toast({
      title: "Opening Report",
      description: "Opening report in viewer...",
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading reports...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generated Reports</CardTitle>
        <CardDescription>View and download your generated reports</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <h4 className="font-medium">{report.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {report.type} • {format(new Date(report.date_from), 'MMM d')} - {format(new Date(report.date_to), 'MMM d, yyyy')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Created {format(new Date(report.created_at), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={
                  report.status === 'completed' ? 'default' : 
                  report.status === 'failed' ? 'destructive' : 
                  'secondary'
                }>
                  {report.status}
                </Badge>
                {report.status === 'completed' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(report.id)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(report.id)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
          {reports.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No reports generated yet. Create your first report!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportsList;
