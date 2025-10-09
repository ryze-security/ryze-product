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
} from "lucide-react";
import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
	const { companyId, evaluationId } = useParams();
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

		const reportStep = {
			id: domainSteps.length + 1,
			label: "Reports",
			iconName: "Reports",
		};

		return [homeStep, ...domainSteps, reportStep];
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
				map[domain.domainId] = {...domain,
					Description: domain.Description.split(" controls")[0]
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
							tenant_id: userData.tenant_id,
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
					tenant_id: userData.tenant_id,
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
			created_by: `${userData.first_name} ${userData.last_name}`,
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
							description: `Your report will be generated in an few minutes. You will be notified once it's ready.`,
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
		<div className="min-h-screen font-roboto bg-black text-white p-6">
			<section className="flex justify-between gap-8 items-center w-full bg-black text-white pt-10 px-6 sm:px-12 lg:px-16">
				{/* Eval Details name etc */}
				<div className="flex-1 min-w-0">
					<NavHeader
						data={dynamicSteps.map((step) => ({
							...step,
							icon: <DynamicIcons name={step.iconName} />,
						}))}
						stepChangefn={goToStep}
						currentStep={currentStep}
					/>
				</div>
				<div className="flex-shrink-0">
					<DropdownMenu>
						<DropdownMenuTrigger
							className={` bg-sky-500 hover:bg-sky-600 rounded-2xl transition-colors text-white font-bold px-4 py-2 flex items-center gap-2`}
						>
							Export <ArrowDown className="w-4 h-4" />
						</DropdownMenuTrigger>
						<DropdownMenuContent className="gap-1 flex flex-col">
							<DropdownMenuItem
								onClick={generateExcelReport}
								disabled={isReportGenerating}
							>
								Gap analysis report(.xlsx)
							</DropdownMenuItem>
							<DropdownMenuItem className="text-gray-light-ryzr cursor-not-allowed">
								<ComingSoonBorder
									variant="inline"
									className="w-full"
								>
									Exec. summary(.pptx)
								</ComingSoonBorder>
							</DropdownMenuItem>

							<DropdownMenuItem className="text-gray-light-ryzr cursor-not-allowed">
								<ComingSoonBorder
									variant="inline"
									className="w-full"
								>
									Policy statements(.docx)
								</ComingSoonBorder>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</section>

			<section className="flex items-center w-full bg-black text-white mt-2 pt-10 px-6 sm:px-12 lg:px-16">
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

								{currentStep === dynamicSteps.length - 1 && (
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
