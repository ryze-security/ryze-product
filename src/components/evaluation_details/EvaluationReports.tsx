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
import { createRichTextFromMarkdown } from "@/utils/markdownExcel";
import companyService from "@/services/companyServices";
import { CompanyListDto } from "@/models/company/companyDTOs";

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

	//Fetches reports list
	useEffect(() => {
		const fetchReports = async () => {
			try {
				setIsReportListLoading(true);
				const companyDataResponse : CompanyListDto = await companyService.getCompanyByCompanyId(tenantId, companyId)
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
            const response: reportResultDTO = await reportsService.getExcelReportResult(
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
                        const originalValue = cell.value ? cell.value.toString() : "";

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

                    if (cell.value && cell.value.toString().includes('*')) {
                        cell.value = { richText: createRichTextFromMarkdown(cell.value.toString()) };
                    }
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
            FileSaver.saveAs(blob, companyData.tg_company_display_name + " report.xlsx");
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
				<GenericDataTable
					columns={reportColumns}
					data={reports}
					isLoading={isReportListLoading}
					filterKey="reportName"
					onRowClick={(row) => handleReportDownload(row.report_id)}
					downloadButton={true}
					disabledRow={isReportDownloading}
				/>
			</section>
		</div>
	);
}

export default EvaluationReports;
