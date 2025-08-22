import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import {
	AuditeeDashboard,
	Home,
	LoginPage,
	AuditeeForm,
	NewEvaluation,
	EvaluationDashboard,
	EvaluationDetails,
	VulnerableAuditeeDashboard,
	DeviationDashboard,
	SignupPage,
} from "./pages/pageIndex.ts";
import {
	Layout,
	ProtectedRoute,
	PublicRoute,
} from "./components/layout/layoutIndex.ts";

const queryClient = new QueryClient();

const App = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<TooltipProvider>
				<Toaster />
				<Sonner />
				<Routes>
					<Route path="/" element={<Home />} />

					<Route element={<PublicRoute />}>
						<Route path="/login" element={<LoginPage />} />
						<Route path="/sign-up" element={<SignupPage />} />
					</Route>

					{/* <Route element={<ProtectedRoute />}> */}
						<Route element={<Layout />}>
							<Route path="/home" element={<Index />} />
							<Route
								path="/evaluation"
								element={<EvaluationDashboard />}
							/>
							<Route
								path="/evaluation/:companyId/:evaluationId"
								element={<EvaluationDetails />}
							/>
							<Route
								path="/new-evaluation"
								element={<NewEvaluation />}
							/>
							<Route
								path="/auditee/dashboard"
								element={<AuditeeDashboard />}
							/>
							<Route
								path="/auditee/new"
								element={<AuditeeForm />}
							/>
							<Route
								path="/auditee/edit/:auditeeId"
								element={<AuditeeForm />}
							/>
							<Route
								path="/auditee/vulnerable"
								element={<VulnerableAuditeeDashboard />}
							/>
							<Route
								path="/framework/deviation"
								element={<DeviationDashboard />}
							/>
						</Route>
					{/* </Route> */}
					<Route path="*" element={<NotFound />} />
				</Routes>
			</TooltipProvider>
		</QueryClientProvider>
	);
};

export default App;
