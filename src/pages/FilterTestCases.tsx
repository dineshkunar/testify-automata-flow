
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Filter, Search, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FilterTestCases = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [category, setCategory] = useState("");
  const [assignee, setAssignee] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { toast } = useToast();

  const availableTags = ["Automation", "Manual", "Regression", "Smoke", "API", "UI", "Performance"];

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleApplyFilter = () => {
    const filterCount = [searchTerm, status, priority, category, assignee, ...selectedTags].filter(Boolean).length;
    toast({
      title: "Filters Applied",
      description: `${filterCount} filter(s) have been applied to test cases.`,
    });
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatus("");
    setPriority("");
    setCategory("");
    setAssignee("");
    setSelectedTags([]);
    toast({
      title: "Filters Cleared",
      description: "All filters have been cleared.",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Filter Test Cases</h1>
          <p className="text-muted-foreground">Apply filters to find specific test cases</p>
        </div>
        <Button variant="outline" onClick={handleClearFilters}>
          <X className="mr-2 h-4 w-4" />
          Clear All Filters
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Options
          </CardTitle>
          <CardDescription>Configure filters to narrow down your test case search</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="search">Search Term</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search test cases..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="passed">Passed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="smoke">Smoke Test</SelectItem>
                  <SelectItem value="regression">Regression</SelectItem>
                  <SelectItem value="integration">Integration</SelectItem>
                  <SelectItem value="unit">Unit Test</SelectItem>
                  <SelectItem value="e2e">End-to-End</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignee">Assignee</Label>
              <Select value={assignee} onValueChange={setAssignee}>
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="john-doe">John Doe</SelectItem>
                  <SelectItem value="jane-smith">Jane Smith</SelectItem>
                  <SelectItem value="bob-wilson">Bob Wilson</SelectItem>
                  <SelectItem value="alice-brown">Alice Brown</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <div key={tag} className="flex items-center space-x-2">
                  <Checkbox
                    id={tag}
                    checked={selectedTags.includes(tag)}
                    onCheckedChange={() => handleTagToggle(tag)}
                  />
                  <label htmlFor={tag} className="text-sm font-medium">
                    {tag}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {selectedTags.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Tags</Label>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map(tag => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleTagToggle(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <Button onClick={handleApplyFilter}>
              <Filter className="mr-2 h-4 w-4" />
              Apply Filters
            </Button>
            <Button variant="outline" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FilterTestCases;
