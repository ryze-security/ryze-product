import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAppSelector } from "@/store/hooks";
import {
    createReportDTO,
    createStartReportResponseDTO,
    startReportDTO,
    reportResultDTO,
} from "@/models/reports/ExcelDTOs";
import { ExecutiveSummaryResponseDTO } from "@/models/reports/ExecutiveSummaryDTO";
import reportsService from "@/services/reportsServices";
import * as dfd from "danfojs";
import * as ExcelJS from "exceljs";
import * as FileSaver from "file-saver";
import { createRichTextFromMarkdown } from "@/utils/markdownExcel";

interface ReportGenerationParams {
    tenantId: string;
    companyId: string;
    evaluationId: string;
    companyName?: string;
}

export function useReportGeneration() {
    const [isReportGenerating, setIsReportGenerating] = useState(false);
    const [downloadingReports, setDownloadingReports] = useState<string[]>([]);
    const [generatingExecutionSummary, setGeneratingExecutionSummary] =
        useState<string[]>([]);
    const [executionSummaryData, setExecutionSummaryData] = useState<
        ExecutiveSummaryResponseDTO["data"] | null
    >(null);
    const { toast } = useToast();
    const userData = useAppSelector((state) => state.appUser);

    const generateExcelReport = async ({
        tenantId,
        companyId,
        evaluationId,
    }: ReportGenerationParams) => {
        setIsReportGenerating(true);
        const reportData: createReportDTO = {
            tenant_id: tenantId,
            company_id: companyId,
            evaluation_id: evaluationId,
            report_type: "Observations",
            created_by: `${userData.first_name} ${userData.last_name}`,
        };

        try {
            const response: createStartReportResponseDTO =
                await reportsService.createExcelReport(reportData);
            if (response.report_id) {
                const startReportBody: startReportDTO = {
                    tenant_id: tenantId,
                    company_id: companyId,
                };
                try {
                    const startResponse = await reportsService.startExcelReport(
                        tenantId,
                        response.report_id,
                        startReportBody
                    );
                    if (startResponse) {
                        toast({
                            title: `Report Generation Started`,
                            description:
                                "Your report will be generated in a few minutes. You will be notified once it's ready. The generated reports can be found under the 'Reports' tab.",
                            variant: "default",
                            className: "bg-green-ryzr",
                        });
                    }
                } catch (error) {
                    toast({
                        title: `Error starting report generation`,
                        description: `There was an error while starting the report generation. Please try again later!`,
                        variant: "destructive",
                    });
                }
            }
        } catch (error) {
            toast({
                title: `Error creating report`,
                description: `There was an error while creating the report. Please try again later!`,
                variant: "destructive",
            });
        } finally {
            setIsReportGenerating(false);
        }
    };

    const downloadExcelReport = async (
        reportId: string,
        { tenantId, companyId, companyName }: ReportGenerationParams
    ) => {
        try {
            setDownloadingReports((prev) => [...prev, reportId]);
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

            const formatHeaderCells = (text: string): string => {
                const wordsToRemove = ["display", "name"];
                return text
                    .replace(/_/g, " ")
                    .split(" ")
                    .filter(
                        (word) => !wordsToRemove.includes(word.toLowerCase())
                    )
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ");
            };

            const headerRow = worksheet.addRow(df.columns);
            headerRow.eachCell((cell, index) => {
                cell.value = formatHeaderCells(cell.value.toString());
                cell.font = {
                    bold: true,
                    color: {
                        argb: "FFFFFFFF",
                    },
                    size: 12,
                    name: "Arial",
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

            const jsonData = dfd.toJSON(df) as Array<Record<string, unknown>>;

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
                        name: "Arial",
                        color: {
                            argb: "FF000000",
                        },
                    };
                    cell.alignment = {
                        vertical: "top",
                        wrapText: true,
                    };

                    if (cell.value && cell.value.toString().includes("*")) {
                        cell.value = {
                            richText: createRichTextFromMarkdown(
                                cell.value.toString()
                            ),
                        };
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
            FileSaver.saveAs(blob, `${companyName} report.xlsx`);
        } catch {
            toast({
                title: "Error",
                description: `Failed to download report. Please try again later!`,
                variant: "destructive",
            });
        } finally {
            setDownloadingReports((prev) =>
                prev.filter((id) => id !== reportId)
            );
        }
    };

    const generateExecutionSummaryPDF = async (
        reportId: string,
        { tenantId, companyId, evaluationId }: ReportGenerationParams
    ) => {
        setGeneratingExecutionSummary((prev) => [...prev, reportId]);
        toast({
            title: "Generating Execution Summary",
            description:
                "Your execution summary is being generated. This may take a few seconds — the PDF will automatically download once it's ready.",
            variant: "default",
            className: "bg-green-ryzr",
        });

        const maxAttempts = 5;
        const pollingInterval = 10000;
        let success = false;

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            try {
                const response: ExecutiveSummaryResponseDTO =
                    await reportsService.getExecutiveSummaryData(
                        tenantId,
                        companyId,
                        evaluationId,
                        reportId
                    );

                if (response.status === "ready") {
                    setExecutionSummaryData(response.data);
                    success = true;
                    break;
                }

                if (attempt < maxAttempts - 1) {
                    await new Promise((resolve) =>
                        setTimeout(resolve, pollingInterval)
                    );
                }
            } catch (error) {
                if (attempt === maxAttempts - 1) {
                    console.error(error.response?.data?.message);
                    setExecutionSummaryData(null);
                }
            }
        }

        if (!success) {
            toast({
                title: "Timeout",
                description:
                    "Execution summary generation is taking longer than expected. Please try again later.",
                variant: "destructive",
            });
        }

        setGeneratingExecutionSummary((prev) =>
            prev.filter((id) => id !== reportId)
        );
    };

    return {
        generateExcelReport,
        downloadExcelReport,
        generateExecutionSummaryPDF,
        isReportGenerating,
        downloadingReports,
        generatingExecutionSummary,
        executionSummaryData,
        setExecutionSummaryData,
    };
}
