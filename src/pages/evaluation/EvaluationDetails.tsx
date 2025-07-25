import NavHeader from "@/components/evaluation_details/nav-header";
import { Button } from "@/components/ui/button";
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
	BuildingIcon,
	DatabaseIcon,
	FileUserIcon,
	HomeIcon,
	icons,
	IdCardIcon,
} from "lucide-react";
import React, { Suspense, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const steps = [
	{ id: 0, label: "Home", icon: <HomeIcon /> },
	{ id: 1, label: "Organizational", icon: <BuildingIcon /> },
	{ id: 2, label: "People", icon: <FileUserIcon /> },
	{ id: 3, label: "Physical", icon: <IdCardIcon /> },
	{ id: 4, label: "Technological", icon: <DatabaseIcon /> },
];

const Home = React.lazy(
	() => import("@/components/evaluation_details/DetailHome")
);

const DomainDetail = React.lazy(
	() => import("@/components/evaluation_details/DomainDetail")
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

	const goToStep = (stepId: number) => {
		setCurrentStep(stepId);
	};

	// This effect is used to set the domain data map when the data is loaded
	useEffect(() => {
		setIsLoading(true);
		if (data?.data?.EvaluationResponse) {
			const map: Record<string, domainResponse> = {};

			for (const domain of data.data.EvaluationResponse
				.DomainResponseList) {
				map[domain.domainId] = domain;
			}
			setDomainDataMap(map);
		}

		setIsLoading(false);
	}, [data]);

	// This effect is used to set the loading state based on the status of the evaluation data
	// useEffect(() => {
	// 	if (status === "loading") {
	// 		setIsLoading(true);
	// 	} else {
	// 		setIsLoading(false);
	// 	}
	// }, [status]);

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
							tenant_id: "7077beec-a9ef-44ef-a21b-83aab58872c9",
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
			await evaluationService.updateQuestion(
				data.data.TenantId,
				data.data.CompanyId,
				data.data.EvaluationId,
				questionId,
				observation,
				score
			);

			await dispatch(
				loadEvaluationData({
					tenant_id: "7077beec-a9ef-44ef-a21b-83aab58872c9",
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
			console.error("Error updating question:", error);
		}
	};

	const generateExcelReport = async () => {
		setIsReportGenerating(true);
		const reportData: createReportDTO = {
			tenant_id: data.data.TenantId,
			company_id: data.data.CompanyId,
			evaluation_id: data.data.EvaluationId,
			report_type: "Observations",
			created_by: "SYSTEM",
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
							description: `Your report is being generated. You will be notified once it's ready.`,
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
					console.error("Error starting report generation:", error);
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
			<section className="flex justify-between items-center w-full bg-black text-white pt-10 px-6 sm:px-12 lg:px-16">
				{/* Eval Details name etc */}
				<NavHeader
					data={steps}
					stepChangefn={goToStep}
					currentStep={currentStep}
				/>
				<div className="mr-4">
					<DropdownMenu>
						<DropdownMenuTrigger
							className={` bg-sky-500 hover:bg-sky-600 rounded-2xl transition-colors text-white font-bold px-4 py-2 flex items-center gap-2`}
						>
							Generate <ArrowDown className="w-4 h-4" />
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem onClick={generateExcelReport}>
								Report(.xlxs)
							</DropdownMenuItem>
							<DropdownMenuItem>
								Exec. summary(.pptx)
							</DropdownMenuItem>
							<DropdownMenuItem>
								Policy statements(.docx)
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
											/>
										)
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
