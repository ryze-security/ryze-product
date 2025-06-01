import { AlertDialogBox } from "@/components/AlertDialogBox";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { FileUploadArea } from "@/components/newevaluation/FileUploadArea";
import { FrameworkCard } from "@/components/newevaluation/FrameworkCard";
import { SummaryStep } from "@/components/newevaluation/SummaryStep";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { RoundSpinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { CompanyListDto } from "@/models/company/companyDTOs";
import {
	createEvaluationDTO,
	createEvaluationResponseDTO,
} from "@/models/evaluation/EvaluationDTOs";
import { FilesUploadResponseDTO } from "@/models/files/FilesUploadResponseDTO";
import evaluationService, {
	EvaluationService,
} from "@/services/evaluationServices";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loadCompanyData } from "@/store/slices/companySlice";
import { wait } from "@/utils/wait";
import { ColumnDef } from "@tanstack/react-table";
import { log } from "console";
import { Check, ChevronsUpDown, PlusCircleIcon } from "lucide-react";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface AuditeeOption {
	value: string;
	label: string;
}

const columns: ColumnDef<FilesUploadResponseDTO>[] = [
	{
		accessorKey: "file_name",
		header: "File Name",
	},
];

const NewEvaluation = () => {
	const steps = [
		{ id: 0, label: "Framework" },
		{ id: 1, label: "Documents" },
		{ id: 2, label: "Evaluation" },
	];

	const auditees = useAppSelector(
		(state) => state.company.data
	) as CompanyListDto[];

	const dispatch = useAppDispatch();

	const navigate = useNavigate();

	const auditeeOptions = useMemo(() => {
		return auditees.map((auditee) => ({
			value: auditee.tg_company_id,
			label: auditee.tg_company_display_name,
		}));
	}, [auditees]);

	const frameworks = [
		{ name: "NIST CSF", value: "nistcsf" },
		{ name: "ISO 27001", value: "iso27001" },
		{ name: "SOC 2", value: "soc2" },
		{ name: "GDPR", value: "gdpr" },
		{ name: "ISO 27701", value: "iso27701" },
		{ name: "Internal", value: "internal" },
	];

	const [currentStep, setCurrentStep] = useState(0);
	const [openCombo, setOpenCombo] = useState(false);
	const [isSubmitLoading, setIsSubmitLoading] = useState(false);

	const goNext = async (e: React.MouseEvent) => {
		e.preventDefault();

		if (currentStep === 0) {
			const result = await methods.trigger([
				"auditee",
				"selectedFrameworks",
			]);
			if (!result) {
				toast({
					title: "Error",
					description:
						methods.formState.errors.auditee?.message ||
						methods.formState.errors.selectedFrameworks?.message,
					variant: "destructive",
				});
				return;
			}
		}

		if (currentStep === 1) {
			const result = await methods.trigger("documents");
			if (!result) {
				toast({
					title: "Error",
					description: methods.formState.errors.documents?.message,
					variant: "destructive",
				});
				return;
			}
		}

		if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
	};

	const goPrevious = () => {
		if (currentStep > 0) setCurrentStep(currentStep - 1);
	};

	const goToStep = async (stepId: number) => {
		if (isSubmitLoading) return;
		if (currentStep === 0 && stepId > 1) {
			const result = await methods.trigger([
				"auditee",
				"selectedFrameworks",
			]);
			const documentLength = methods.getValues("documents").length;
			if(documentLength === 0){
				methods.setError("documents", {
					type: "manual",
					message: "Please select at least one document.",
				})
			}
			if (!result || documentLength === 0) {
				toast({
					title: "Error",
					description:
						methods.formState.errors.auditee?.message ||
						methods.formState.errors.selectedFrameworks?.message  ||
						methods.formState.errors.documents?.message, 
					variant: "destructive",
				});
				return;
			}
		} else if( currentStep === 0 && stepId > 0) {
			const result = await methods.trigger([
				"auditee",
				"selectedFrameworks",
			]);
			if (!result) {
				toast({
					title: "Error",
					description:
						methods.formState.errors.auditee?.message ||
						methods.formState.errors.selectedFrameworks?.message,
					variant: "destructive",
				});
				return;
			}
		}

		if (currentStep === 1 && stepId > 1) {
			const result = await methods.trigger("documents");
			if (!result) {
				toast({
					title: "Error",
					description: methods.formState.errors.documents?.message,
					variant: "destructive",
				});
				return;
			}
		}
		setCurrentStep(stepId);
	};

	const methods = useForm({
		defaultValues: {
			auditee: {} as AuditeeOption,
			selectedFrameworks: [],
			documents: [] as FilesUploadResponseDTO[],
		},
	});

	const watchedAuditeeName = methods.watch("auditee");

	const { toast } = useToast();

	const submit = async (data: any) => {
		setIsSubmitLoading(true);
		const evaluationData: createEvaluationDTO = {
			tenant_id: "7077beec-a9ef-44ef-a21b-83aab58872c9", //change later to a value fetched from store or cookie
			company_id: data.auditee.value,
			collection_id: "collection_1", //change later when framework endpoints are ready
			created_by: "SYSTEM",
			model_used: "gpt4.1",
			document_list: [
				...data.documents.map((doc) => doc.file_id),
			],
		};

		try {
			const response = await evaluationService.createEvaluation(
				evaluationData
			);
			const evalId: createEvaluationResponseDTO = response;

			try {
				const response = await evaluationService.startEvaluation(
					evalId.eval_id
				);
				toast({
					title: "Evaluation is running",
					description: `Evaluation is created and running successfully.`,
					variant: "default",
					className: "bg-green-ryzr",
				});
				navigate("/evaluation");
			} catch (startError) {
				toast({
					title: "Error starting evaluation",
					description: `Evaluation was created with id ${evalId.eval_id} but failed to start. Please visit reviews page to start it manually! NOTE to devs: subject to change.`,
					variant: "destructive",
				});
			}
		} catch (error) {
			toast({
				title: "Error creating evaluation",
				description: `Failed to create the evaluation. Please try again later.`,
				variant: "destructive",
			});
		} finally {
			setIsSubmitLoading(false);
		}
	};

	const onError = (errors: any) => {
		console.log("Form has validation errors:", errors);
	};

	const onRunClick = async () => {
		const documentLength = methods.getValues("documents").length;
		const frameworkLength = methods.getValues("selectedFrameworks").length;
		const isValid =
			(documentLength > 0) &&
			frameworkLength > 0;

		if (isValid) {
			methods.handleSubmit(submit, onError)();
		} else {
			toast({
				title: "Error",
				description:
					"Some fields are empty. Please fill them out before proceeding.",
				variant: "destructive",
			});
		}
	};

	// Updates the documentsExistingSelected, documents field when the auditee is changed
	useEffect(() => {
		if (watchedAuditeeName?.value) {
			methods.setValue("documents", []);
			methods.setValue("selectedFrameworks", []);
		}
	}, [watchedAuditeeName]);

	// Fetch the auditee data when the component mounts if store is empty
	useEffect(() => {
		if (auditees.length === 0) {
			dispatch(loadCompanyData("7077beec-a9ef-44ef-a21b-83aab58872c9"));
		}
	}, []);

	return (
		<div className="min-h-screen font-roboto bg-black text-white p-6">
			{isSubmitLoading && <LoadingOverlay />}
			<section className="flex justify-center items-center w-full bg-black text-white pb-0 pt-10 px-6 sm:px-12 lg:px-16">
				<PageHeader
					heading="Start a new evaluation"
					subtitle="Review documentation gaps against leading security standards and frameworks"
					buttonText="Cancel"
					buttonUrl="/evaluation"
					isLoading={isSubmitLoading}
				/>
			</section>

			{/* Progress Bar Section */}
			<section className="flex justify-center items-center max-w-[55%] w-full bg-black text-white pt-10 px-6 sm:px-12 lg:px-16">
				<div className="max-w-7xl w-full px-2">
					<div className="flex items-center w-full">
						{steps.map((step, index) => {
							const isCurrent = index === currentStep;

							return (
								<div
									className="w-full flex items-center"
									key={step.id}
								>
									<div
										className="flex-1 flex flex-col items-center cursor-pointer text-center"
										onClick={() => goToStep(index)}
									>
										<div
											className={`relative w-[96%] h-8 transition-colors mx-0 mb-4 pl-4
											${isCurrent ? "bg-violet-ryzr" : "bg-zinc-700"}
											hover:opacity-90 rounded-full overflow-visible`}
										>
											<span className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
												{step.label}
											</span>
										</div>
									</div>
									{index < steps.length - 1 && (
										<div className="w-6 h-px border-t-2 border-dashed border-zinc-400 mb-4" />
									)}
								</div>
							);
						})}
					</div>
				</div>
			</section>

			<section className="flex justify-center items-center w-full bg-black text-white pt-3 px-6 sm:px-12 lg:px-16">
				<div className="max-w-7xl w-full mt-8 px-4">
					<FormProvider {...methods}>
						<form className="flex flex-col w-full">
							{/* Step Content */}
							{currentStep === 0 && (
								<div className="min-h-[calc(100vh-410px)]">
									{/* Auditee Selection */}
									<div className="space-y-4">
										<label
											className="block text-lg"
											htmlFor="auditee-select"
										>
											Select Auditee
										</label>
										<div className="flex items-start gap-4">
											<div className="flex flex-col">
												<Controller
													name="auditee"
													control={methods.control}
													rules={{
														validate: (val) =>
															val?.value
																? true
																: "Please select an auditee.",
													}}
													render={({
														field,
														fieldState,
													}) => (
														<Popover
															open={openCombo}
															onOpenChange={
																setOpenCombo
															}
														>
															<PopoverTrigger
																asChild
															>
																<Button
																	ref={
																		field.ref
																	}
																	variant="outline"
																	role="combobox"
																	aria-expanded={
																		openCombo
																	}
																	className={cn(
																		"w-[400px] justify-between",
																		fieldState.invalid &&
																			"border-red-500"
																	)}
																	id="auditee-select"
																>
																	{field.value
																		.value
																		? auditeeOptions.find(
																				(
																					opt
																				) =>
																					opt.value ===
																					field
																						.value
																						.value
																		  )
																				?.label
																		: "Choose an auditee..."}
																	<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
																</Button>
															</PopoverTrigger>

															<PopoverContent className="w-[400px] p-0">
																<Command>
																	<CommandInput placeholder="Search an auditee..." />
																	<CommandList>
																		<CommandEmpty>
																			No
																			Auditee
																			found.
																		</CommandEmpty>
																		<CommandGroup>
																			{auditeeOptions.map(
																				(
																					auditee
																				) => (
																					<CommandItem
																						key={
																							auditee.value
																						}
																						value={
																							auditee.label
																						}
																						onSelect={() => {
																							field.onChange(
																								auditee
																							);
																							setOpenCombo(
																								false
																							);
																						}}
																					>
																						<Check
																							className={cn(
																								"mr-2 h-4 w-4",
																								field
																									.value
																									?.value ===
																									auditee.value
																									? "opacity-100"
																									: "opacity-0"
																							)}
																						/>
																						{
																							auditee.label
																						}
																					</CommandItem>
																				)
																			)}
																		</CommandGroup>
																	</CommandList>
																</Command>
															</PopoverContent>
														</Popover>
													)}
												/>
											</div>
											<Button
												type="button"
												variant="secondary"
											>
												<PlusCircleIcon /> Add
											</Button>
										</div>
									</div>

									{/* Framework Selection */}
									<div className="space-y-4 mt-10 w-full">
										<label className="block text-lg">
											What is the reference for the
											framework?
										</label>
										<div className="flex flex-row justify-start gap-4 flex-wrap">
											{frameworks.map((f) => (
												<FrameworkCard
													key={f.value}
													name={f.name}
													value={f.value}
													fieldName="selectedFrameworks"
													control={methods.control}
													error={
														!!methods.formState
															.errors
															.selectedFrameworks
													} // Pass the error state
													setFocus={methods.setFocus} // Pass the setFocus function
												/>
											))}
											{/* Add link to framework section */}
											<div className="flex gap-2 justify-center cursor-pointer rounded-sm border p-4 font-roboto sm:w-28 bg-zinc-800 text-zinc-400 transition-all text-opacity-80 duration-100 hover:scale-110">
												<PlusCircleIcon /> Add
											</div>
										</div>
									</div>
								</div>
							)}
							{currentStep === 1 && (
								<div className="space-y-4 w-full min-h-[calc(100vh-410px)]">
									<Controller
										name="documents"
										control={methods.control}
										rules={{
											validate: (
												val: FilesUploadResponseDTO[]
											) => {
												if (
													(!val ||
														val.length === 0)
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
													return "Duplicate files are not allowed. Please remove the duplicate file and try again.";
												}

												return true;
											},
										}}
										render={({ field }) => (
											<FileUploadArea
												control={methods.control}
												name="documents"
												columns={columns}
											/>
										)}
									/>
								</div>
							)}
							{currentStep === 2 && (
								<div className="space-y-4 w-full min-h-[calc(100vh-410px)]">
									<SummaryStep goToStep={setCurrentStep} />
								</div>
							)}

							{/* Footer Navigation Buttons */}
							<div className="flex justify-start mt-8 gap-4">
								{currentStep !== 0 && (
									<button
										type="button"
										onClick={goPrevious}
										disabled={
											currentStep === 0 || isSubmitLoading
										}
										className="px-4 py-2 border border-zinc-500 rounded-full text-white hover:bg-zinc-700 disabled:opacity-30 font-bold"
									>
										Previous
									</button>
								)}
								{currentStep < steps.length - 1 ? (
									<button
										type="button"
										onClick={goNext}
										disabled={isSubmitLoading}
										className="px-4 py-2 bg-sky-600 text-white font-bold rounded-full hover:bg-sky-700 disabled:opacity-30"
									>
										Next
									</button>
								) : (
									<AlertDialogBox
										trigger={
											<button
												type="button"
												disabled={isSubmitLoading}
												className="px-4 py-2 bg-sky-600 text-white font-bold rounded-full hover:bg-sky-700 disabled:opacity-30"
											>
												{isSubmitLoading ? (
													<RoundSpinner />
												) : (
													"Run"
												)}
											</button>
										}
										subheading="Are you sure you want to proceed?"
										actionLabel="Confirm"
										onAction={onRunClick}
									/>
								)}
							</div>
						</form>
					</FormProvider>
				</div>
			</section>
		</div>
	);
};

export default NewEvaluation;
