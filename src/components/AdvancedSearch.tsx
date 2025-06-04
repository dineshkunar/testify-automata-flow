
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { search, filter, X, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface SearchFilters {
  searchTerm: string;
  status: string[];
  priority: string[];
  type: string[];
  assignee: string[];
  tags: string[];
  dateFrom?: Date;
  dateTo?: Date;
  environment: string[];
}

interface AdvancedSearchProps {
  onFiltersChange: (filters: SearchFilters) => void;
  onClearFilters: () => void;
}

export const AdvancedSearch = ({ onFiltersChange, onClearFilters }: AdvancedSearchProps) => {
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    status: [],
    priority: [],
    type: [],
    assignee: [],
    tags: [],
    environment: []
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const statusOptions = ['todo', 'in_progress', 'testing', 'done'];
  const priorityOptions = ['critical', 'high', 'medium', 'low'];
  const typeOptions = ['smoke', 'regression', 'integration', 'unit', 'e2e', 'functional'];
  const environmentOptions = ['development', 'staging', 'production', 'test'];
  const assigneeOptions = ['john-doe', 'jane-smith', 'bob-wilson', 'alice-brown'];
  const tagOptions = ['automation', 'manual', 'api', 'ui', 'performance', 'security'];

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const toggleArrayFilter = (key: keyof SearchFilters, value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    updateFilter(key, newArray);
  };

  const clearAllFilters = () => {
    const emptyFilters: SearchFilters = {
      searchTerm: '',
      status: [],
      priority: [],
      type: [],
      assignee: [],
      tags: [],
      environment: []
    };
    setFilters(emptyFilters);
    onClearFilters();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.searchTerm) count++;
    count += filters.status.length;
    count += filters.priority.length;
    count += filters.type.length;
    count += filters.assignee.length;
    count += filters.tags.length;
    count += filters.environment.length;
    if (filters.dateFrom) count++;
    if (filters.dateTo) count++;
    return count;
  };

  const renderCheckboxGroup = (
    label: string,
    options: string[],
    filterKey: keyof SearchFilters,
    selectedValues: string[]
  ) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="grid grid-cols-2 gap-2">
        {options.map(option => (
          <div key={option} className="flex items-center space-x-2">
            <Checkbox
              id={`${filterKey}-${option}`}
              checked={selectedValues.includes(option)}
              onCheckedChange={() => toggleArrayFilter(filterKey, option)}
            />
            <label 
              htmlFor={`${filterKey}-${option}`} 
              className="text-sm capitalize cursor-pointer"
            >
              {option.replace('_', ' ')}
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <search className="h-5 w-5" />
            Advanced Search & Filters
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary">
                {getActiveFiltersCount()} active
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <filter className="mr-2 h-4 w-4" />
              {showAdvanced ? 'Hide' : 'Show'} Filters
            </Button>
            {getActiveFiltersCount() > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
              >
                <X className="mr-2 h-4 w-4" />
                Clear All
              </Button>
            )}
          </div>
        </CardTitle>
        <CardDescription>
          Search and filter test cases with advanced criteria
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Basic Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              placeholder="Search test cases by title, description..."
              value={filters.searchTerm}
              onChange={(e) => updateFilter('searchTerm', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="space-y-6 pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderCheckboxGroup('Status', statusOptions, 'status', filters.status)}
              {renderCheckboxGroup('Priority', priorityOptions, 'priority', filters.priority)}
              {renderCheckboxGroup('Type', typeOptions, 'type', filters.type)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderCheckboxGroup('Environment', environmentOptions, 'environment', filters.environment)}
              {renderCheckboxGroup('Assignee', assigneeOptions, 'assignee', filters.assignee)}
              {renderCheckboxGroup('Tags', tagOptions, 'tags', filters.tags)}
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <Label>Date Range</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateFrom ? format(filters.dateFrom, "PPP") : "From date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dateFrom}
                      onSelect={(date) => updateFilter('dateFrom', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateTo ? format(filters.dateTo, "PPP") : "To date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dateTo}
                      onSelect={(date) => updateFilter('dateTo', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {getActiveFiltersCount() > 0 && (
          <div className="space-y-2">
            <Label>Active Filters</Label>
            <div className="flex flex-wrap gap-2">
              {filters.searchTerm && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: {filters.searchTerm}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilter('searchTerm', '')}
                  />
                </Badge>
              )}
              
              {[...filters.status, ...filters.priority, ...filters.type, 
                ...filters.assignee, ...filters.tags, ...filters.environment].map((filter, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {filter}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => {
                      // Find which array this filter belongs to and remove it
                      Object.keys(filters).forEach(key => {
                        if (Array.isArray(filters[key]) && filters[key].includes(filter)) {
                          toggleArrayFilter(key as keyof SearchFilters, filter);
                        }
                      });
                    }}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
