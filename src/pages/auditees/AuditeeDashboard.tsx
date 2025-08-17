import { ProgressBarDataTable } from "@/components/ProgressBarDataTable";
import PageHeader from "@/components/PageHeader";
import { useToast } from "@/hooks/use-toast";
import { CompanyListDto } from "@/models/company/companyDTOs";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loadCompanyData } from "@/store/slices/companySlice";
import { ColumnDef } from "@tanstack/react-table";
import React, { useEffect, useMemo } from "react";

const columns: ColumnDef<CompanyListDto>[] = [
	{
		accessorKey: "tg_company_display_name",
		header: "Auditee Title",
	},
	{
		accessorKey: "created_by",
		header: "Created By",
	},
	{
		accessorKey: "created_on",
		header: "Created On",
	},
];

function AuditeeDashboard() {
	const { data, error, status } = useAppSelector((state) => state.company);
	const { toast } = useToast();
	const dispatch = useAppDispatch();

	const [auditeeData, setAuditeeData] = React.useState<CompanyListDto[]>([]);

	const userData = useAppSelector((state) => state.appUser);

	useMemo(() => {
		setAuditeeData(
			data.map((company: CompanyListDto) => {
				return {
					...company,
					created_on: new Date(
						company.created_on
					).toLocaleDateString(),
				};
			})
		);
	}, [data]);

	useEffect(() => {
		if (auditeeData.length === 0) {
			dispatch(loadCompanyData(userData.tenant_id));
		} else if (status == "failed") {
			toast({
				title: "Error",
				description: `Failed to fetch your data. Exiting with error: ${error}`,
				variant: "destructive",
			});
		}
	}, []);

	return (
		<div className="min-h-screen font-roboto bg-black text-white p-6">
			<section className="flex justify-center items-center w-full bg-black text-white pb-0 pt-10 px-6 sm:px-12 lg:px-16">
				<PageHeader
					heading="Auditees"
					subtitle="Entities that require security evaluations to ensure compliance and mitigate potential risks."
					buttonText="Add"
					variant="add"
					buttonUrl="/auditee/new"
				/>
			</section>

			<section className="flex items-center w-full bg-black text-white mt-8 pt-10 px-6 sm:px-12 lg:px-16">
				<ProgressBarDataTable
					columns={columns}
					data={auditeeData}
					filterKey="tg_company_display_name"
					rowIdKey={["tg_company_id"]}
					rowLinkPrefix="/auditee/edit/"
					isLoading={status === "loading" ? true : false}
				/>
			</section>
		</div>
	);
}

export default AuditeeDashboard;
