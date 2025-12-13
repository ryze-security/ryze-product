// Logic of onboarding form -> take props companiesNum, remainingCredits And EvaluationNumber.
// 1. If evalnumber > 0 -> skip
// 2. if credits === 0 -> skip
// 3. [companiesNum] 
// 		-> If companiesnum === 0 
//			Create a dummy company -> (Test Auditte), (Service Type: None), Businness type: none
// 		-> else
// 			Choose the first company
// 4. Show the onboarding form and continue with the normal workflow... 

import React, { useEffect, useRef, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import { cn } from "@/lib/utils";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { FilesUploadResponseDTO } from "@/models/files/FilesUploadResponseDTO";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { RoundSpinner } from "../ui/spinner";
import { ChevronRight } from "lucide-react";
import {
	AUDITEE_SERVICES,
	AUDITEE_DATA_TYPES,
} from "@/constants/auditeeOptions";
import { MultiSelectBox } from "../auditee/SelectBoxes";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loadCollections } from "@/store/slices/collectionSlice";
import { Label } from "../ui/label";
import { FrameworkCard } from "../newevaluation/FrameworkCard";
import { FileUploadArea } from "../newevaluation/FileUploadArea";
import { ColumnDef } from "@tanstack/react-table";
import companyService from "@/services/companyServices";
import { useToast } from "@/hooks/use-toast";
import { CompanyListDto } from "@/models/company/companyDTOs";
import { createEvaluationDTO, createEvaluationResponseDTO } from "@/models/evaluation/EvaluationDTOs";
import evaluationServices from "@/services/evaluationServices";
import { useNavigate } from "react-router-dom";
import { skip } from "node:test";
import { loadCompanyData } from "@/store/slices/companySlice";

interface Props {
	companiesNum: number;
	remainingCredits: number;
	evaluationNumber: number;
}

const fileColumns: ColumnDef<FilesUploadResponseDTO>[] = [
	{
		accessorKey: "file_name",
		header: "File Name",
	},
];

function OnboardingForm(props: Props) {
	const { companiesNum, remainingCredits, evaluationNumber } = props;
	const companies = useAppSelector((state) => state.company.data)
	const companyLoadingStatus = useAppSelector((state) => state.company.status)


	const methods = useForm({
		defaultValues: {
			auditee: null as { value: string; label: string } | null,
			frameworks: [] as { name: string, value: string }[],
			documents: [] as FilesUploadResponseDTO[],
		},
		mode: "onChange",
	});
	const {
		getValues,
		trigger,
		setValue,
		watch,
		formState: { errors },
	} = methods;

	const dispatch = useAppDispatch();
	const userData = useAppSelector((state) => state.appUser);
	const { collection, status, error } = useAppSelector(
		(state) => state.collections
	);
	const { toast } = useToast();
	const navigate = useNavigate();

	const [open, setOpen] = useState<boolean>(false);
	const [step, setStep] = useState(1);
	const [loading, setLoading] = useState<boolean>(false);
	const hasInitialized = useRef(false);


	// Check if we needs to show onboarding or not. (Also, creates a company in case user have 0 companies. )
	useEffect(() => {
		if (hasInitialized.current) {
			return;
		}

		const initializeCompany = async () => {
			const hasSkipped = localStorage.getItem("onboarding-skipped");

			// Check eligibility
			if (remainingCredits <= 0 || evaluationNumber !== 0 || hasSkipped || companyLoadingStatus === 'loading') {
				return;
			}

			try {
				// Wait for companies to load if they haven't been loaded yet
				if (companyLoadingStatus === 'idle' || companyLoadingStatus === 'failed') {
					await dispatch(loadCompanyData(userData.tenant_id)).unwrap();
				}

				const currentCompanies = companies;

				// If no companies exist, create a dummy one
				if (companiesNum === 0 && currentCompanies.length === 0) {
					const response = await companyService.createCompany({
						tenant_id: userData.tenant_id,
						company_name: "Onboarding Company",
						company_type: "",
						service_type: [],
						data_type: [],
						created_by: userData.first_name + " " + userData.last_name,
					});

					setValue("auditee", {
						value: response.tg_company_id,
						label: response.tg_company_display_name,
					});

					// Reload companies in Redux
					dispatch(loadCompanyData(userData.tenant_id));
				} else if (currentCompanies.length > 0) {
					// Use the first existing company
					setValue("auditee", {
						value: currentCompanies[0].tg_company_id,
						label: currentCompanies[0].tg_company_display_name,
					});
				}

				hasInitialized.current = true;
				setOpen(true);
			} catch (error) {
				console.error("Error initializing company:", error);
				toast({
					title: "Error",
					description: "Failed to initialize onboarding. Please try again.",
					variant: "destructive",
				});
			}
		};

		initializeCompany();
	}, [remainingCredits, evaluationNumber, companiesNum, userData, dispatch, companyLoadingStatus]);


	// Load frameworks if we hit step 4
	useEffect(() => {
		if (open && collection.collections.length === 0) {
			dispatch(loadCollections(userData.tenant_id));
		}
	}, [step, userData.tenant_id, dispatch, collection.collections.length, open]);

	const handleSkip = () => {
		localStorage.setItem("onboarding-skipped", "true");
		setOpen(false);
	};

	const handleNext = async () => {
		if (loading) return;

		switch (step) {
			case 1: {
				setStep(2);
				break;
			}
			case 2: {
				// Validate framework selection
				const fw = getValues("frameworks");
				if (!fw || fw.length === 0) {
					methods.setError("frameworks", {
						type: "required",
						message: "Please select a framework.",
					});
					return;
				}
				const isValidFramework = await trigger("frameworks");
				if (isValidFramework) setStep(3);
				break;

			}
			case 3: {
				// Validate documents and run analysis
				const dcmnt = getValues("documents");
				if (!dcmnt || dcmnt.length === 0) {
					methods.setError("documents", {
						type: "required",
						message: "Please upload at least one document.",
					});
					return;
				}
				const isValidFiles = await trigger("documents");
				if (isValidFiles) handleRunAnalysis();
				break;
			}
			default:
				break;
		}
	};

	const StepIndicator = () => (
		<div className="flex items-center justify-center space-x-2 mb-6">
			{[1, 2, 3].map((s) => (
				<div
					key={s}
					className={cn(
						"h-2 w-2 rounded-full transition-all duration-1000 ease-in",
						step >= s ? "bg-violet-ryzr" : "bg-zinc-700",
						step == s ? "w-6" : ""
					)}
				/>
			))}
		</div>
	);

	const handleRunAnalysis = async () => {
		const selectedCompany = getValues("auditee");
		if (!selectedCompany) {
			toast({
				title: "Error",
				description: "No company selected. Please try again.",
				variant: "destructive",
			});
			return;
		}

		setLoading(true);
		try {
			const { frameworks, documents } = getValues();
			const frameworkId = frameworks[0].value;

			const evaluationData: createEvaluationDTO = {
				tenant_id: userData.tenant_id,
				company_id: selectedCompany.value,
				collection_id: frameworkId,
				created_by: userData.first_name + " " + userData.last_name,
				model_used: "azure-gpt04-mini",
				document_list: documents.map((doc) => doc.file_id),
			}

			const createEvaluationResponse: createEvaluationResponseDTO = await evaluationServices.evaluationService.createEvaluation(evaluationData);

			await evaluationServices.evaluationService.startEvaluation(userData.tenant_id, createEvaluationResponse.eval_id);

			toast({
				title: "Evaluation is running",
				description: `Evaluation is created and running successfully.`,
				variant: "default",
				className: "bg-green-ryzr",
			});

			setOpen(false);
			localStorage.setItem("onboarding-skipped", "true");
			navigate("/evaluation");
		} catch (error) {
			console.error(error);
			toast({
				title: "Error",
				description: "Failed to start evaluation. Please try again.",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	}


	return (
		<Dialog open={open} onOpenChange={(val) => !val && handleSkip()}>
			<DialogContent className="max-w-3xl bg-zinc-950 text-white border-zinc-800 font-roboto">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold text-center">
						Welcome to Ryzr 👋
					</DialogTitle>
					<DialogDescription className="text-center text-zinc-300">
						Let's run your first security evaluation in just 2 simple steps.
					</DialogDescription>
				</DialogHeader>

				<StepIndicator />

				<FormProvider {...methods}>
					<div className="py-4 min-h-[300px] flex flex-col justify-center">
						{/* STEP 1: Auditee */}
						{step === 1 && (
							<div className="space-y-6 text-center animate-in fade-in slide-in-from-right-4">
								<div className="mx-auto w-20 h-20 bg-violet-ryzr/20 rounded-full flex items-center justify-center">
									<svg className="w-10 h-10 text-violet-ryzr" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
									</svg>
								</div>
								<div>
									<h3 className="text-xl font-semibold mb-3">
										Automated Security Compliance Made Simple
									</h3>
									<p className="text-zinc-400 max-w-md mx-auto leading-relaxed">
										We've already set up a test environment for you. In the next steps,
										you'll select a compliance framework and upload your security documents.
										Our AI will handle the rest.
									</p>
								</div>
								<div className="flex items-center justify-center gap-8 text-sm text-zinc-500">
									<div className="flex items-center gap-2">
										<span className="text-violet-ryzr">✓</span>
										<span>No setup required</span>
									</div>
									<div className="flex items-center gap-2">
										<span className="text-violet-ryzr">✓</span>
										<span>Results in minutes</span>
									</div>
								</div>
							</div>
						)}
						{step === 2 && (
							<div className="space-y-6 animate-in fade-in slide-in-from-right-4 w-full">
								{/* Header Section */}
								<div className="text-center space-y-2">
									<h3 className="text-xl font-semibold">Choose Your Compliance Framework</h3>
									<p className="text-zinc-400 text-sm">
										Select the security standard you want to evaluate against
									</p>
								</div>

								{/* Framework Grid */}
								<Field>
									{status === "succeeded" ? (
										<div className="space-y-4">
											<div className=" grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
												{collection.collections.map((f) => (
													<FrameworkCard
														key={f.collection_id}
														name={f.collection_display_name}
														value={f.collection_id}
														fieldName="frameworks"
														control={methods.control}
														error={!!errors.frameworks}
														setFocus={methods.setFocus}
														multiSelectAllowed={false}
													/>
												))}
											</div>
										</div>
									) : (
										<div className="flex flex-col justify-center items-center h-48 space-y-3">
											<RoundSpinner />
											<p className="text-sm text-zinc-500">Loading frameworks...</p>
										</div>
									)}

									{errors.frameworks && (
										<div className="flex items-center justify-center gap-2 mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg">
											<svg className="w-5 h-5 text-rose-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
											</svg>
											<p className="text-rose-500 text-sm font-medium">
												Please select a framework to proceed
											</p>
										</div>
									)}
								</Field>
							</div>
						)}
						{step === 3 && (
							<div className="space-y-4 animate-in fade-in slide-in-from-right-4 h-full max-w-3xl mx-auto w-full">
								<Field>
									<div className="border border-dashed border-zinc-700 rounded-lg p-4 bg-zinc-900/50">
										<Controller
											name="documents"
											control={methods.control}
											rules={{
												validate: (
													val: FilesUploadResponseDTO[]
												) => {
													if (
														!val ||
														val.length === 0
													) {
														return "Please select at least one file.";
													}
													const fileNames = val.map(
														(f) => f.file_name
													);
													const nameSet = new Set(
														fileNames
													);
													if (
														nameSet.size !==
														fileNames.length
													) {
														return "Duplicate files are not allowed.";
													}
													return true;
												},
											}}
											render={({ field }) => (
												<FileUploadArea
													control={methods.control}
													name="documents"
													columns={fileColumns}
												/>
											)}
										/>
									</div>
									{errors.documents && (
										<p className="text-rose-500 text-sm text-center">
											{errors.documents.message}
										</p>
									)}
								</Field>
							</div>
						)}
					</div>
				</FormProvider>

				<DialogFooter className="flex sm:justify-between items-center gap-4">
					<Button
						variant="ghost"
						onClick={handleSkip}
						className="text-zinc-500 hover:text-white"
						disabled={loading}
					>
						Skip for now
					</Button>

					<div className="flex gap-2">
						{step > 1 && (
							<Button
								variant="outline"
								onClick={() => setStep(step - 1)}
								disabled={loading}
							>
								Back
							</Button>
						)}

						<Button
							onClick={() => handleNext()}
							className="min-w-[100px]"
							disabled={loading}
							variant="primary"
						>
							{loading ? (
								<RoundSpinner />
							) : step === 3 ? (
								"Run Analysis"
							) : (
								<>
									Next{" "}
									<ChevronRight className="w-4 h-4 ml-1" />
								</>
							)}
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default OnboardingForm;
