
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Star, Download, Zap, TestTube, Shield, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const tools = [
  {
    id: "selenium",
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
    id: "jest",
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
    id: "postman",
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
    id: "owasp",
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
    id: "jmeter",
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
    id: "cypress",
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
  const { toast } = useToast();
  const navigate = useNavigate();

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...Array.from(new Set(tools.map(tool => tool.category)))];

  const handleViewTool = (toolId: string) => {
    navigate(`/marketplace/${toolId}`);
  };

  const handleInstall = (toolName: string) => {
    toast({
      title: "Installation Started",
      description: `Installing ${toolName}. This may take a few moments.`,
    });
  };

  const handleSubmitTool = () => {
    toast({
      title: "Submit Your Tool",
      description: "Opening tool submission form...",
    });
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #970747 0%, #FFFFFF 50%, #970747 100%)' }}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-pink-100 bg-clip-text text-transparent">
              Tool Marketplace
            </h1>
            <p className="text-lg text-white/90 mt-2">Discover and integrate the best testing tools for your workflow</p>
          </div>
          <Button 
            onClick={handleSubmitTool}
            className="bg-gradient-to-r from-pink-600 to-pink-800 hover:from-pink-700 hover:to-pink-900 text-white shadow-lg"
          >
            Submit Your Tool
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search tools and frameworks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/80 backdrop-blur-sm border-gray-200 shadow-sm"
            />
          </div>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-7 bg-white/60 backdrop-blur-sm shadow-sm">
            {categories.map(category => (
              <TabsTrigger 
                key={category} 
                value={category} 
                className="text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-600 data-[state=active]:to-pink-800 data-[state=active]:text-white"
              >
                {category === "all" ? "All" : category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="space-y-6">
            {/* Featured Tools */}
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-white">Featured Tools</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.slice(0, 3).map((tool) => (
                  <Card key={tool.id} className="relative overflow-hidden bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border-0">
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-gradient-to-r from-pink-600 to-pink-800 text-white border-0">Featured</Badge>
                    </div>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-600 to-pink-800 shadow-lg">
                          <tool.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-gray-800">{tool.name}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs ml-1 text-gray-600">{tool.rating}</span>
                            </div>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">{tool.downloads} downloads</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-4 text-gray-600">
                        {tool.description}
                      </CardDescription>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {tool.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs border-gray-200 text-gray-600">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-pink-600">{tool.price}</span>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-gray-200 hover:bg-gray-50"
                            onClick={() => handleViewTool(tool.id)}
                          >
                            Learn More
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white border-0"
                            onClick={() => handleInstall(tool.name)}
                          >
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
              <h2 className="text-2xl font-semibold mb-4 text-white">All Tools</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.map((tool) => (
                  <Card key={tool.id} className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border-0">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-pink-600 to-pink-800 shadow-md">
                          <tool.icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-gray-800">{tool.name}</CardTitle>
                          <Badge variant="outline" className="text-xs mt-1 border-pink-200 text-pink-600">
                            {tool.category}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-4 text-gray-600">
                        {tool.description}
                      </CardDescription>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm ml-1 text-gray-600">{tool.rating}</span>
                          </div>
                          <span className="text-sm text-gray-500">{tool.downloads}</span>
                        </div>
                        <span className="font-medium text-pink-600">{tool.price}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 border-gray-200 hover:bg-gray-50"
                          onClick={() => handleViewTool(tool.id)}
                        >
                          Learn More
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white border-0"
                          onClick={() => handleInstall(tool.name)}
                        >
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
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-gray-800">Recommended for You</CardTitle>
            <CardDescription className="text-gray-600">Based on your current test suite and project needs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                    <TestTube className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Playwright for E2E Testing</h4>
                    <p className="text-sm text-gray-600">Perfect for your React application testing needs</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
                  onClick={() => handleViewTool("playwright")}
                >
                  View Tool
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gradient-to-r from-green-50 to-blue-50">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-blue-600">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">SonarQube Code Quality</h4>
                    <p className="text-sm text-gray-600">Enhance your code quality and security testing</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white border-0"
                  onClick={() => handleViewTool("sonarqube")}
                >
                  View Tool
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Marketplace;
