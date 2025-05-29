
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { UserMenu } from "@/components/UserMenu";

// Import all pages
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import TestCases from "./pages/TestCases";
import Integrations from "./pages/Integrations";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Marketplace from "./pages/Marketplace";
import MarketplaceTool from "./pages/MarketplaceTool";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import GenerateReport from "./pages/GenerateReport";
import FilterTestCases from "./pages/FilterTestCases";
import SetupWizard from "./pages/SetupWizard";
import IntegrationDocs from "./pages/IntegrationDocs";
import ReportDateRange from "./pages/ReportDateRange";
import ExportReport from "./pages/ExportReport";
import Auth from "./pages/Auth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Auth />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <SidebarProvider>
                  <div className="min-h-screen flex w-full">
                    <AppSidebar />
                    <SidebarInset>
                      <header className="flex h-16 items-center gap-2 border-b bg-sidebar px-4">
                        <SidebarTrigger className="-ml-1" />
                        <div className="h-4 w-px bg-sidebar-border mx-2" />
                        <h1 className="text-lg font-semibold">TestFlow Pro</h1>
                        <div className="ml-auto">
                          <UserMenu />
                        </div>
                      </header>
                      <main className="flex-1">
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/test-cases" element={<TestCases />} />
                          <Route path="/integrations" element={
                            <ProtectedRoute adminOnly>
                              <Integrations />
                            </ProtectedRoute>
                          } />
                          <Route path="/reports" element={<Reports />} />
                          <Route path="/marketplace" element={<Marketplace />} />
                          <Route path="/marketplace/:toolId" element={<MarketplaceTool />} />
                          <Route path="/settings" element={
                            <ProtectedRoute adminOnly>
                              <Settings />
                            </ProtectedRoute>
                          } />
                          <Route path="/profile" element={<Profile />} />
                          
                          {/* New routes */}
                          <Route path="/generate-report" element={<GenerateReport />} />
                          <Route path="/filter-test-cases" element={<FilterTestCases />} />
                          <Route path="/setup-wizard" element={
                            <ProtectedRoute adminOnly>
                              <SetupWizard />
                            </ProtectedRoute>
                          } />
                          <Route path="/integration-docs" element={<IntegrationDocs />} />
                          <Route path="/report-date-range" element={<ReportDateRange />} />
                          <Route path="/export-report" element={<ExportReport />} />
                          
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </main>
                    </SidebarInset>
                  </div>
                </SidebarProvider>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
