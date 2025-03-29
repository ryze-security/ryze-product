
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import OrganizationalControls from "./pages/OrganizationalControls";
import ControlDetail from "./pages/ControlDetail";
import ControlQuestions from "./pages/ControlQuestions";
import NewEvaluation from "./pages/NewEvaluation";
import CompanySelection from "./pages/CompanySelection";
import FrameworkSelection from "./pages/FrameworkSelection";
import DocumentUpload from "./pages/DocumentUpload";
import EvaluationStart from "./pages/EvaluationStart";
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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/organizational" element={<OrganizationalControls />} />
          <Route path="/control/:id" element={<ControlDetail />} />
          <Route path="/control/:id/questions" element={<ControlQuestions />} />
          <Route path="/new-evaluation" element={<NewEvaluation />} />
          <Route path="/evaluation/company" element={<CompanySelection />} />
          <Route path="/evaluation/framework" element={<FrameworkSelection />} />
          <Route path="/evaluation/document" element={<DocumentUpload />} />
          <Route path="/evaluation/start" element={<EvaluationStart />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
