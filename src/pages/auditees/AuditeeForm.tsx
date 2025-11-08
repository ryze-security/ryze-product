import { AlertDialogBox } from "@/components/AlertDialogBox";
import InfoCard from "@/components/auditee/InfoCard";
import { MultiSelectBox } from "@/components/auditee/SelectBoxes";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RoundSpinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
	CompanyCreateDto,
	CompanyListDto,
	CompanyUpdateDto,
} from "@/models/company/companyDTOs";
import companyService from "@/services/companyServices";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loadCompanyData } from "@/store/slices/companySlice";
import { Edit, Lock } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";

const services = [
	{
		label: "SaaS",
		value: "saas",
	},
	{
		label: "IaaS",
		value: "iaas",
	},
	{
		label: "PaaS",
		value: "paas",
	},
	{
		label: "COTS",
		value: "cots",
	},
	{
		label: "Hardware",
		value: "hardware",
	},
	{
		label: "Telecom",
		value: "telecom",
	},
	{
		label: "Consulting",
		value: "consulting",
	},
	{
		label: "None",
		value: "none",
	},
];

const companyDataTypes = [
	{
		label: "Personal Data",
		value: "personal_data",
	},
	{
		label: "Sensitive Data",
		value: "sensitive_data",
	},
	{
		label: "Financial Data",
		value: "financial_data",
	},
	{
		label: "None",
		value: "none",
	},
];

function AuditeeForm() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { auditeeId } = useParams();
	const isEditMode = Boolean(auditeeId);
	const { toast } = useToast();
	const userData = useAppSelector((state) => state.appUser);

	const methods = useForm({
		defaultValues: {
			auditeeName: "" as string,
			auditeeData: [] as string[],
			auditeeService: [] as string[],
		},
	});

	const [isLoading, setIsLoading] = useState(false);
	const [isFetchingData, setIsFetchingData] = useState(false);
	const [isHeadingEditing, setIsHeadingEditing] = useState(false);
	const [auditeeData, setAuditeeData] = useState<CompanyListDto>(null);

	const inputRef = useRef<HTMLInputElement>(null);
	const spanRef = useRef<HTMLSpanElement>(null);

	const watchedAuditeeName = methods.watch("auditeeName");

	useEffect(() => {
		if (inputRef.current && spanRef.current) {
			inputRef.current.style.width =
				spanRef.current.offsetWidth + 2 + "px";
		}
	}, [watchedAuditeeName]);

	// fetches auditee data on mount if is in edit mode
	useEffect(() => {
		if (isEditMode) {
			const fetchData = async () => {
				setIsFetchingData(true);
				try {
					const data: CompanyListDto =
						await companyService.getCompanyByCompanyId(
							userData.tenant_id,
							auditeeId
						);
					setAuditeeData(data);
					methods.reset({
						auditeeName: data.tg_company_display_name,
						auditeeData: data.data_type,
						auditeeService: data.service_type,
					});
				} catch (error) {
					toast({
						title: "Error fetching auditee data",
						description:
							"A fatal error occurred while fetching auditee data. Please try again later!",
						variant: "destructive",
					});
				} finally {
					setIsFetchingData(false);
				}
			};

			fetchData();
		}
	}, [auditeeId]);

	const onSubmit = async (data: any) => {
		setIsLoading(true);
		const companyData: CompanyCreateDto = {
			tenant_id: userData.tenant_id,
			company_name: data.auditeeName,
			company_type: data.auditeeData[0],
			created_by: userData.first_name + " "+ userData.last_name,
			data_type: data.auditeeData,
			service_type: data.auditeeService,
		};

		try {
			if (isEditMode) {
				const updateData: CompanyUpdateDto = {
					company_name: data.auditeeName,
					data_type: data.auditeeData,
					service_type: data.auditeeService,
				};
				const response = await companyService.updateCompany(
					userData.tenant_id,
					auditeeId as string,
					updateData
				);
				dispatch(loadCompanyData(userData.tenant_id));
				methods.reset({
					auditeeName: response.tg_company_display_name,
					auditeeData: response.data_type,
					auditeeService: response.service_type,
				});
				toast({
					title: "Auditee updated successfully!",
					description: "The auditee has been updated successfully.",
					variant: "default",
					className: "bg-green-ryzr text-white",
				});
			} else {
				const response = await companyService.createCompany(
					companyData
				);
				dispatch(loadCompanyData(userData.tenant_id));
				toast({
					title: "Auditee created successfully!",
					description: `The auditee with name: ${response.tg_company_display_name} has been created successfully.`,
					variant: "default",
					className: "bg-green-ryzr text-white",
				});
				navigate("/auditee/dashboard");
			}
		} catch (error) {
			toast({
				title: `Error ${isEditMode ? "updating" : "creating"} auditee`,
				description: `A fatal error occured while ${
					isEditMode ? "updating" : "creating"
				} auditee. Please try again later!`,
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleEditClick = () => {
		if (isHeadingEditing) {
			methods.setValue("auditeeName", watchedAuditeeName, {
				shouldDirty: true,
			});
		}
		setIsHeadingEditing((prev) => {
			const newState = !prev;
			if (newState) {
				// Timeout ensures DOM updates before trying to focus
				setTimeout(() => {
					inputRef.current?.focus();
				}, 0);
			}
			return newState;
		});
	};

	const onRunClick = () => {
		methods.handleSubmit(onSubmit)();
	};

	return (
		<div className="relative min-h-screen font-roboto bg-black text-white p-6">
			<section className="flex w-full bg-black text-white pb-0 pt-16 lg:pt-10 px-3 sm:px-6 md:px-4 lg:px-16">
				{!isEditMode ? (
					// Non-editable heading
					<div className="max-w-7xl flex flex-col sm:flex-row justify-between rounded-2xl bg-gradient-to-b from-[#B05BEF] to-[black] w-full p-0 sm:p-6 pb-10">
						<div className="flex flex-col space-y-4 p-6">
							<h1 className="text-6xl font-bold">Create a new auditee</h1>
							<h3>Add a new auditee to conduct security assessment</h3>
						</div>
					</div>
				) : (
					// Editable heading
					<div className="max-w-7xl w-full flex justify-between px-4">
						<div className="flex gap-2">
							<span
								ref={spanRef}
								className="invisible absolute whitespace-pre text-4xl font-semibold tracking-wide w-fit"
							>
								{watchedAuditeeName || " "}
							</span>
							{isFetchingData ? (
								<RoundSpinner />
							) : (
								<input
									type="text"
									ref={inputRef}
									className="text-4xl font-semibold text-white tracking-wide bg-transparent border-none outline-none disabled:opacity-70"
									value={watchedAuditeeName}
									disabled={!isHeadingEditing}
									onChange={(e) =>
										methods.setValue(
											"auditeeName",
											e.target.value,
											{ shouldDirty: false }
										)
									}
								/>
							)}
							<Button
								variant="outline"
								onClick={handleEditClick}
								className="border-none bg-black"
							>
								{isHeadingEditing ? (
									<Lock
										className="text-violet-ryzr/80 hover:text-violet-ryzr"
										style={{
											width: "28px",
											height: "28px",
										}}
									/>
								) : (
									<Edit
										className="text-violet-ryzr/80 hover:text-violet-ryzr"
										style={{
											width: "28px",
											height: "28px",
										}}
									/>
								)}
							</Button>
						</div>
					</div>
				)}
			</section>

			<section className="flex justify-between items-center w-full bg-black text-white pt-10 px-3 sm:px-6 md:px-4 lg:px-16">
				<div className="max-w-7xl w-full p-0 sm:p-6 pb-10 mt-1">
					<FormProvider {...methods}>
						<form className="flex flex-col w-full">
							{/* Auditee Name Input Field */}
							{!isEditMode ? (
								<div className="space-y-4 max-w-[400px]">
									<Label
										htmlFor="auditeeName"
										className="text-white text-lg"
									>
										Auditee Name
									</Label>
									<Input
										id="auditeeName"
										placeholder="Add auditee name..."
										className={cn(
											"bg-zinc-900",
											methods.formState.errors
												.auditeeName &&
												"border-rose-500 focus-visible:ring-rose-500"
										)}
										{...methods.register("auditeeName", {
											required:
												"Auditee name is required!",
										})}
										onBlur={async (e) => {
											methods.setValue(
												"auditeeName",
												e.target.value
											);
											await methods.trigger(
												"auditeeName"
											);
										}}
										onInput={() =>
											methods.clearErrors("auditeeName")
										}
									/>
									{methods.formState.errors.auditeeName && (
										<p className="text-sm text-rose-500">
											{
												methods.formState.errors
													.auditeeName.message
											}
										</p>
									)}
								</div>
							) : (
								<div className="flex justify-start gap-4">
									<InfoCard
										heading="Reviews conducted"
										data={auditeeData?.evaluations_count}
										info=""
										loading={isFetchingData}
										link={
											"/auditee/evaluations/" + auditeeId
										}
									/>
									<InfoCard
										heading="Documents reviewed"
										data={auditeeData?.documents_count}
										info=""
										loading={isFetchingData}
										link={"/auditee/documents/" + auditeeId}
									/>
								</div>
							)}
							{/* Related services single select boxes */}
							<div className="space-y-4 mt-8">
								<MultiSelectBox
									control={methods.control}
									name="auditeeService"
									options={services}
									label="Related Services"
								/>
							</div>
							{/* Data processed type */}
							<div className="space-y-4 mt-8">
								<MultiSelectBox
									control={methods.control}
									name="auditeeData"
									options={companyDataTypes}
									label="Type of data processed?"
								/>
							</div>
							{/* Submit Button */}
							<div className="absolute bottom-0 w-fit bg-black px-0 p-6 flex justify-start gap-2">
								<AlertDialogBox
									trigger={
										<Button
											type="button"
											className="bg-neutral-800 hover:bg-neutral-700 rounded-2xl transition-colors text-white font-bold text-md"
											disabled={
												isLoading ||
												isFetchingData ||
												!methods.formState.isDirty
											}
										>
											{isLoading || isFetchingData ? (
												<RoundSpinner />
											) : (
												`${
													isEditMode
														? "Update"
														: "Create"
												}`
											)}
										</Button>
									}
									subheading="Are you sure you want to proceed? Clicking confirm will save your data."
									title="Are You Sure?"
									actionLabel="Confirm"
									onAction={onRunClick}
								/>
								{methods.formState.isDirty ? (
									<AlertDialogBox
										trigger={
											<Button
												variant="default"
												disabled={isLoading}
												className={
													"bg-gray-ryzr hover:bg-gray-ryzr/70 rounded-2xl transition-opacity duration-150 text-white font-bold text-md"
												}
											>
												Cancel
											</Button>
										}
										subheading="Are you sure you want to cancel this operation? Clicking confirm will cause all your unsaved data to be lost."
										title="Are You Sure?"
										actionLabel="Confirm"
										actionHref="/auditee/dashboard"
										confirmButtonClassName="bg-rose-600 hover:bg-rose-700 focus:ring-rose-600"
									/>
								) : (
									<Button
										variant="default"
										disabled={isLoading}
										onClick={() =>
											navigate("/auditee/dashboard")
										}
										className={
											"bg-gray-ryzr hover:bg-gray-ryzr/70 rounded-2xl transition-opacity duration-150 text-white font-bold text-md"
										}
									>
										Back
									</Button>
								)}
							</div>
						</form>
					</FormProvider>
				</div>
			</section>
		</div>
	);
}

export default AuditeeForm;
