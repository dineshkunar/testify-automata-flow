
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Star, Download, Zap, TestTube, Shield, Clock } from "lucide-react";

const tools = [
  {
    name: "Selenium WebDriver",
    description: "Automate web browsers for comprehensive UI testing",
    category: "UI Testing",
    rating: 4.8,
    downloads: "2.3M",
    icon: TestTube,
    price: "Free",
    tags: ["Automation", "Cross-browser", "Popular"]
  },
  {
    name: "Jest Testing Framework",
    description: "JavaScript testing framework with built-in assertions",
    category: "Unit Testing",
    rating: 4.9,
    downloads: "1.8M",
    icon: Zap,
    price: "Free",
    tags: ["JavaScript", "Unit Tests", "Mocking"]
  },
  {
    name: "Postman API Testing",
    description: "Complete API testing and documentation platform",
    category: "API Testing",
    rating: 4.7,
    downloads: "3.1M",
    icon: Zap,
    price: "Freemium",
    tags: ["API", "REST", "Documentation"]
  },
  {
    name: "OWASP ZAP Security",
    description: "Automated security vulnerability scanner",
    category: "Security Testing",
    rating: 4.6,
    downloads: "890K",
    icon: Shield,
    price: "Free",
    tags: ["Security", "OWASP", "Vulnerability"]
  },
  {
    name: "JMeter Load Testing",
    description: "Performance and load testing for web applications",
    category: "Performance",
    rating: 4.5,
    downloads: "1.2M",
    icon: Clock,
    price: "Free",
    tags: ["Performance", "Load Testing", "Apache"]
  },
  {
    name: "Cypress E2E Testing",
    description: "Modern end-to-end testing for web applications",
    category: "E2E Testing",
    rating: 4.8,
    downloads: "967K",
    icon: TestTube,
    price: "Freemium",
    tags: ["E2E", "Modern", "Developer-friendly"]
  }
];

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...Array.from(new Set(tools.map(tool => tool.category)))];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tool Marketplace</h1>
          <p className="text-muted-foreground">Discover and integrate the best testing tools for your workflow</p>
        </div>
        <Button>Submit Your Tool</Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tools and frameworks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-7">
          {categories.map(category => (
            <TabsTrigger key={category} value={category} className="text-xs">
              {category === "all" ? "All" : category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-6">
          {/* Featured Tools */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Featured Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.slice(0, 3).map((tool) => (
                <Card key={tool.name} className="relative overflow-hidden">
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary">Featured</Badge>
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <tool.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{tool.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs ml-1">{tool.rating}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{tool.downloads} downloads</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">
                      {tool.description}
                    </CardDescription>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {tool.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-primary">{tool.price}</span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Learn More
                        </Button>
                        <Button size="sm">
                          <Download className="mr-1 h-3 w-3" />
                          Install
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* All Tools */}
          <div>
            <h2 className="text-xl font-semibold mb-4">All Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool) => (
                <Card key={tool.name}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <tool.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{tool.name}</CardTitle>
                        <Badge variant="outline" className="text-xs mt-1">
                          {tool.category}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">
                      {tool.description}
                    </CardDescription>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm ml-1">{tool.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{tool.downloads}</span>
                      </div>
                      <span className="font-medium text-primary">{tool.price}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Details
                      </Button>
                      <Button size="sm" className="flex-1">
                        <Download className="mr-1 h-3 w-3" />
                        Install
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended for You</CardTitle>
          <CardDescription>Based on your current test suite and project needs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <TestTube className="h-8 w-8 text-primary" />
                <div>
                  <h4 className="font-medium">Playwright for E2E Testing</h4>
                  <p className="text-sm text-muted-foreground">Perfect for your React application testing needs</p>
                </div>
              </div>
              <Button size="sm">View Tool</Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <Shield className="h-8 w-8 text-primary" />
                <div>
                  <h4 className="font-medium">SonarQube Code Quality</h4>
                  <p className="text-sm text-muted-foreground">Enhance your code quality and security testing</p>
                </div>
              </div>
              <Button size="sm">View Tool</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Marketplace;
