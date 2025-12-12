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
import { AUDITEE_SERVICES, AUDITEE_DATA_TYPES } from "@/constants/auditeeOptions";

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
			created_by: userData.first_name + " " + userData.last_name,
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
				description: `A fatal error occured while ${isEditMode ? "updating" : "creating"
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
					<div className="max-w-7xl flex justify-between px-4 rounded-2xl bg-gradient-to-b from-[#B05BEF] to-[black] w-full p-0 sm:p-6 !pb-12">
						<div className="flex items-baseline gap-6">
							<span
								ref={spanRef}
								className="invisible text-white text-6xl font-bold absolute whitespace-pre tracking-wide w-fit"
							>
								{watchedAuditeeName || " "}
							</span>
							{isFetchingData ? (
								<RoundSpinner />
							) : (
								<input
									type="text"
									ref={inputRef}
									className="text-6xl font-bold text-white tracking-wide bg-transparent border-none outline-none"
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
							<div
								onClick={handleEditClick}
								className="border-none rounded-fulls"
							>
								{isHeadingEditing ? (
									<Lock
										className="text-white/80 hover:text-white"
										size={20}
									/>
								) : (
									// <Edit
									// 	className="text-black/80 hover:text-black"
									// 	size={20}
									// />
									<svg width="20" height="20" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M7.44885 0C7.63871 0.000210585 7.82132 0.0729087 7.95937 0.203241C8.09743 0.333573 8.1805 0.511701 8.19163 0.701231C8.20276 0.890761 8.14109 1.07739 8.01924 1.22298C7.89738 1.36857 7.72453 1.46213 7.536 1.48456L7.44885 1.48977H1.48977V11.9182H11.9182V5.95908C11.9184 5.76923 11.9911 5.58661 12.1214 5.44856C12.2517 5.31051 12.4299 5.22743 12.6194 5.2163C12.8089 5.20518 12.9955 5.26684 13.1411 5.3887C13.2867 5.51055 13.3803 5.6834 13.4027 5.87193L13.4079 5.95908V11.9182C13.4081 12.294 13.2661 12.656 13.0105 12.9316C12.755 13.2072 12.4047 13.376 12.0299 13.4042L11.9182 13.4079H1.48977C1.11392 13.4081 0.751912 13.2661 0.476318 13.0105C0.200725 12.755 0.0319134 12.4047 0.00372459 12.0299L7.46882e-08 11.9182V1.48977C-0.000118868 1.11392 0.141831 0.751912 0.397394 0.476318C0.652957 0.200725 1.00324 0.0319134 1.37804 0.00372451L1.48977 0H7.44885ZM12.0992 0.255496C12.2332 0.121902 12.4131 0.0443404 12.6023 0.0385641C12.7914 0.0327878 12.9757 0.09923 13.1176 0.224396C13.2596 0.349562 13.3486 0.524065 13.3665 0.712464C13.3845 0.900862 13.33 1.08903 13.2143 1.23874L13.1524 1.30951L5.77807 8.68313C5.64403 8.81672 5.46415 8.89428 5.27499 8.90006C5.08583 8.90583 4.90156 8.83939 4.75961 8.71423C4.61766 8.58906 4.52867 8.41456 4.51073 8.22616C4.49278 8.03776 4.54722 7.84959 4.66298 7.69988L4.72481 7.62986L12.0992 0.255496Z" fill="white" />
									</svg>

								)}
							</div>
						</div>
					</div>
				)}
			</section>

			<section className="flex justify-between items-center w-full bg-black text-white px-3 sm:px-6 md:px-4 lg:px-16">
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
									options={AUDITEE_SERVICES}
									label="Related Services"
								/>
							</div>
							{/* Data processed type */}
							<div className="space-y-4 mt-8">
								<MultiSelectBox
									control={methods.control}
									name="auditeeData"
									options={AUDITEE_DATA_TYPES}
									label="Type of data processed?"
								/>
							</div>
							{/* Submit Button */}
							<div className="mt-4 w-fit bg-black px-0 p-6 flex justify-start gap-2">
								<AlertDialogBox
									trigger={
										<Button
											type="button"
											variant="primary"
											className="rounded-2xl transition-colors font-bold text-md"
											disabled={
												isLoading ||
												isFetchingData ||
												!methods.formState.isDirty
											}
										>
											{isLoading || isFetchingData ? (
												<RoundSpinner />
											) : (
												`${isEditMode
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
