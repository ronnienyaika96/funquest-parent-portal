
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmation from "./pages/OrderConfirmation";
import ResetPassword from "./pages/ResetPassword";
import LandingPage from "./pages/LandingPage";
import KidsDashboard from "./pages/KidsDashboard";
import ParentDashboard from "./pages/ParentDashboard";
import AdminPanel from "./pages/AdminPanel";
import AdminAuthPage from "./pages/AdminAuthPage";
import ActivitiesPage from "./pages/ActivitiesPage";
import PlayActivityPage from "./pages/PlayActivityPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Main Landing Page */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Redirect /play to /activities */}
            <Route path="/play" element={<Navigate to="/activities" replace />} />
            
            {/* Activities & Game Player */}
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="/play/:activityId" element={<PlayActivityPage />} />
            
            {/* Parent Dashboard */}
            <Route path="/parent" element={<ParentDashboard />} />
            
            {/* Admin Panel */}
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/login" element={<AdminAuthPage />} />
            
            {/* Auth */}
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Public Routes */}
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
