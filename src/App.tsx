import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ThankYou from "./pages/ThankYou";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import AccessCodeQualification from "./pages/AccessCodeQualification";
import Demographics from "./pages/Demographics";
import ChangeReward from "./pages/ChangeReward";
import ReactorSupport from "./pages/ReactorSupport";
import ScoringHistory from "./pages/ScoringHistory";
import FunStats from "./pages/FunStats";
import FinalStep from "./pages/FinalStep";
import StatusNotes from "./pages/StatusNotes";
import ReactorWarnings from "./pages/ReactorWarnings";
import ApiAccess from "./pages/ApiAccess";
import AdminManagement from "./pages/AdminManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
            {/* Public Routes */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/management" element={<AdminManagement />} />
            <Route path="/access-code-qualification" element={<AccessCodeQualification />} />
            <Route path="/demographics" element={<Demographics />} />
            <Route path="/final-step" element={<FinalStep />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Index />} />
              <Route path="/status-notes" element={<StatusNotes />} />
              <Route path="/reactor-warnings" element={<ReactorWarnings />} />
              <Route path="/api-access" element={<ApiAccess />} />
              <Route path="/change-reward" element={<ChangeReward />} />
              <Route path="/reactor-support" element={<ReactorSupport />} />
              <Route path="/scoring-history" element={<ScoringHistory />} />
              <Route path="/fun-stats" element={<FunStats />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
