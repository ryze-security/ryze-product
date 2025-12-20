import * as React from "react";
import {
	ColumnDef,
	flexRender,
	SortingState,
	getSortedRowModel,
	getCoreRowModel,
	getPaginationRowModel,
	getFilteredRowModel,
	useReactTable,
	PaginationState,
} from "@tanstack/react-table";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { RoundSpinner } from "./ui/spinner";
import { Progress } from "./ui/progress";
import { cn } from "@/lib/utils";
import { FileSpreadsheet, FileText } from "lucide-react";
import { createReportDTO, createStartReportResponseDTO, reportResultDTO, startReportDTO } from "@/models/reports/ExcelDTOs";
import { useAppSelector } from "@/store/hooks";
import reportsService from "@/services/reportsServices";
import { useToast } from "@/hooks/use-toast";
import * as dfd from "danfojs";
import * as ExcelJS from "exceljs";
import * as FileSaver from "file-saver";
import { createRichTextFromMarkdown } from "@/utils/markdownExcel";
import { ExecutiveSummaryDTO, ExecutiveSummaryResponseDTO } from "@/models/reports/ExecutiveSummaryDTO";
import ExecutionSummary from "./evaluation_details/ExecutionSummary";


interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	filterKey: keyof TData;
	rowIdKey?: (keyof TData)[];
	rowLinkPrefix?: string;
	isLoading?: boolean;
	onRowClick?: (row: TData) => void;
	disabledRow?: boolean;
	pageSize?: number;
	clickableRow?: boolean;
	downloadButton?: boolean;
	reportsActionsData?: {
		companyId: string;
		companyName: string;
		tenantId: string;
		evalId: string;
	}

	// External control props
	externalFilter?: string;
	setExternalFilter?: (value: string) => void;
	externalSorting?: SortingState;
	setExternalSorting?: (value: SortingState) => void;
	externalPagination?: PaginationState;
	setExternalPagination?: (value: PaginationState) => void;
	externalSearch?: boolean;
}

export function GenericDataTable<TData, TValue>({
	columns,
	data,
	filterKey,
	rowIdKey = [],
	rowLinkPrefix = "#",
	isLoading = false,
	onRowClick,
	disabledRow = false,
	pageSize = 10,
	clickableRow = true,
	downloadButton = false,
	reportsActionsData,

	// External control props
	externalFilter,
	setExternalFilter,
	externalSorting,
	setExternalSorting,
	externalPagination,
	setExternalPagination,
	externalSearch = false,
}: DataTableProps<TData, TValue>) {
	const [internalFilter, setInternalFilter] = React.useState("");
	const [internalSorting, setInternalSorting] = React.useState<SortingState>([]);
	const navigate = useNavigate();
	const [internalPagination, setInternalPagination] = React.useState({
		pageIndex: 0,
		pageSize: pageSize,
	});

	// Use external state if provided, otherwise use internal state
	const filter = externalSearch ? externalFilter || "" : internalFilter;
	const setFilter = externalSearch && setExternalFilter ? setExternalFilter : setInternalFilter;

	const sorting = externalSorting !== undefined ? externalSorting : internalSorting;
	const setSorting = setExternalSorting || setInternalSorting;

	const pagination = externalPagination !== undefined ? externalPagination : internalPagination;
	const setPagination = setExternalPagination || setInternalPagination;

	// States for special functions
	const userData = useAppSelector((state) => state.appUser);
	const [isReportGenerating, setIsReportGenerating] = React.useState(false);
	const [generatingExecutionSummary, setGeneratingExecutionSummary] = React.useState<string[]>([]);
	const [downloadingReports, setDownloadingReports] = React.useState<string[]>([]);
	const [executionSummaryData, setExecutionSummaryData] = React.useState<ExecutiveSummaryDTO | null>(null);
	const { toast } = useToast();


	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onPaginationChange: setPagination,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			globalFilter: filter,
			sorting,
			pagination,
		},
		onGlobalFilterChange: setFilter,
		globalFilterFn: (row, columnId, filterValue) => {
			const value = row.original[filterKey];
			return value
				?.toString()
				.toLowerCase()
				.includes(filterValue.toLowerCase());
		},
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),

	});

	const handleRowClick = (row: TData) => {
		if (disabledRow) return;
		if (rowIdKey && rowLinkPrefix !== "#") {
			const ids = rowIdKey
				.map((key) => row[key])
				.filter((val) => val !== null);
			if (ids.length === rowIdKey.length) {
				navigate(`${rowLinkPrefix}${ids.join("/")}`, {
					state: { pageData: row },
				});
			}
		} else {
			onRowClick?.(row);
		}
	};

	// Special Functions (to create or delete report)

	// to generate a new excel report
	const generateExcelReport = async () => {
		setIsReportGenerating(true);
		const reportData: createReportDTO = {
			tenant_id: reportsActionsData.tenantId,
			company_id: reportsActionsData.companyId,
			evaluation_id: reportsActionsData.evalId,
			report_type: "Observations",
			created_by: `${userData.first_name} ${userData.last_name}`,
		};

		try {
			const response: createStartReportResponseDTO =
				await reportsService.createExcelReport(reportData);
			if (response.report_id) {
				const startReportBody: startReportDTO = {
					tenant_id: reportsActionsData.tenantId,
					company_id: reportsActionsData.companyId,
				};
				try {
					const startResponse = await reportsService.startExcelReport(
						reportsActionsData.tenantId,
						response.report_id,
						startReportBody
					);
					if (startResponse) {
						toast({
							title: `Report Generation Started`,
							description: "Your report will be generated in a few minutes. You will be notified once it's ready. The generated reports can be found under the 'Reports' tab.",
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

	// to download the excel report
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
			setDownloadingReports((prev) => [...prev, reportId]);
			const response: reportResultDTO = await reportsService.getExcelReportResult(
				reportsActionsData.tenantId,
				reportsActionsData.companyId,
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
						name: "Arial",
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
			FileSaver.saveAs(blob, reportsActionsData.companyName + " report.xlsx");
		} catch {
			toast({
				title: "Error",
				description: `Failed to download report. Please try again later!`,
				variant: "destructive",
			});
		} finally {
			setDownloadingReports((prev) => prev.filter((id) => id !== reportId));
		}
	};

	// to download the exec. summary pdf
	const handleGeneratingExecutionSummary = async (reportId: string) => {
		setGeneratingExecutionSummary((prev) => [...prev, reportId]);
		toast({
			title: "Generating Execution Summary",
			description: "Your execution summary is being generated. This may take a few seconds — the PDF will automatically download once it's ready.",
			variant: "default",
			className: "bg-green-ryzr",
		});

		const maxAttempts = 5;
		const pollingInterval = 10000;
		let success = false;

		for (let attempt = 0; attempt < maxAttempts; attempt++) {
			try {
				const response: ExecutiveSummaryResponseDTO = await reportsService.getExecutiveSummaryData(
					userData.tenant_id,
					reportsActionsData.companyId,
					reportsActionsData.evalId,
					reportId
				);

				if (response.status === "ready") {
					setExecutionSummaryData(response.data);
					success = true;
					break;
				}

				if (attempt < maxAttempts - 1) {
					await new Promise(resolve => setTimeout(resolve, pollingInterval));
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
				description: "Execution summary generation is taking longer than expected. Please try again later.",
				variant: "destructive",
			});
		}

		setGeneratingExecutionSummary((prev) => prev.filter((id) => id !== reportId))
	}


	return (
		<div className="space-y-4 max-w-7xl w-full">
			{!externalSearch && (
				<div className="flex justify-between">
					<Input
						placeholder="Search..."
						value={filter}
						onChange={(e) => setFilter(e.target.value)}
						className="max-w-sm text-xl bg-[#242424] text-white border-zinc-700 focus-visible:ring-zinc-700"
					/>

					<Button
						variant="primary"
						onClick={generateExcelReport}
						disabled={isReportGenerating}
						className="max-w-sm text-black">
						{isReportGenerating ? (
							<>
								<RoundSpinner color="black" />
								Generating...
							</>
						) : (
							"Generate a new report"
						)}
					</Button>
				</div>
			)}
			<div className="rounded-md">
				<Table className="rounded-md bg-zinc-900">
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow
								key={headerGroup.id}
								className="bg-[#1a1a1a] hover:bg-[#1a1a1a] transition-opacity"
							>
								{headerGroup.headers.map((header, index) => (
									<TableHead
										key={header.id}
										className={`text-white text-base bg-[#1a1a1a] ${index === 0 ? "rounded-tl-md" : ""}`}>
										{flexRender(
											header.column.columnDef.header,
											header.getContext()
										)}
									</TableHead>
								))}
								{downloadButton && (
									<>
										<TableHead className="text-center">
											<span className="text-white/80 text-sm font-medium">Excel Report</span>
										</TableHead>
										<TableHead className="text-center rounded-tr-md">
											<span className="text-white/80 text-sm font-medium">Exec. Summary</span>
										</TableHead>
									</>
								)}
							</TableRow>
						))}
					</TableHeader>
					<TableBody className="">
						{table.getRowModel().rows.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									className={cn("relative hover:bg-zinc-800/50 transition text-white/80", disabledRow && "cursor-not-allowed hover:bg-zinc-900")}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{typeof cell.getValue() ===
												"string" ? (
												// Truncate long text to 50 words
												<div className="text-wrap">
													{(cell.getValue() as string)
														.split(" ")
														.slice(0, 30)
														.join(" ")}
													{(
														cell.getValue() as string
													).split(" ").length > 30 &&
														"..."}
												</div>
											) : (
												// Render default cell content for other types
												flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)
											)}
										</TableCell>
									))}
									{downloadButton && (
										<>
											<TableCell className="text-center py-3">
												<Button
													onClick={(e) => {
														e.stopPropagation();
														const reportId = (row.original as Record<string, unknown>).report_id as string;
														if (reportId) {
															handleReportDownload(reportId);
														}
													}}
													variant="outline"
													size="sm"
													disabled={downloadingReports.includes((row.original as Record<string, unknown>).report_id as string)}
													className="bg-green-600/80 border-green-500/60 text-green-100 hover:bg-green-500/90 hover:border-green-400/80 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 font-medium backdrop-blur-sm"
													title="Download Excel Report"
												>
													{downloadingReports.includes((row.original as Record<string, unknown>).report_id as string) ? (
														<>
															<RoundSpinner color="white" className="mr-2" />
															<span className="text-xs">Downloading...</span>
														</>
													) : (
														<>
															<FileSpreadsheet className="w-4 h-4 mr-2" />
															<span className="text-xs font-medium">Excel</span>
														</>
													)}
												</Button>
											</TableCell>
											<TableCell className="text-center py-3">
												<Button
													onClick={(e) => {
														e.stopPropagation();
														const reportId = (row.original as Record<string, unknown>).report_id as string;
														handleGeneratingExecutionSummary(reportId)
													}}
													variant="outline"
													size="sm"
													disabled={generatingExecutionSummary.includes((row.original as Record<string, unknown>).report_id as string)}
													className="bg-violet-600/80 border-violet-500/60 text-violet-100 hover:bg-violet-500/90 hover:border-violet-400/80 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 font-medium backdrop-blur-sm"
													title="Download PDF Executive Summary"
												>
													{generatingExecutionSummary.includes((row.original as Record<string, unknown>).report_id as string) ? (
														<>
															<RoundSpinner color="white" className="mr-2" />
															<span className="text-xs">Generating...</span>
														</>
													) : (
														<>
															<FileText className="w-4 h-4 mr-2" />
															<span className="text-xs font-medium">PDF</span>
														</>
													)}
												</Button>
											</TableCell>
										</>
									)}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="text-center"
								>
									{isLoading ? (
										<div className="flex justify-center items-center h-24">
											<RoundSpinner />
										</div>
									) : (
										<div className="text-zinc-400 py-4">No results found.</div>
									)}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex justify-between items-center">
				<div className="text-sm text-muted-foreground">
					Page {table.getState().pagination.pageIndex + 1} of{" "}
					{table.getPageCount()}
				</div>
				{table.getPageCount() > 1 && (
					<div className="space-x-2">
						{table.getState().pagination.pageIndex !== 0 && (
							<Button
								variant="outline"
								size="sm"
								onClick={() => table.previousPage()}
								disabled={!table.getCanPreviousPage()}
							>
								Previous
							</Button>
						)}
						<Button
							variant="primary"
							size="sm"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							Next
						</Button>
					</div>
				)}
			</div>

			<ExecutionSummary data={executionSummaryData} />
		</div >
	);
}
