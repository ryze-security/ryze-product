import { GenericDataTable } from "@/components/GenericDataTable";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CompanyListDto } from "@/models/company/companyDTOs";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loadCompanyData } from "@/store/slices/companySlice";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown01Icon, ArrowUp01Icon, ArrowUpDownIcon } from "lucide-react";
import React, { useEffect, useMemo } from "react";

const columns: ColumnDef<CompanyListDto>[] = [
	{
		accessorKey: "SNo",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
					className="p-0 hover:bg-transparent hover:text-white/70 text-base"
				>
					SNo.
					{column.getIsSorted() === "asc" ? (
						<ArrowDown01Icon className="h-4 w-4" />
					) : column.getIsSorted() === "desc" ? (
						<ArrowUp01Icon className="h-4 w-4" />
					) : (
						<ArrowUpDownIcon className="h-4 w-4" />
					)}
				</Button>
			);
		},
		sortingFn: (a, b) => {
			return a.getValue<number>("SNo") - b.getValue<number>("SNo"); // Sort numerically
		},
	},
	{
		accessorKey: "tg_company_display_name",
		header: "Auditee",
	},
	{
		accessorKey: "evaluations_count",
		header: "Reviews",
		cell: ({ row }) => {
			const evaluationsCount: number = row.original.evaluations_count;
			return (
				<div className="rounded-full text-center flex items-center justify-center min-w-16 h-7 w-fit bg-[#404040]">
					{evaluationsCount}
				</div>
			);
		},
	},
	{
		accessorKey: "deviations_count",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
					className="p-0 hover:bg-transparent hover:text-white/70 text-base"
				>
					Deviations
					{column.getIsSorted() === "asc" ? (
						<ArrowDown01Icon className="h-4 w-4" />
					) : column.getIsSorted() === "desc" ? (
						<ArrowUp01Icon className="h-4 w-4" />
					) : (
						<ArrowUpDownIcon className="h-4 w-4" />
					)}
				</Button>
			);
		},
		cell: ({ row }) => {
			const deviationCount: number = row.original.deviations_count;
			return (
				<div className="rounded-full text-center flex items-center justify-center min-w-16 h-7 w-fit bg-[#404040]">
					{deviationCount}
				</div>
			);
		},
	},
	{
		accessorKey: "created_on",
		header: "Created On",
	},
];

function VulnerableAuditeeDashboard() {
	const dispatch = useAppDispatch();
	const { toast } = useToast();

	const companies = useAppSelector((state) => state.company);
	const userData = useAppSelector((state) => state.appUser);

	const updatedCompanyData: CompanyListDto[] = useMemo(() => {
		return [...companies.data]
			.sort((a, b) => b.deviations_count - a.deviations_count)
			.map((company, index) => ({
				...company,
				SNo: index + 1,
				created_on: new Date(company.created_on).toLocaleDateString(
					"en-UK"
				),
			}));
	}, [companies.data]);

	useEffect(() => {
		if (userData.tenant_id && companies.data.length === 0) {
			dispatch(loadCompanyData(userData.tenant_id))
				.unwrap()
				.catch((error) => {
					toast({
						title: "Error loading companies",
						description: `Failed to load companies data! Please try again later.`,
						variant: "destructive",
					});
				});
		}
	}, [userData.tenant_id, dispatch, companies.data.length]);

	return (
		<div className="min-h-screen font-roboto bg-black text-white p-6">
			<section className="flex w-full bg-black text-white pb-0 pt-16 lg:pt-10 px-3 sm:px-6 md:px-4 lg:px-16">
				<div className="max-w-7xl flex flex-col sm:flex-row justify-between rounded-2xl bg-gradient-to-b from-[#B05BEF] to-[black] w-full p-0 sm:p-6 pb-10">
					<div className="flex flex-col space-y-4 p-6">
						<h1 className="text-6xl font-bold">Vulnerable auditees</h1>
						<h3>Identify auditees with the highest number of deviations across all assessments.</h3>
					</div>
				</div>
			</section>

			<section className="flex items-center w-full bg-black text-white mt-8 px-3 sm:px-6 md:px-4 lg:px-16">
				<GenericDataTable
					columns={columns}
					data={updatedCompanyData}
					filterKey={"tg_company_display_name"}
					rowIdKey={["tg_company_id"]}
					rowLinkPrefix="/auditee/edit/"
					isLoading={companies.status === "loading"}
				/>
			</section>
		</div>
	);
}

export default VulnerableAuditeeDashboard;
