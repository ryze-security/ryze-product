import { useToast } from "@/hooks/use-toast";
import {
	reportResultDTO,
	reportResultListDTO,
} from "@/models/reports/ExcelDTOs";
import reportsService from "@/services/reportsServices";
import { ColumnDef } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import * as dfd from "danfojs";
import * as ExcelJS from "exceljs";
import * as FileSaver from "file-saver";
import { GenericDataTable } from "../GenericDataTable";
import { cn } from "@/lib/utils";

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
	const [isReportListLoading, setIsReportListLoading] =
		useState<boolean>(false);
	const [isReportDownloading, setIsReportDownloading] =
		useState<boolean>(false);

	//Fetches reports list
	useEffect(() => {
		const fetchReports = async () => {
			try {
				setIsReportListLoading(true);
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
						};
					})
					.sort((a, b) => b.created_at.localeCompare(a.created_at));
				setReports(updatedData);
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

	const handleReportDownload = async (reportId: string) => {
		try {
			setIsReportDownloading(true);
			const response: reportResultDTO =
				await reportsService.getExcelReportResult(
					tenantId,
					companyId,
					reportId
				);
			const df = new dfd.DataFrame(
				response.results.sort((a, b) =>
					a.control_id.localeCompare(b.control_id, undefined, {
						numeric: true,
					})
				)
			);

			const workbook = new ExcelJS.Workbook();
			workbook.creator = "Ryzr";
			workbook.created = new Date();
			const worksheet = workbook.addWorksheet("Evaluation Report");

			const headerRow = worksheet.addRow(df.columns);
			headerRow.eachCell((cell, index) => {
				cell.value = formatHeaderCells(cell.value.toString());
				cell.font = {
					bold: true,
					color: {
						argb: "FFFFFFFF",
					},
					size: 12,
					name: "SF Pro Display Regular",
				};
				cell.fill = {
					type: "pattern",
					pattern: "solid",
					fgColor: {
						argb: "FFB05AEF",
					},
				};
				cell.alignment = {
					vertical: "top",
				};
			});

			const jsonData = dfd.toJSON(df) as Array<Record<string, any>>;

			//Adds and formats data rows
			jsonData.forEach((record) => {
				const row = worksheet.addRow(Object.values(record));

				row.eachCell((cell, index) => {
					if (index === 1) {
						const originalValue = cell.value
							? cell.value.toString()
							: "";

						cell.value = originalValue.slice(2);
					}

					cell.font = {
						size: 12,
						name: "SF Pro Display Regular",
						color: {
							argb: "FF000000",
						},
					};
					cell.alignment = {
						vertical: "top",
						wrapText: true,
					};
				});
			});

			worksheet.columns.forEach((columns, index) => {
				if (index <= 2) {
					columns.width = 25;
				} else {
					columns.width = 50;
				}
				columns.border = {
					top: {
						style: "thin",
					},
					bottom: {
						style: "thin",
					},
					left: {
						style: "thin",
					},
					right: {
						style: "thin",
					},
				};
			});

			const buffer = await workbook.xlsx.writeBuffer();
			const blob = new Blob([buffer], {
				type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			});
			FileSaver.saveAs(blob, "report.xlsx");
		} catch {
			toast({
				title: "Error",
				description: `Failed to download report. Please try again later!`,
				variant: "destructive",
			});
		} finally {
			setIsReportDownloading(false);
		}
	};

	return (
		<div className="max-w-7xl w-full">
			<div className="w-full px-4">
				<div className="grid gap-2">
					<div className="text-5xl font-semibold text-zinc-400/85 tracking-wide">
						Generated reports
					</div>
					<div className="text-lg text-zinc-400/75">
						Your reports will appear in this section once they are
						generated.
					</div>
				</div>
			</div>
			<section
				className={cn(
					"flex items-center w-full bg-black text-white mt-8 pt-4",
					className
				)}
			>
				<GenericDataTable
					columns={reportColumns}
					data={reports}
					isLoading={isReportListLoading}
					filterKey="reportName"
					onRowClick={(row) => handleReportDownload(row.report_id)}
					disabledRow={isReportDownloading}
				/>
			</section>
		</div>
	);
}

export default EvaluationReports;
