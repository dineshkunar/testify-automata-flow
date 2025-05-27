
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, Star, TestTube, Code, Book, Settings, MessageSquare, Check, Github, 
  BarChart, Zap, Shield, Clock 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const tools = {
  "selenium": {
    name: "Selenium WebDriver",
    description: "Automate web browsers for comprehensive UI testing",
    longDescription: "Selenium WebDriver is an open-source automation framework that allows you to control web browsers programmatically. It provides a way to create robust, browser-based regression automation suites and tests, scale and distribute scripts across multiple environments.",
    category: "UI Testing",
    rating: 4.8,
    downloads: "2.3M",
    icon: TestTube,
    price: "Free",
    tags: ["Automation", "Cross-browser", "Popular"],
    version: "4.8.1",
    lastUpdate: "2 weeks ago",
    developer: "Selenium Project",
    documentation: "https://www.selenium.dev/documentation/",
    repository: "https://github.com/SeleniumHQ/selenium",
    requirements: ["Java 8+", "Browser Drivers", "TestNG or JUnit (optional)"],
    features: [
      "Cross-browser testing support",
      "Multiple programming language bindings",
      "WebDriver Protocol implementation",
      "Integrates with CI/CD pipelines",
      "Advanced user interactions API",
      "Screenshot capture on failure"
    ]
  },
  "jest": {
    name: "Jest Testing Framework",
    description: "JavaScript testing framework with built-in assertions",
    longDescription: "Jest is a delightful JavaScript Testing Framework with a focus on simplicity. It works with projects using: Babel, TypeScript, Node, React, Angular, Vue, and more. Jest aims to work out of the box and is config-minimal.",
    category: "Unit Testing",
    rating: 4.9,
    downloads: "1.8M",
    icon: Zap,
    price: "Free",
    tags: ["JavaScript", "Unit Tests", "Mocking"],
    version: "29.5.0",
    lastUpdate: "1 month ago",
    developer: "Facebook",
    documentation: "https://jestjs.io/docs/getting-started",
    repository: "https://github.com/facebook/jest",
    requirements: ["Node.js 14+", "npm/yarn"],
    features: [
      "Zero configuration testing",
      "Snapshot testing",
      "Fast and interactive watch mode",
      "Built-in code coverage reports",
      "Powerful mocking library",
      "Isolated test environment"
    ]
  },
  "cypress": {
    name: "Cypress E2E Testing",
    description: "Modern end-to-end testing for web applications",
    longDescription: "Cypress is a next-generation front-end testing tool built for the modern web. It addresses the key pain points developers and QA engineers face when testing modern applications.",
    category: "E2E Testing",
    rating: 4.8,
    downloads: "967K",
    icon: TestTube,
    price: "Freemium",
    tags: ["E2E", "Modern", "Developer-friendly"],
    version: "12.3.0",
    lastUpdate: "3 weeks ago",
    developer: "Cypress.io",
    documentation: "https://docs.cypress.io",
    repository: "https://github.com/cypress-io/cypress",
    requirements: ["Node.js 14+", "Chrome, Firefox, or Edge browser"],
    features: [
      "Time travel debugging",
      "Real-time reloads",
      "Automatic waiting",
      "Network traffic control",
      "Consistent results",
      "Screenshots and videos"
    ]
  }
};

const MarketplaceTool = () => {
  const { toolId = "selenium" } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [installing, setInstalling] = useState(false);
  
  const tool = tools[toolId as keyof typeof tools] || tools.selenium;

  const handleInstall = () => {
    setInstalling(true);
    
    // Simulate installation
    setTimeout(() => {
      setInstalling(false);
      toast({
        title: "Installation Complete",
        description: `${tool.name} has been successfully installed.`,
      });
    }, 2000);
  };
  
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #970747 0%, #FFFFFF 50%, #970747 100%)' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-white/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 p-6 space-y-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/marketplace')}
          className="bg-white/80 border-white/20 text-gray-800 mb-4"
        >
          ← Back to Marketplace
        </Button>

        <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                  <tool.icon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-gray-800">
                    {tool.name}
                    <Badge className="ml-2 bg-blue-100 text-blue-800 border-blue-200 text-xs">v{tool.version}</Badge>
                  </CardTitle>
                  <CardDescription className="text-base">{tool.description}</CardDescription>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <div className="flex items-center bg-amber-50 text-amber-700 px-3 py-1 rounded-full">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400 mr-1" />
                  <span className="font-semibold">{tool.rating}</span>
                </div>
                <Badge variant="outline" className="text-gray-600">
                  {tool.downloads} downloads
                </Badge>
                <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white border-0">
                  {tool.price}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <Tabs defaultValue="overview" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-5 bg-gray-100">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="features">Features</TabsTrigger>
                    <TabsTrigger value="requirements">Requirements</TabsTrigger>
                    <TabsTrigger value="usage">Usage</TabsTrigger>
                    <TabsTrigger value="support">Support</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Description</h3>
                      <p className="text-gray-700">{tool.longDescription}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {tool.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-sm border-gray-200 text-gray-700">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="features" className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Key Features</h3>
                      <ul className="space-y-2">
                        {tool.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-gray-700">
                            <Check className="h-4 w-4 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>

                  <TabsContent value="requirements" className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">System Requirements</h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {tool.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>

                  <TabsContent value="usage" className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Quick Start</h3>
                      <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                        <Code className="inline mr-2 h-4 w-4" />
                        {tool.name === "Selenium WebDriver" ? (
                          <div>
                            # Install with npm<br/>
                            npm install selenium-webdriver<br/><br/>
                            # Basic example<br/>
                            const {"{WebDriver, Builder, By}"} = require('selenium-webdriver');<br/>
                            const driver = new Builder().forBrowser('chrome').build();
                          </div>
                        ) : tool.name === "Jest Testing Framework" ? (
                          <div>
                            # Install with npm<br/>
                            npm install --save-dev jest<br/><br/>
                            # Basic example<br/>
                            test('adds 1 + 2 to equal 3', () => {"{"}<br/>
                            {"  "}expect(1 + 2).toBe(3);<br/>
                            {"}"});
                          </div>
                        ) : (
                          <div>
                            # Install with npm<br/>
                            npm install cypress<br/><br/>
                            # Basic example<br/>
                            describe('My First Test', () => {"{"}<br/>
                            {"  "}it('Visits the Kitchen Sink', () => {"{"}<br/>
                            {"    "}cy.visit('https://example.cypress.io');<br/>
                            {"  "}{"}"});<br/>
                            {"}"});
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="support" className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Support Resources</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Book className="h-5 w-5 text-blue-600" />
                          <a href={tool.documentation} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            Documentation
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Github className="h-5 w-5 text-gray-700" />
                          <a href={tool.repository} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            GitHub Repository
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-5 w-5 text-purple-600" />
                          <span>Community Forums</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              <div className="w-full lg:w-64 space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Developer</span>
                      <span className="font-medium text-gray-800">{tool.developer}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Last Update</span>
                      <span className="font-medium text-gray-800">{tool.lastUpdate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Category</span>
                      <span className="font-medium text-gray-800">{tool.category}</span>
                    </div>
                    <div className="pt-4 grid gap-2">
                      <Button 
                        onClick={handleInstall}
                        disabled={installing}
                        className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white w-full"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        {installing ? "Installing..." : "Install Now"}
                      </Button>
                      <Button variant="outline" className="w-full">
                        <BarChart className="mr-2 h-4 w-4" />
                        View Stats
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Related Tools</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.values(tools)
                      .filter(relatedTool => relatedTool.name !== tool.name)
                      .slice(0, 2)
                      .map(relatedTool => (
                        <div key={relatedTool.name} className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                            <relatedTool.icon className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="text-sm">
                            <p className="font-medium">{relatedTool.name}</p>
                            <p className="text-gray-500 text-xs">{relatedTool.category}</p>
                          </div>
                        </div>
                      ))
                    }
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarketplaceTool;
