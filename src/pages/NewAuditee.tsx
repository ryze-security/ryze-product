import SingleSelectBox from "@/components/auditee/SingleSelectBox";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RoundSpinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { CompanyCreateDto } from "@/models/company/companyDTOs";
import companyService from "@/services/companyServices";
import { useAppDispatch } from "@/store/hooks";
import { loadCompanyData } from "@/store/slices/companySlice";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const services = [
	{
		label: "Saas",
		value: "saas",
	},
	{
		label: "Iaas",
		value: "iaas",
	},
	{
		label: "Paas",
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

function NewAuditee() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { toast } = useToast();

	const methods = useForm({
		defaultValues: {
			auditeeName: "" as string,
			auditeeType: "" as string,
			relevantData: "" as string,
			dataType: "" as string,
		},
	});

	const [isLoading, setIsLoading] = useState(false);

	const onSubmit = async (data: any) => {
		setIsLoading(true);
		const companyData: CompanyCreateDto = {
			tenant_id: "alpha123", //TODO: get tenant id from auth context
			company_name: data.auditeeName,
			company_type: data.auditeeType,
			created_by: "FE_SYSTEM", //TODO: get user id from auth context
		};

		try {
			const response = await companyService.createCompany(companyData);
			dispatch(loadCompanyData("alpha123"));
			navigate("/auditee/dashboard");
		} catch (error) {
			toast({
				title: "Error creating auditee",
				description:
					"A fatal error occured while creating auditee. Please try again later!",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen font-roboto bg-black text-white p-6">
			<section className="flex justify-center items-center w-full bg-black text-white pb-0 pt-10 px-6 sm:px-12 lg:px-16">
				<PageHeader
					heading="Create a new auditee"
					subtitle="Add a new auditee to conduct security assessment"
					buttonText="Cancel"
					buttonUrl="/auditee/dashboard"
					isLoading={isLoading}
				/>
			</section>

			<section className="flex justify-center items-center w-full bg-black text-white pt-10 px-6 sm:px-12 lg:px-16">
				<div className="max-w-7xl w-full mt-1 px-4">
					<FormProvider {...methods}>
						<form
							className="flex flex-col w-full"
							onSubmit={methods.handleSubmit(onSubmit)}
						>
							{/* Auditee Name Input Field */}
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
										methods.formState.errors.auditeeName &&
											"border-rose-500 focus-visible:ring-rose-500"
									)}
									{...methods.register("auditeeName", {
										required: "Auditee name is required!",
									})}
									onBlur={async (e) => {
										methods.setValue(
											"auditeeName",
											e.target.value
										);
										await methods.trigger("auditeeName");
									}}
									onInput={() =>
										methods.clearErrors("auditeeName")
									}
								/>
								{methods.formState.errors.auditeeName && (
									<p className="text-sm text-rose-500">
										{
											methods.formState.errors.auditeeName
												.message
										}
									</p>
								)}
							</div>
							{/* Related services single select boxes */}
							<div className="space-y-4 mt-8">
								<SingleSelectBox
									control={methods.control}
									name="auditeeType"
									options={services}
									label="Related Services"
								/>
							</div>
							{/* Relevant Data boolean */}
							<div className="space-y-4 mt-8">
								<SingleSelectBox
									control={methods.control}
									name="relevantData"
									options={[
										{
											label: "Yes",
											value: "yes",
										},
										{
											label: "No",
											value: "no",
										},
									]}
									label="Is relevant data processed by the auditee?"
								/>
							</div>
							{/* Data processed type */}
							<div className="space-y-4 mt-8">
								<SingleSelectBox
									control={methods.control}
									name="dataType"
									options={companyDataTypes}
									label="What is the type of data processed?"
								/>
							</div>
							{/* Submit Button */}
							<div className="flex justify-start mt-8">
								<Button
									type="submit"
									className="bg-sky-500 hover:bg-sky-600 rounded-2xl transition-colors text-white font-bold text-md"
									disabled={isLoading}
								>
									{isLoading ? <RoundSpinner /> : "Create"}
								</Button>
							</div>
						</form>
					</FormProvider>
				</div>
			</section>
		</div>
	);
}

export default NewAuditee;
