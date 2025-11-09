import { ProgressBarDataTable } from "@/components/ProgressBarDataTable";
import PageHeader from "@/components/PageHeader";
import { useToast } from "@/hooks/use-toast";
import { CompanyListDto } from "@/models/company/companyDTOs";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loadCompanyData } from "@/store/slices/companySlice";
import { ColumnDef } from "@tanstack/react-table";
import React, { useEffect, useMemo } from "react";
import { PlusCircleIcon, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

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
	const navigate = useNavigate();

	const [auditeeData, setAuditeeData] = React.useState<CompanyListDto[]>([]);
	const [filter, setFilter] = React.useState("");

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
			<section className="flex w-full bg-black text-white pb-0 pt-16 lg:pt-10 px-3 sm:px-6 md:px-4 lg:px-16">
				<div className="max-w-7xl flex flex-col sm:flex-row justify-between rounded-2xl bg-gradient-to-b from-[#B05BEF] to-[black] w-full p-0 sm:p-6 pb-10 ">
					<div className="flex flex-col space-y-4 p-6 ">
						<h1 className="text-6xl font-bold">Auditees</h1>
						<h3>Entities that require security evaluations to ensure compliance and mitigate potential risks.</h3>

						{/* search input */}
						<div className="relative pt-4">
							<Input
								placeholder={"Search auditees..."}
								value={filter}
								onChange={(e) => setFilter(e.target.value)}
								className="max-w-sm text-xl bg-white pl-10 text-black selection:text-black"
							/>
							<SearchIcon className="absolute left-3 top-9 transform -translate-y-1/2 text-gray-500 size-5" />
						</div>
					</div>

					<Button
						variant="default"
						className={`bg-white m-6 mt-0 sm:mt-6 hover:bg-gray-200 rounded-full transition-colors text-black font-extrabold text-md w-fit px-6 py-2`}
						onClick={() => {
							navigate("/auditee/new");
						}}
					>
						<PlusCircleIcon strokeWidth={3} />
						Add
					</Button>
				</div>
			</section>

			<section className="flex items-center w-full bg-black text-white mt-8 px-3 sm:px-6 md:px-4 lg:px-16">
				<ProgressBarDataTable
					columns={columns}
					data={auditeeData}
					filterKey="tg_company_display_name"
					rowIdKey={["tg_company_id"]}
					rowLinkPrefix="/auditee/edit/"
					isLoading={status === "loading" ? true : false}
					externalFilter={filter}
					setExternalFilter={setFilter}
					externalSearch={true}
				/>
			</section>
		</div>
	);
}

export default AuditeeDashboard;
