import { useToast } from "@/hooks/use-toast";
import {
	reportResultDTO,
	reportResultListDTO,
} from "@/models/reports/ExcelDTOs";
import reportsService from "@/services/reportsServices";
import { ColumnDef } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import { GenericDataTable } from "../GenericDataTable";
import { cn } from "@/lib/utils";
import companyService from "@/services/companyServices";
import { CompanyListDto } from "@/models/company/companyDTOs";
import { Loader2 } from "lucide-react";

interface Props {
	tenantId: string;
	companyId: string;
	evaluationId: string;
	className?: string;
}

interface ReportList {
	sNo: number;
	reportName: string;
	report_id: string;
	eval_id: string;
	report_type: string;
	processing_status: string;
	created_at: string;
	created_by: string;
}

function EvaluationReports(props: Props) {
	const { tenantId, companyId, evaluationId, className } = props;
	const { toast } = useToast();

	const reportColumns: ColumnDef<ReportList>[] = [
		{
			accessorKey: "sNo",
			header: "S.No",
		},
		{
			accessorKey: "reportName",
			header: "Report Name",
		},
		{
			accessorKey: "report_type",
			header: "Report Type",
		},
		{
			accessorKey: "created_at",
			header: "Created At",
		},
		{
			accessorKey: "created_by",
			header: "Created By",
		},
	];

	const [reports, setReports] = useState<ReportList[]>([]);
	const [companyData, setCompanyData] = useState<CompanyListDto>(null);
	const [isReportListLoading, setIsReportListLoading] =
		useState<boolean>(false);
	const [isReportDownloading, setIsReportDownloading] =
		useState<boolean>(false);
	const [fetchedReports, setFetchedReports] = useState<boolean>(false);

	//Fetches reports list
	useEffect(() => {
		const fetchReports = async () => {
			try {
				setIsReportListLoading(true);
				const companyDataResponse: CompanyListDto = await companyService.getCompanyByCompanyId(tenantId, companyId)
				setCompanyData(companyDataResponse)


				const response: reportResultListDTO =
					await reportsService.getReportList(
						tenantId,
						companyId,
						evaluationId
					);
				const updatedData = [...response.reports]
					.map((item, index) => {
						return {
							...item,
							sNo: index + 1,
							created_at: new Date(
								item.created_at
							).toLocaleDateString(),
							reportName: `Report_${index + 1}`,
							report_type: item.report_type === "Observations" ? "Gap Analysis Report" : item.report_type,
						};
					})
					.sort((a, b) => b.created_at.localeCompare(a.created_at));
				setReports(updatedData);
				setFetchedReports(true);
			} catch {
				toast({
					title: "Error",
					description: `Failed to fetch reports. Please try again later!`,
					variant: "destructive",
				});
			} finally {
				setIsReportListLoading(false);
			}
		};

		fetchReports();
	}, [tenantId, companyId, evaluationId]);

	const formatHeaderCells = (text: string): string => {
		const wordsToRemove = ["display", "name"];
		return text
			.replace(/_/g, " ")
			.split(" ")
			.filter((word) => !wordsToRemove.includes(word.toLowerCase()))
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	};



	return (
		<div className="max-w-7xl w-full">
			<div className="flex flex-col sm:flex-row justify-between rounded-2xl bg-gradient-to-b from-[#B05BEF] to-[black] w-full p-0 sm:p-6 pb-10">
				<div className="flex flex-col space-y-4 p-3">
					<h1 className="text-4xl sm:text-6xl font-bold text-white">Generated Reports</h1>
					<h3 className="text-white/90">Browse through generated reports to track progress and review findings.</h3>
				</div>
			</div>
			<section
				className={cn(
					"flex items-center w-full bg-black text-white pt-4",
					className
				)}
			>
				{fetchedReports ?
					<GenericDataTable
						columns={reportColumns}
						data={reports}
						reportsActionsData={{
							companyId: companyId,
							companyName: companyData.tg_company_display_name,
							tenantId: tenantId,
							evalId: evaluationId
						}}
						isLoading={isReportListLoading}
						filterKey="reportName"
						onRowClick={() => { }}
						downloadButton={true}
						disabledRow={isReportDownloading}
					/>
					:
					<Loader2 className="animate-spin" />
				}
			</section>
		</div>
	);
}

export default EvaluationReports;
