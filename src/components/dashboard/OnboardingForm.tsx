import React, { useEffect, useState } from "react";
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

interface Props {
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
	const { remainingCredits, evaluationNumber } = props;

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

	const methods = useForm({
		defaultValues: {
			auditeeName: "" as string,
			auditeeData: [] as string[],
			auditeeService: [] as string[],
			auditee: null as { value: string; label: string } | null,
			frameworks: [] as {name:string, value:string}[],
			documents: [] as FilesUploadResponseDTO[],
		},
		mode: "onChange",
	});

	const {
		watch,
		setValue,
		getValues,
		trigger,
		formState: { errors },
	} = methods;
	const watchedAuditee = watch("auditee");

	//Eligibility Check
	useEffect(() => {
		const hasSkipped = localStorage.getItem("onboarding-skipped");
		if (remainingCredits > 0 && evaluationNumber === 0 && !hasSkipped) {
			setOpen(true);
		}
	}, [remainingCredits, evaluationNumber]);

	// Load frameworks if we hit step 4
	useEffect(() => {
		if (step === 4 && collection.collections.length === 0) {
			dispatch(loadCollections(userData.tenant_id));
		}
	}, [step, userData.tenant_id, dispatch, collection.collections.length]);

	const handleSkip = () => {
		localStorage.setItem("onboarding-skipped", "true");
		setOpen(false);
	};

	const handleNext = async () => {
		if (loading) return;

		switch (step) {
			case 1:
				const isValid = await trigger("auditeeName");
				if (isValid) setStep(2);
				break;
			case 2:
				const isValidService = await trigger("auditeeService");
				if (isValidService) setStep(3);
				break;
			case 3:
				const isValidData = await trigger("auditeeData");
				if (isValidData) handleCreateAuditee();
				break;
			case 4:
				const isValidFramework = await trigger("frameworks");
				const fw = getValues("frameworks");
				if (!fw || fw.length === 0) {
					methods.setError("frameworks", {
						type: "required",
						message: "Please select a framework.",
					});
					return;
				}
				if (isValidFramework) setStep(5);
				break;
			case 5:
				const isValidFiles = await trigger("documents");
				const dcmnt = getValues("documents");
				if (!dcmnt || dcmnt.length === 0) {
					methods.setError("documents", {
						type: "required",
						message: "Please upload at least one document.",
					});
					return;
				}
				if (isValidFiles) handleRunAnalysis();
			default:
				break;
		}
	};

	const StepIndicator = () => (
		<div className="flex items-center justify-center space-x-2 mb-6">
			{[1, 2, 3, 4, 5].map((s) => (
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

	const handleCreateAuditee = async () => {
		const isValidAuditeeName = await trigger("auditeeName");
		const isValidServiceType = await trigger("auditeeService");
		const isValidDataType = await trigger("auditeeData");
		const isValid =
			isValidAuditeeName && isValidServiceType && isValidDataType;
		if (!isValid) return;

		const { auditeeName, auditeeService, auditeeData } =
			methods.getValues();
		setLoading(true);

		try {
			// Check if user already created one in a previous attempt or create new
			if (!watchedAuditee) {
				const response = await companyService.createCompany({
					tenant_id: userData.tenant_id,
					company_name: auditeeName,
					company_type: auditeeData[0],
					service_type: auditeeService,
					data_type: auditeeData,
					created_by: userData.first_name + " " + userData.last_name,
				});

				// Set the specific structure FileUploadArea expects
				setValue("auditee", {
					value: response.tg_company_id,
					label: response.tg_company_display_name,
				});
			} else {
				// Update existing auditee
				const response = (await companyService.updateCompany(
					userData.tenant_id,
					watchedAuditee.value,
					{
						company_name: auditeeName,
						service_type: auditeeService,
						data_type: auditeeData,
					}
				)) as CompanyListDto;
				setValue("auditee", {
					value: response.tg_company_id,
					label: response.tg_company_display_name,
				});
			}
			setStep(4);
		} catch (error) {
			console.error(error);
			toast({
				title: `Error creating your auditee`,
				description: `A fatal error occured while creating your auditee. Please try again later!`,
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	const handleRunAnalysis = async () => {
		setLoading(true);
		try{
			const {auditee, frameworks, documents} = getValues();
			const frameworkId = frameworks[0].value;
			const evaluationData : createEvaluationDTO = {
				tenant_id: userData.tenant_id,
				company_id: auditee!.value,
				collection_id: frameworkId,
				created_by: userData.first_name + " " + userData.last_name,
				model_used: "azure-gpt04-mini",
				document_list: documents.map((doc) => doc.file_id),
			}

			const createEvaluationResponse : createEvaluationResponseDTO = await evaluationServices.evaluationService.createEvaluation(evaluationData);

			await evaluationServices.evaluationService.startEvaluation( userData.tenant_id, createEvaluationResponse.eval_id);

			toast({
				title: "Evaluation is running",
				description: `Evaluation is created and running successfully.`,
				variant: "default",
				className: "bg-green-ryzr",
			});

			setOpen(false);
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
						Welcome to Ryzr.
					</DialogTitle>
					<DialogDescription className="text-center text-zinc-400">
						Let's set up your first security review in under 2
						minutes.
					</DialogDescription>
				</DialogHeader>

				<StepIndicator />

				<FormProvider {...methods}>
					<div className="py-4 min-h-[300px] flex flex-col justify-center">
						{/* STEP 1: Auditee */}
						{step === 1 && (
							<div className="space-y-4 animate-in fade-in slide-in-from-right-4">
								<Field>
									<FieldLabel htmlFor="auditee-name">
										Who are we auditing?
									</FieldLabel>
									<Input
										{...methods.register("auditeeName", {
											required: "Name is required",
										})}
										placeholder="e.g. Acme Corp, Internal IT, Vendor X"
										className="bg-zinc-900 border-zinc-700 h-12 text-lg"
										id="auditee-name"
									/>
									{errors.auditeeName && (
										<p className="text-rose-500 text-sm">
											{errors.auditeeName.message}
										</p>
									)}
								</Field>
							</div>
						)}
						{step === 2 && (
							<div className="space-y-4 animate-in fade-in slide-in-from-right-4">
								<Field>
									<FieldLabel>
										What type of services does the auditee
										provide?
									</FieldLabel>
									<MultiSelectBox
										control={methods.control}
										name="auditeeService"
										options={AUDITEE_SERVICES}
									/>
								</Field>
							</div>
						)}
						{step === 3 && (
							<div className="space-y-4 animate-in fade-in slide-in-from-right-4">
								<Field>
									<FieldLabel>
										What type of documents will be reviewed?
									</FieldLabel>
									<MultiSelectBox
										control={methods.control}
										name="auditeeData"
										options={AUDITEE_DATA_TYPES}
									/>
								</Field>
							</div>
						)}
						{step === 4 && (
							<div className="space-y-6 animate-in fade-in slide-in-from-right-4 w-full">
								<Field>
									<FieldLabel>Select a Framework</FieldLabel>
									{status === "succeeded" ? (
										<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center">
											{collection.collections.map((f) => (
												<div
													className="p-1"
													key={f.collection_id}
												>
													<FrameworkCard
														name={
															f.collection_display_name
														}
														value={f.collection_id}
														fieldName="frameworks"
														control={
															methods.control
														}
														error={
															!!errors.frameworks
														}
														setFocus={
															methods.setFocus
														}
														multiSelectAllowed={
															false
														}
													/>
												</div>
											))}
										</div>
									) : (
										<div className="flex justify-center items-center h-40">
											<RoundSpinner />
										</div>
									)}

									{errors.frameworks && (
										<p className="text-rose-500 text-sm text-center">
											Please select a framework to proceed
										</p>
									)}
								</Field>
							</div>
						)}
						{step === 5 && (
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
							) : step === 5 ? (
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
