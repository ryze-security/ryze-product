import { AlertDialogBox } from "@/components/AlertDialogBox";
import ComingSoonBorder from "@/components/ComingSoonBorder";
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
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { RoundSpinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { collectionDataDTO } from "@/models/collection/collectionDTOs";
import { CompanyListDto } from "@/models/company/companyDTOs";
import { CreditsDataDTO } from "@/models/credits/creditsDTOs";
import {
	createEvaluationDTO,
	createEvaluationResponseDTO,
} from "@/models/evaluation/EvaluationDTOs";
import { FilesUploadResponseDTO } from "@/models/files/FilesUploadResponseDTO";
import {
	requestCreditsBodyDTO,
	requestFrameworkBodyDTO,
} from "@/models/landing_page/contact_usDTOs";
import creditsService from "@/services/creditsServices";
import customFormsService from "@/services/customFormsServices";
import evaluationService from "@/services/evaluationServices";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loadCollections } from "@/store/slices/collectionSlice";
import { loadCompanyData } from "@/store/slices/companySlice";
import { ColumnDef } from "@tanstack/react-table";
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

	const { collection, status, error } = useAppSelector(
		(state) => state.collections
	);

	const userData = useAppSelector((state) => state.appUser);

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
		{ name: "SOC 2", value: "soc2" },
		{ name: "GDPR", value: "gdpr" },
		{ name: "ISO 27701", value: "iso27701" },
		{ name: "Internal", value: "internal" },
	];

	const [currentStep, setCurrentStep] = useState(0);
	const [openCombo, setOpenCombo] = useState(false);
	const [isSubmitLoading, setIsSubmitLoading] = useState(false);

	const [openDialog, setOpenDialog] = useState(false);

	const [creditsAlert, setCreditsAlert] = useState(false);

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
			if (documentLength === 0) {
				methods.setError("documents", {
					type: "manual",
					message: "Please select at least one document.",
				});
			}
			if (!result || documentLength === 0) {
				toast({
					title: "Error",
					description:
						methods.formState.errors.auditee?.message ||
						methods.formState.errors.selectedFrameworks?.message ||
						methods.formState.errors.documents?.message,
					variant: "destructive",
				});
				return;
			}
		} else if (currentStep === 0 && stepId > 0) {
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

	const frameworkForm = useForm({
		defaultValues: {
			framework: "",
			details: "",
		},
	});

	const watchedAuditeeName = methods.watch("auditee");

	const { toast } = useToast();

	const submit = async (data: {
		auditee: AuditeeOption;
		selectedFrameworks: { name: string; value: string }[];
		documents: FilesUploadResponseDTO[];
	}) => {
		setIsSubmitLoading(true);
		const evaluationDatas: createEvaluationDTO[] = [];
		data.selectedFrameworks.forEach((framework) => {
			const evaluationData: createEvaluationDTO = {
				tenant_id: userData.tenant_id,
				company_id: data.auditee.value,
				collection_id: framework.value, 
				created_by: userData.first_name + " " + userData.last_name,
				model_used: "azure-gpt04-mini",
				document_list: [...data.documents.map((doc) => doc.file_id)],
			};
			evaluationDatas.push(evaluationData);
		});

		try {
			evaluationDatas.forEach(async (evaluationData) => {
				const response =
					await evaluationService.evaluationService.createEvaluation(
						evaluationData
					);
				const evalId: createEvaluationResponseDTO = response;

				try {
					const response =
						await evaluationService.evaluationService.startEvaluation(
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
			});
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
		const isValid = documentLength > 0 && frameworkLength > 0;

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
			dispatch(loadCompanyData(userData.tenant_id));
		}
		if (collection.collections.length === 0) {
			dispatch(loadCollections(userData.tenant_id));
		}
	}, []);

	//fetches credits for validity check
	useEffect(() => {
		const fetchCredits = async () => {
			try {
				const response = (await creditsService.getCreditsByTenantId(
					userData.tenant_id
				)) as CreditsDataDTO;
				if (response.remaining_credits <= 0) {
					setCreditsAlert(true);
				}
			} catch (error) {
				toast({
					title: "Error fetching credits",
					description:
						"There was an error fetching your credits. Please try again later.",
					variant: "destructive",
				});
			}
		};

		if (userData.tenant_id && currentStep === 2) {
			fetchCredits();
		}
	}, [userData.tenant_id, currentStep]);

	const [frameworkFormSubmitLoading, setFrameworkFormSubmitLoading] =
		useState(false);

	//request framework form submit action
	const frameworkFormSubmit = (data: any) => {
		try {
			setFrameworkFormSubmitLoading(true);
			const response = customFormsService.customForm(
				userData.user_id,
				userData.tenant_id,
				"request_framwork",
				{
					email: userData.email as string,
					framework_name: data.framework as string,
					additional_details: data.details as string,
				} as requestFrameworkBodyDTO
			);
			toast({
				title: "Request submitted",
				description:
					"Your framework request has been submitted successfully. We'll get back to you soon!",
				variant: "default",
				className: "bg-green-ryzr",
			});
		} catch (error) {
			toast({
				title: "Error",
				description:
					"There was an error submitting your request. Please try again later.",
				variant: "destructive",
			});
		} finally {
			setFrameworkFormSubmitLoading(false);
			setOpenDialog(false);
		}
	};

	//request credit form submit action
	const creditsAction = () => {
		try {
			const response = customFormsService.customForm(
				userData.user_id,
				userData.tenant_id,
				"request_credits",
				{ email: userData.email as string } as requestCreditsBodyDTO
			);
			toast({
				title: "Request submitted",
				description:
					"Your credits request has been submitted successfully. We'll get back to you soon!",
				variant: "default",
				className: "bg-green-ryzr",
			});
			navigate("/home");
		} catch (error) {
			toast({
				title: "Error",
				description:
					"There was an error submitting your request. Please try again later.",
				variant: "destructive",
			});
			navigate("/home");
		}
	};

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
											className="block text-lg max-w-fit"
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
											<AlertDialogBox
												trigger={
													<Button
														type="button"
														variant="secondary"
													>
														<PlusCircleIcon /> Add
													</Button>
												}
												title="Alert!"
												subheading="You are leaving this page, any unsaved changes will be lost. Are you sure you want to proceed?"
												actionLabel="Confirm"
												actionHref={"/auditee/new"}
											/>
										</div>
									</div>

									{/*Framework Selection */}
									<div className="space-y-4 mt-10 w-full">
										<label className="block text-lg">
											What is the reference for the
											framework?
										</label>
										{status === "succeeded" ? (
											<div className="grid grid-cols-6 justify-start gap-2 w-11/12">
												{collection.collections.map(
													(f) => (
														<div className="p-1">
															<FrameworkCard
																key={
																	f.collection_id
																}
																name={
																	f.collection_display_name
																}
																value={
																	f.collection_id
																}
																fieldName="selectedFrameworks"
																control={
																	methods.control
																}
																error={
																	!!methods
																		.formState
																		.errors
																		.selectedFrameworks
																} // Pass the error state
																setFocus={
																	methods.setFocus
																} // Pass the setFocus function
																multiSelectAllowed={false}
															/>
														</div>
													)
												)}
												{frameworks.map((f) => (
													<ComingSoonBorder className="transition-transform duration-100 group hover:scale-105">
														<FrameworkCard
															key={f.value}
															disabed={true}
															name={f.name}
															value={f.value}
															fieldName="selectedFrameworks"
															control={
																methods.control
															}
															error={
																!!methods
																	.formState
																	.errors
																	.selectedFrameworks
															} // Pass the error state
															setFocus={
																methods.setFocus
															} // Pass the setFocus function
															className="group-hover:scale-100"
														/>
													</ComingSoonBorder>
												))}
												{/*Add link to framework section */}
												<div className="p-1">
													<div
														className="flex gap-2 justify-center cursor-pointer rounded-sm border p-4 font-roboto sm:w-full bg-zinc-800 text-zinc-400 transition-all text-opacity-80 duration-100 hover:scale-110"
														onClick={() =>
															setOpenDialog(true)
														}
													>
														Request
													</div>
												</div>
											</div>
										) : (
											<RoundSpinner />
										)}
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
												if (!val || val.length === 0) {
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
				<Dialog open={openDialog} onOpenChange={setOpenDialog}>
					<DialogContent>
						<FormProvider {...frameworkForm}>
							<form
								onSubmit={frameworkForm.handleSubmit(
									frameworkFormSubmit
								)}
								className="sm:max-w-lg flex flex-col gap-4"
							>
								<div className="grid gap-1">
									<DialogHeader className="text-xl font-bold">
										New Framework Request
									</DialogHeader>
									<DialogDescription className="text-sm">
										Submit a request for a new compliance
										framework to be added to the platform.
									</DialogDescription>
								</div>
								<Separator />
								<div className="grid gap-4">
									<div className="grid gap-3">
										<Label htmlFor="frameworkName">
											Framework Name
										</Label>
										<Input
											id="frameworkName"
											name="framework"
											placeholder="e.g., NIST CSF 2.0"
											{...frameworkForm.register(
												"framework",
												{ required: true }
											)}
										/>
										{frameworkForm.formState.errors
											.framework && (
											<p className="text-sm text-rose-700">
												Framework name is required
											</p>
										)}
									</div>
									<div className="grid gap-3">
										<Label htmlFor="details">
											Additional Details (Optional)
										</Label>
										<Textarea
											id="details"
											name="details"
											placeholder="Any specific requirements or versions?"
											{...frameworkForm.register(
												"details"
											)}
										/>
										<p className="text-sm text-zinc-400/70">
											This will help our team prioritize
											new additions.
										</p>
									</div>
								</div>
								<Separator />
								<DialogFooter>
									<DialogClose asChild>
										<Button
											variant="outline"
											className="hover:bg-zinc-800 transition-colors text-white"
											disabled={
												frameworkFormSubmitLoading
											}
										>
											Cancel
										</Button>
									</DialogClose>
									{/* TODO: integrate submit action and hookup the hook-form for the same  */}
									<Button
										className="bg-sky-500 hover:bg-sky-600 transition-colors 
							duration-200 text-white"
										type="submit"
										disabled={frameworkFormSubmitLoading}
									>
										Submit Request
									</Button>
								</DialogFooter>
							</form>
						</FormProvider>
					</DialogContent>
				</Dialog>
				<AlertDialogBox
					title="Credit Balance Depleted"
					subheading="Looks like you're out of credits! No problem—just let us know, and we'll be happy to top up your account for you."
					actionLabel="Request Credits"
					onCancel={() => navigate("/home")}
					open={creditsAlert}
					onOpenChange={setCreditsAlert}
					onAction={creditsAction}
				/>
			</section>
		</div>
	);
};

export default NewEvaluation;
