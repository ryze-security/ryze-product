import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Loader2, RotateCcw, Share2 } from "lucide-react";
import { AssessmentResultsChart } from "@/components/self_assessment/AssessmentResultsChart";
import { GenericDataTable } from "@/components/GenericDataTable";
import {
	resultsColumns,
	AssessmentRowData,
} from "@/components/self_assessment/selfAssessmentResultColumns";
import selfAssessmentService from "@/services/selfAssessmentServices";
import {
	completeAssessment,
	loadQuestions,
} from "@/store/slices/selfAssessmentSlice";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const SelfAssessmentResults = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { toast } = useToast();
	const token = searchParams.get("token");
	const dispatch = useAppDispatch();
	const { result, domains, status } = useAppSelector(
		(state) => state.selfAssessment
	);
	const [selectedDomainId, setSelectedDomainId] = useState<number | null>(
		null
	);
	const [isRecovering, setIsRecovering] = useState(false);

	useEffect(() => {
		if (!token) {
			navigate("/nis2/assessment");
			return;
		}

		const recoverSession = async () => {
			// If we already have results, do nothing
			if (result && domains.length > 0) return;

			// If we have no results but a valid session token, try to refetch
			if (!result && selfAssessmentService.hasActiveSession()) {
				setIsRecovering(true);
				try {
					// 1. We need the static domain data for the table
					if (domains.length === 0) {
						await dispatch(loadQuestions()).unwrap();
					}
					// 2. We need the score results
					await dispatch(completeAssessment()).unwrap();
				} catch (error) {
					// If fetching fails (token expired?), redirect to start
					navigate("/nis2/assessment");
				} finally {
					setIsRecovering(false);
				}
			} else if (!result && !selfAssessmentService.hasActiveSession()) {
				// No result and no token? Definitely go back to start.
				navigate("/nis2/assessment");
			}
		};

		recoverSession();
	}, [token, result, domains.length, dispatch, navigate]);

	const handleShare = () => {
		// Share is just the current URL!
		navigator.clipboard.writeText(window.location.href);
		toast({
			title: "Link Copied!",
			description: "Share this URL to show this report.",
		});
	};

	if (isRecovering || (!result && status === "loading")) {
		return (
			<div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
				<Loader2 className="w-12 h-12 animate-spin text-violet-ryzr mb-4" />
				<p className="text-zinc-400 animate-pulse">
					Retrieving your report...
				</p>
			</div>
		);
	}

	if (!result) return null;

	// --- 1. Flatten Data for GenericDataTable ---
	const tableData: AssessmentRowData[] = result.domain_results.map((res) => {
		const rec = result.recommendations.find(
			(r) => r.domain_name === res.domain_name
		);

		return {
			domainId: res.domain_id,
			initials: res.domain_initials,
			name: res.domain_name,
			criticality: res.criticality || "N/A",
			userLevel: res.user_level,
			targetLevel: res.target_level,
			recommendationSnippet: rec?.advice || "",
		};
	});

	// --- 2. Dialog Data Helpers ---
	const selectedResult = result.domain_results.find(
		(r) => r.domain_id === selectedDomainId
	);
	const selectedRecommendations = result.recommendations.filter(
		(r) => r.domain_name === selectedResult?.domain_name
	);

	return (
		<div className="min-h-screen bg-black text-white p-8">
			{" "}
			{/* Dark Mode Wrapper */}
			<div className="max-w-7xl mx-auto space-y-8">
				{/* Header */}
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pl-3 pr-6">
					<div>
						<a href="/">
							<img src="../../assets/Ryzr_White Logo_v2.png" alt="RYZR Logo" className="h-20" />
						</a>
						{/* <div>
							<h1 className="text-3xl font-bold tracking-tight">
								RYZR.
							</h1>
							<p className="text-zinc-400 mt-1">
								Overall Status:{" "}
								<span className="font-semibold text-violet-ryzr">
									{result.overall_status}
								</span>
							</p>
						</div> */}
					</div>
					<div className="flex gap-3">
						<Button
							variant="outline"
							className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
							onClick={(e) => handleShare()}
						>
							<Share2 className="w-4 h-4 mr-2" /> Share
						</Button>
						<Button
							variant="outline"
							onClick={() => navigate("/nis2/assessment")}
							className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
						>
							<RotateCcw className="w-4 h-4 mr-2" /> Start New
						</Button>
					</div>
				</div>

				{/* Score Cards */}
				<div className="flex gap-4">
					<div className="flex gap-2 flex-1">
						<Card className="bg-transparent border-0">
							<CardHeader className="pb-0">
								<CardTitle className="text-lg font-medium text-zinc-500">
									TOTAL
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-5xl font-bold text-white">
									{result.user_total_score}
									<span className="text-lg">
										/ {result.total_possible_score}{" "}
									</span>
									<span className="text-[#828282] text-3xl font-medium">
										score
									</span>
								</div>
							</CardContent>
						</Card>
						<Card className="bg-transparent border-0">
							<CardHeader className="pb-0">
								<CardTitle className="text-lg font-medium text-zinc-500">
									AVERAGE
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-5xl font-bold text-white">
									{result.average_maturity_level}
									<span className="text-lg">/ 5.0 </span>
									<span className="text-[#828282] text-3xl font-medium">
										maturity
									</span>
								</div>
							</CardContent>
						</Card>
					</div>
					<Card className="bg-transparent border-0">
						<CardHeader className="pb-2">
							<CardTitle className="text-lg font-medium text-zinc-500">
								CHART LEGEND
							</CardTitle>
						</CardHeader>
						<CardContent className="flex items-center gap-8 pt-2">
							{/* Legend Item 1: User Level */}
							<div className="flex items-center space-x-3">
								<div className="w-6 h-6 rounded-none bg-violet-ryzr bg-transparent" />
								<span className="text-sm font-medium text-white">
									Your Maturity
								</span>
							</div>
							{/* Legend Item 2: Target Level */}
							<div className="flex items-center space-x-3">
								<div className="w-6 h-6 rounded-none border-2 border-violet-ryzr border-dashed" />
								<span className="text-sm font-medium text-white">
									NIS2 requirement
								</span>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Chart */}
				<Card className="bg-transparent border-0">
					<CardContent>
						<AssessmentResultsChart data={result.domain_results} />
					</CardContent>
				</Card>

				{/* Table using GenericDataTable */}
				<Card className="bg-transparent border-0">
					<CardHeader>
						<CardTitle className="text-white">
							Detailed Findings
						</CardTitle>
					</CardHeader>
					<CardContent>
						<GenericDataTable
							columns={resultsColumns}
							data={tableData}
							filterKey="name" // Search by Domain Name
							onRowClick={(row) =>
								setSelectedDomainId(row.domainId)
							}
							clickableRow={true}
							pageSize={25}
							// We don't pass 'reportsActionsData', so no excel/pdf buttons will render
						/>
					</CardContent>
				</Card>
			</div>
			{/* --- DETAILS DIALOG --- */}
			<Dialog
				open={!!selectedDomainId}
				onOpenChange={(open) => !open && setSelectedDomainId(null)}
			>
				<DialogContent className="max-w-2xl bg-zinc-950 border-zinc-800 text-white">
					<DialogHeader>
						<div className="flex items-center gap-2">
							<DialogTitle className="text-2xl text-violet-400">
								{selectedResult?.domain_name}
							</DialogTitle>
							<Badge
								variant="secondary"
								className="bg-zinc-800 text-zinc-300"
							>
								{selectedResult?.domain_initials}
							</Badge>
							{selectedResult?.criticality && (
								<Badge
									variant="outline"
									className={cn(
										"border-zinc-700 text-zinc-400",
										selectedResult.criticality ===
											"Critical"
											? "bg-rose-900/30 border-rose-700 text-rose-400"
											: selectedResult.criticality ===
											  "High"
											? "bg-amber-900/30 border-amber-700 text-amber-400"
											: "bg-zinc-800 border-zinc-700 text-zinc-400"
									)}
								>
									{selectedResult.criticality}
								</Badge>
							)}
						</div>
						<DialogDescription className="text-zinc-400">
							Detailed breakdown and remediation steps.
						</DialogDescription>
					</DialogHeader>

					<div className="grid grid-cols-2 gap-4 my-4">
						<div className="p-4 bg-zinc-900 rounded-lg text-center border border-zinc-800">
							<div className="text-sm text-zinc-500 uppercase">
								Your Level
							</div>
							<div className="text-3xl font-bold text-violet-500">
								{selectedResult?.user_level}
							</div>
						</div>
						<div className="p-4 bg-zinc-900 rounded-lg text-center border border-zinc-800">
							<div className="text-sm text-zinc-500 uppercase">
								Target Level
							</div>
							<div className="text-3xl font-bold text-zinc-600">
								{selectedResult?.target_level}
							</div>
						</div>
					</div>

					<Separator className="my-2 bg-zinc-800" />

					<div>
						<h3 className="font-semibold text-lg mb-3 flex items-center text-white">
							<CheckCircle2 className="w-5 h-5 mr-2 text-violet-500" />
							Recommendations
						</h3>

						{selectedRecommendations.length > 0 ? (
							<ul className="space-y-3 overflow-y-auto">
								{selectedRecommendations.map((rec, idx) => (
									<li
										key={idx}
										className="flex items-start bg-zinc-900/50 p-3 rounded-md border border-zinc-800"
									>
										<div className="flex-shrink-0 mt-1 mr-3">
											<div className="w-6 h-6 rounded-full bg-violet-900/50 text-violet-300 flex items-center justify-center text-xs font-bold border border-violet-800">
												L{rec.achieves_level}
											</div>
										</div>
										<div className="text-sm text-zinc-300 leading-relaxed">
											{rec.advice}
										</div>
									</li>
								))}
							</ul>
						) : (
							<div className="flex items-center p-4 bg-emerald-950/30 text-emerald-400 rounded-md border border-emerald-900/50">
								<CheckCircle2 className="w-5 h-5 mr-2" />
								<span>
									Great job! You are meeting the target for
									this domain.
								</span>
							</div>
						)}
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default SelfAssessmentResults;
