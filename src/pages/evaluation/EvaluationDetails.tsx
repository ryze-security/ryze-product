import ComingSoonBorder from "@/components/ComingSoonBorder";
import { DynamicIcons } from "@/components/DynamicIcons";
import NavHeader from "@/components/evaluation_details/nav-header";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RoundSpinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { domainResponse } from "@/models/evaluation/EvaluationDTOs";
import {
	createReportDTO,
	createStartReportResponseDTO,
	startReportDTO,
} from "@/models/reports/ExcelDTOs";
import evaluationService from "@/services/evaluationServices";
import reportsService, { ReportsService } from "@/services/reportsServices";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loadEvaluationData } from "@/store/slices/evaluationSlice";
import {
	ArrowDown,
	CornerUpRight,
} from "lucide-react";
import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "react-day-picker";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

const Home = React.lazy(
	() => import("@/components/evaluation_details/DetailHome")
);

const DomainDetail = React.lazy(
	() => import("@/components/evaluation_details/DomainDetail")
);

const ReportsTable = React.lazy(
	() => import("@/components/evaluation_details/EvaluationReports")
);

function EvaluationDetails() {
	const { tenantId, companyId, evaluationId } = useParams(); // tenantId is passed from the URL (when accessing the component from /admin page)
	const [searchParams] = useSearchParams();
	const defaultTab = searchParams.get("tab") || "home";
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { toast } = useToast();

	const [currentStep, setCurrentStep] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [domainDataMap, setDomainDataMap] = useState<
		Record<string, domainResponse>
	>({});
	const [reportID, setReportID] = useState<string>("");
	const [isReportGenerating, setIsReportGenerating] = useState(false);

	const { data, status, error } = useAppSelector((state) => state.evaluation);
	const userData = useAppSelector((state) => state.appUser);

	const homeRef = useRef(null);
	const domainDetailRef = useRef(null);

	const dynamicSteps = useMemo(() => {
		const homeStep = { id: 0, label: "Home", iconName: "Home" };

		const domainSteps = Object.values(domainDataMap).map(
			(domain, index) => ({
				id: index + 1,
				label: domain.Description,
				iconName: domain.Description,
			})
		);

		return [homeStep, ...domainSteps];
	}, [domainDataMap]);

	const goToStep = (stepId: number) => {
		setCurrentStep(stepId);

		if (homeRef?.current) {
			homeRef.current?.resetSelection();
		}

		if (domainDetailRef?.current) {
			domainDetailRef.current?.resetSelection();
		}

		const url = new URL(window.location.href);
		url.searchParams.delete("question");
		url.searchParams.delete("controlId");
		history.pushState(null, "", url);
	};

	// This effect is used to set the domain data map when the data is loaded
	useEffect(() => {
		setIsLoading(true);
		if (data?.data?.EvaluationResponse) {
			const map: Record<string, domainResponse> = {};

			for (const domain of data.data.EvaluationResponse
				.DomainResponseList) {
				map[domain.domainId] = {
					...domain,
					Description: domain.Description
				};
			}
			setDomainDataMap(map);
		}

		setIsLoading(false);
	}, [data]);

	// This effect is used to fetch the evaluation data when the component mounts
	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				if (
					!companyId ||
					!evaluationId ||
					companyId === "" ||
					evaluationId === ""
				) {
					navigate("/evaluation");
					return;
				}
				if (
					data === null ||
					data === undefined ||
					data.data.CompanyId !== companyId ||
					data.data.EvaluationId !== evaluationId
				) {
					await dispatch(
						loadEvaluationData({
							tenant_id: tenantId || userData.tenant_id, // tenantId is passed from the URL (when accessing the component from /admin page)
							companyId: companyId ?? "",
							evaluationId: evaluationId ?? "",
						})
					)
						.unwrap()
						.catch((error) => {
							// This block runs for rejected/failed async thunks
							toast({
								title: `Error fetching evaluation data`,
								description: `The evaluation you are trying to access doesn't exist. Please contact support!`,
								variant: "destructive",
							});
							navigate("/evaluation");
						});
				}
			} catch (error) {
				toast({
					title: `Error fetching evaluation data`,
					description: `A fatal error occured while fetching evaluation data. Please try again later!`,
					variant: "destructive",
				});
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [companyId, evaluationId]);

	// Redirect user if data doesn't have EvaluationResponse
	useEffect(() => {
		if (!isLoading && data?.data && !data.data.EvaluationResponse) {
			toast({
				title: `Invalid Evaluation`,
				description: `The evaluation data is missing or invalid. Redirecting you back.`,
				variant: "destructive",
			});
			navigate(-1);
		}
	}, [data, isLoading, navigate, toast]);

	//effect to set current step based on URL tab parameter
	useEffect(() => {
		if (dynamicSteps.length > 0) { // Ensure steps are calculated

			const matchedStep = dynamicSteps.find(step =>
				step.label.toLowerCase() === defaultTab.toLowerCase()
			);

			if (matchedStep) {
				setCurrentStep(matchedStep.id);
			} else {
				// check if defaultTab is reports
				if (defaultTab === "reports") {
					setCurrentStep(dynamicSteps.length);
				}
			}
		}
	}, [dynamicSteps, defaultTab]);

	const updateQuestion = async (
		observation: string,
		score: boolean,
		questionId: string
	) => {
		try {
			await evaluationService.evaluationService.updateQuestion(
				data.data.TenantId,
				data.data.CompanyId,
				data.data.EvaluationId,
				questionId,
				observation,
				score
			);

			await dispatch(
				loadEvaluationData({
					tenant_id: tenantId || userData.tenant_id,
					companyId: companyId ?? "",
					evaluationId: evaluationId ?? "",
				})
			)
				.unwrap()
				.catch((error) => {
					// This block runs for rejected/failed async thunks
					toast({
						title: `Error fetching evaluation data`,
						description: `The evaluation you are trying to access doesn't exist. Please contact support!`,
						variant: "destructive",
					});
					navigate("/evaluation");
				});

			toast({
				title: `Question Updated`,
				description: `Your response has been updated successfully!`,
				variant: "default",
				className: "bg-green-ryzr",
			});
		} catch (error) {
			toast({
				title: `Error updating question`,
				description: `There was an error while updating your response. Please try again later!`,
				variant: "destructive",
			});
		}
	};

	const generateExcelReport = async () => {
		setIsReportGenerating(true);
		const reportData: createReportDTO = {
			tenant_id: data.data.TenantId,
			company_id: data.data.CompanyId,
			evaluation_id: data.data.EvaluationId,
			report_type: "Observations",
			created_by: tenantId ? data.data.UserId : `${userData.first_name} ${userData.last_name}`,
		};

		try {
			const response: createStartReportResponseDTO =
				await reportsService.createExcelReport(reportData);
			if (response.report_id) {
				const startReportBody: startReportDTO = {
					tenant_id: data.data.TenantId,
					company_id: data.data.CompanyId,
				};
				try {
					const startResponse = await reportsService.startExcelReport(
						response.report_id,
						startReportBody
					);
					if (startResponse) {
						setReportID(response.report_id);
						toast({
							title: `Report Generation Started`,
							description: "Your report will be generated in a few minutes. You will be notified once it's ready. The generated reports can be found under the 'Reports' tab.",
							variant: "default",
							className: "bg-green-ryzr",
						});
					}
				} catch (error) {
					toast({
						title: `Error starting report generation`,
						description: `There was an error while starting the report generation. Please try again later!`,
						variant: "destructive",
					});
				}
			}
		} catch (error) {
			toast({
				title: `Error creating report`,
				description: `There was an error while creating the report. Please try again later!`,
				variant: "destructive",
			});
		} finally {
			setIsReportGenerating(false);
		}
	};

	return (
		<div className="min-h-screen font-roboto bg-black text-white p-4 sm:p-6">
			<section className="flex flex-col sm:flex-row sm:items-center justify-between sm:gap-8 w-full bg-black text-white pt-20 px-4 lg:px-20">
				{/* Eval Details name etc */}
				<div className="w-full max-w-7xl flex-1 min-w-0">
					<NavHeader
						data={dynamicSteps.map((step) => ({
							...step,
							label: `${step.label.split(" controls")[0]}`,
							icon: <DynamicIcons name={step.iconName} />,
						}))}
						stepChangefn={goToStep}
						currentStep={currentStep}
					/>
				</div>

				<div className="relative group flex-shrink-0 2xl:mr-16">
					<div className="flex items-center gap-0">
						<button
							onClick={() => goToStep(dynamicSteps.length)}
							className={`relative z-10 flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 md:px-6 md:py-3 md:text-base ${dynamicSteps.length === currentStep
								? 'bg-zinc-700 opacity-100'
								: 'opacity-70 hover:opacity-100'
								} rounded-full border border-white/50 hover:border-white`}
						>
							<span>Reports</span>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<button
										className="flex items-center justify-center"
										onClick={(e) => e.stopPropagation()}
									>
										<svg
											className="w-4 h-4"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M19 9l-7 7-7-7"
											/>
										</svg>
									</button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									className="gap-1 flex flex-col border border-white/20 bg-black"
									align="end"
									onClick={(e) => e.stopPropagation()}
								>
									<DropdownMenuItem
										onClick={(e) => {
											e.stopPropagation();
											generateExcelReport();
										}}
										disabled={isReportGenerating}
										className="cursor-pointer hover:bg-zinc-800 focus:bg-zinc-800"
									>
										Gap analysis report(.xlsx)
									</DropdownMenuItem>
									<DropdownMenuItem
										className="text-gray-light-ryzr cursor-not-allowed"
										onClick={(e) => e.stopPropagation()}
									>
										<ComingSoonBorder variant="inline" className="w-full">
											Exec. summary(.pptx)
										</ComingSoonBorder>
									</DropdownMenuItem>
									<DropdownMenuItem
										className="text-gray-light-ryzr cursor-not-allowed"
										onClick={(e) => e.stopPropagation()}
									>
										<ComingSoonBorder variant="inline" className="w-full">
											Policy statements(.docx)
										</ComingSoonBorder>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</button>
					</div>
					{dynamicSteps.length === currentStep && (
						<motion.div
							className="absolute inset-0 z-0 rounded-full bg-zinc-700/30"
							layoutId="activeTab"
							transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
						/>
					)}
				</div>
			</section>

			<section className="flex items-center w-full bg-black text-white mt-2 sm:pt-10 px-0 lg:px-16">
				{isLoading ? (
					<RoundSpinner />
				) : (
					data.data.EvaluationId === evaluationId &&
					data?.data?.EvaluationResponse && (
						<>
							<Suspense fallback={<RoundSpinner />}>
								{currentStep === 0 && (
									<Home
										overallScore={Math.round(
											data.data.EvaluationResponse
												.Response.Score * 100
										).toString()}
										domainDataMap={domainDataMap}
										stepChangefn={goToStep}
										evalMetadata={data.data.metadata}
										questionUpdatefn={updateQuestion}
										ref={homeRef}
									/>
								)}

								{/* rute force Fallback if mapping doesnt work in the future */}
								{/* {currentStep > 0 && currentStep <=4 && (
                                <DomainDetail domainData={domainDataMap[`d_${currentStep}`]} currentPage={currentStep} />
                            )} */}

								{Object.entries(domainDataMap).map(
									([domainId, domain], index) =>
										currentStep === index + 1 && (
											<DomainDetail
												domainData={domain}
												currentPage={index + 1}
												questionUpdatefn={
													updateQuestion
												}
												ref={domainDetailRef}
											/>
										)
								)}

								{currentStep === dynamicSteps.length && (
									<ReportsTable
										tenantId={data.data.TenantId}
										companyId={data.data.CompanyId}
										evaluationId={data.data.EvaluationId}
									/>
								)}
							</Suspense>
						</>
					)
				)}
			</section>
		</div>
	);
}

export default EvaluationDetails;
