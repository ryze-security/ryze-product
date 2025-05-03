
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Evaluations from "./pages/Evaluations";
import ControlQuestions from "./pages/ControlQuestions";
import QuestionDetail from "./pages/QuestionDetail";
import CompanySelection from "./pages/CompanySelection";
import FrameworkSelection from "./pages/FrameworkSelection";
import DocumentUpload from "./pages/DocumentUpload";
import EvaluationStart from "./pages/EvaluationStart";
import NotFound from "./pages/NotFound";
import {AuditeeDashboard, Home, LoginPage, AuditeeForm, NewEvaluation} from "./pages/pageIndex.ts";
import Layout from "./components/layout/Layout.tsx";
import { useEffect } from "react";
import { loadCompanyData } from "./store/slices/companySlice.ts";
import { useAppDispatch } from "./store/hooks.ts";


const queryClient = new QueryClient();
const token ="123";

const App = () => {

  return <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />

          <Route element={<Layout />}>
            <Route path="/home" element={<Index />} />
            <Route path="/evaluations" element={<Evaluations />} />
            <Route path="/dashboard/:id" element={<Dashboard />} />
            <Route path="/control/:id/questions" element={<ControlQuestions />} />
            <Route path="/control/:controlId/question/:questionId" element={<QuestionDetail />} />
            <Route path="/new-evaluation" element={<NewEvaluation />} />
            <Route path="/auditee/dashboard" element={<AuditeeDashboard />} />
            <Route path="/auditee/new" element={<AuditeeForm />} />
            <Route path="/auditee/edit/:auditeeId" element={<AuditeeForm />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
};

export default App;
