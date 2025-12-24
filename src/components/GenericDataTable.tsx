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
import { useReportGeneration } from "@/hooks/useReportGeneration";
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

	// External control props for generate report button
	externalGenerateReport?: boolean;
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
	reportsActionsData,

	// External control props
	externalFilter,
	setExternalFilter,
	externalSorting,
	setExternalSorting,
	externalPagination,
	setExternalPagination,
	externalSearch = false,
	externalGenerateReport = false,
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

	// Use the enhanced hook for all report generation functionality
	const {
		generateExcelReport,
		downloadExcelReport,
		generateExecutionSummaryPDF,
		isReportGenerating,
		downloadingReports,
		generatingExecutionSummary,
		executionSummaryData,
		setExecutionSummaryData,
	} = useReportGeneration();

	React.useEffect(() => {
		console.log(reportsActionsData)
	}, [reportsActionsData])

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

					{reportsActionsData && !externalGenerateReport &&
						<Button
							variant="primary"
							onClick={() => generateExcelReport({
								tenantId: reportsActionsData.tenantId,
								companyId: reportsActionsData.companyId,
								evaluationId: reportsActionsData.evalId
							})}
							disabled={isReportGenerating}
							className="max-w-sm text-black">
							{isReportGenerating ? (
								<>
									<RoundSpinner color="black" />
									Generating...
								</>
							) : (
								"Generate new report"
							)}
						</Button>
					}
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
								{reportsActionsData && (
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
									{reportsActionsData && (
										<>
											<TableCell className="text-center py-3">
												<Button
													onClick={(e) => {
														e.stopPropagation();
														const reportId = (row.original as Record<string, unknown>).report_id as string;
														if (reportId) {
															downloadExcelReport(reportId, {
																tenantId: reportsActionsData.tenantId,
																companyId: reportsActionsData.companyId,
																evaluationId: reportsActionsData.evalId,
																companyName: reportsActionsData.companyName,
															});
														}
													}}
													variant="outline"
													size="sm"
													disabled={downloadingReports.includes((row.original as Record<string, unknown>).report_id as string)}
													className="text-white transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 font-medium backdrop-blur-sm"
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
														generateExecutionSummaryPDF(reportId, {
															tenantId: reportsActionsData.tenantId,
															companyId: reportsActionsData.companyId,
															evaluationId: reportsActionsData.evalId,
														})
													}}
													variant="outline"
													size="sm"
													disabled={generatingExecutionSummary.includes((row.original as Record<string, unknown>).report_id as string)}
													className="text-white transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 font-medium backdrop-blur-sm"
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
