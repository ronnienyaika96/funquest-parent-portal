
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Index />} />
          <Route path="/children" element={<Index />} />
          <Route path="/progress" element={<Index />} />
          <Route path="/shop" element={<Index />} />
          <Route path="/orders" element={<Index />} />
          <Route path="/subscriptions" element={<Index />} />
          <Route path="/printables" element={<Index />} />
          <Route path="/notifications" element={<Index />} />
          <Route path="/settings" element={<Index />} />
          
          {/* Admin Dashboard Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminDashboard />} />
          <Route path="/admin/games" element={<AdminDashboard />} />
          <Route path="/admin/books" element={<AdminDashboard />} />
          <Route path="/admin/subscriptions" element={<AdminDashboard />} />
          <Route path="/admin/content" element={<AdminDashboard />} />
          <Route path="/admin/newsletter" element={<AdminDashboard />} />
          <Route path="/admin/analytics" element={<AdminDashboard />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
