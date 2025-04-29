import { FileUploadArea } from "@/components/newevaluation/FileUploadArea";
import { FrameworkCard } from "@/components/newevaluation/FrameworkCard";
import { SummaryStep } from "@/components/newevaluation/SummaryStep";
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
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/storeIndex";
import { Check, ChevronsUpDown, PlusCircleIcon } from "lucide-react";
import React, { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Link } from "react-router-dom";

interface AuditeeOption {
	value: string;
	label: string;
}

const NewEvaluation = () => {
	const steps = [
		{ id: 0, label: "Choose Framework" },
		{ id: 1, label: "Upload Documents" },
		{ id: 2, label: "Begin Evaluation" },
	];

	const auditees = useAppSelector((state) => state.company.data);

	const auditeeOptions = [];

	auditees.map((auditee) => {
		auditeeOptions.push({
			value: auditee.tg_company_id,
			label: auditee.tg_company_display_name,
		});
	})

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

	const goNext = async (e: React.MouseEvent) => {
		e.preventDefault();

		if(currentStep === 0) {
			const result = await methods.trigger(["auditee", "selectedFrameworks"]);
			if (!result){
				toast({
					title: "Error",
					description: methods.formState.errors.auditee?.message || methods.formState.errors.selectedFrameworks?.message,
					variant: "destructive",
				})
				return;
			};
		}

		if (currentStep === 1) {
			const result = await methods.trigger("documents");
			if (!result) {
				toast({
					title: "Error",
					description: methods.formState.errors.documents?.message,
					variant: "destructive",
				})
				return;
			}
		}

		if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
	};

	const goPrevious = () => {
		if (currentStep > 0) setCurrentStep(currentStep - 1);
	};

	const goToStep = async (stepId: number) => {
		if(currentStep === 0 && stepId > 0) {
			const result = await methods.trigger(["auditee", "selectedFrameworks"]);
			if (!result){
				toast({
					title: "Error",
					description: methods.formState.errors.auditee?.message || methods.formState.errors.selectedFrameworks?.message,
					variant: "destructive",
				})
				return;
			};
		}

		if (currentStep === 1 && stepId > 1) {
			const result = await methods.trigger("documents");
			if (!result) {
				toast({
					title: "Error",
					description: methods.formState.errors.documents?.message,
					variant: "destructive",
				})
				return;
			}
		}
		setCurrentStep(stepId)
	};

	const methods = useForm({
		defaultValues: {
			auditee: {} as AuditeeOption,
			selectedFrameworks: [],
			documents: [],
		},
	});

	const {toast} = useToast();

	const submit = (data: any) => {
		console.log(data);
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
				description: "Some fields are empty. Please fill them out before proceeding.",
				variant: "destructive",
			})
		}
	}

	return (
		<div className="min-h-screen font-roboto bg-black text-white p-6">
			<section className="flex justify-center items-center w-full bg-black text-white pb-0 pt-10 px-6 sm:px-12 lg:px-16">
				<div className="max-w-7xl w-full px-4 flex flex-col gap-2">
					{/* Left: Welcome message */}
					<h1 className="text-4xl font-semibold text-white tracking-wide">
						Start a new evaluation!
					</h1>

					{/* Subtitle */}
					<p className="text-base text-slate-500">
						Review documentation gaps against leading security
						standards and frameworks
					</p>
				</div>
			</section>

			{/* Progress Bar Section */}
			<section className="flex justify-center items-center w-full bg-black text-white pt-10 px-6 sm:px-12 lg:px-16">
				<div className="max-w-7xl w-full px-4">
					<div className="flex items-center justify-between gap-4">
						{steps.map((step, index) => {
							const isCompleted = index < currentStep;
							const isCurrent = index === currentStep;

							return (
								<div
									key={step.id}
									className="flex-1 flex flex-col items-center cursor-pointer text-center"
									onClick={() => goToStep(index)}
								>
									<div
										className={`w-full h-8 rounded-full relative transition-colors mb-4
              ${
					isCompleted
						? "bg-violet-600"
						: isCurrent
						? "bg-blue-500"
						: "bg-slate-700"
				}
              hover:opacity-90`}
									>
										<span className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
											{step.label}
										</span>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</section>

			<section className="flex justify-center items-center w-full bg-black text-white pt-3 px-6 sm:px-12 lg:px-16">
				<div className="max-w-7xl w-full mt-8 px-4">
					<FormProvider {...methods}>
						<form
							className="flex flex-col w-full"
						>
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
															val?.value ? true : "Please select an auditee.",
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
															<PopoverTrigger asChild>
																<Button
																	ref={field.ref}
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
																	{field.value.value
																		? auditeeOptions.find(
																				(
																					opt
																				) =>
																					opt.value ===
																					field.value.value
																		)?.label
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
																							field.onChange(auditee);
																							setOpenCombo(false);
																						}}
																					>
																						<Check
																							className={cn(
																								"mr-2 h-4 w-4",
																								field.value?.value ===
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
												<PlusCircleIcon /> Add Auditee
											</Button>
										</div>
									</div>

									{/* Framework Selection */}
									<div className="space-y-4 mt-10 w-full">
										<label className="block text-lg">
											What is the reference for the framework?
										</label>
										<div className="flex flex-row justify-start gap-4">
											{frameworks.map((f) => (
												<FrameworkCard
													key={f.value}
													name={f.name}
													value={f.value}
													fieldName="selectedFrameworks"
													control={methods.control}
													error={
														!!methods.formState.errors.selectedFrameworks
													} // Pass the error state
													setFocus={methods.setFocus} // Pass the setFocus function
												/>
											))}
											{/* Add link to framework section */}
											<div className="cursor-pointer rounded-sm border p-4 text-white align-middle font-roboto transition-colors text-center sm:w-fit bg-zinc-800 duration-200 hover:scale-110">
												Add Framework
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
											validate: (val) =>
												val.length > 0 || "Please upload at least one document.",
										}}
										render={({ field }) => (
											<FileUploadArea
												control={methods.control}
												name="documents"
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
								<button
									type="button"
									onClick={goPrevious}
									disabled={currentStep === 0}
									className="px-4 py-2 border border-zinc-500 rounded-full text-white hover:bg-zinc-700 disabled:opacity-30 font-bold"
								>
									Previous
								</button>
								{currentStep < steps.length - 1 ? (
									<button
										type="button"
										onClick={goNext}
										className="px-4 py-2 bg-sky-600 text-white font-bold rounded-full hover:bg-sky-700 disabled:opacity-30"
									>
										Next
									</button>
								) : (
									<button
										type="button"
										onClick={onRunClick}
										className="px-4 py-2 bg-sky-600 text-white font-bold rounded-full hover:bg-sky-700 disabled:opacity-30"
									>
										Run!
									</button>
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
