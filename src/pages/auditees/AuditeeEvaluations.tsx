import { AlertDialogBox } from "@/components/AlertDialogBox";
import PageHeader from "@/components/PageHeader";
import { ProgressBarDataTable } from "@/components/ProgressBarDataTable";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RoundSpinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { CompanyListDto } from "@/models/company/companyDTOs";
import {
	Evaluation,
	evaluationStatusDTO,
	listEvaluationsDTO,
} from "@/models/evaluation/EvaluationDTOs";
import {
	reportResultDTO,
	reportResultListDTO,
} from "@/models/reports/ExcelDTOs";
import companyService from "@/services/companyServices";
import evaluationService, {
	AdaptivePolling,
	EvaluationStatusService,
} from "@/services/evaluationServices";
import reportsService from "@/services/reportsServices";
import { useAppSelector } from "@/store/hooks";
import { ColumnDef } from "@tanstack/react-table";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as dfd from "danfojs";
import * as ExcelJS from "exceljs";
import * as FileSaver from "file-saver";
import { Progress } from "@/components/ui/progress";
import { GenericDataTable } from "@/components/GenericDataTable";
import { ArrowDown01, ArrowDownAZ, ArrowUp10, ArrowUpDown, ArrowUpZA, Filter, MoreHorizontal } from "lucide-react";
import { createRichTextFromMarkdown } from "@/utils/markdownExcel";

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

function AuditeeEvaluations() {
	const userData = useAppSelector((state) => state.appUser);
	const { toast } = useToast();
	const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
	const { auditeeId } = useParams();
	const navigate = useNavigate();
	const [reportDialogOpen, setReportDialogOpen] = useState<boolean>(false);
	const [auditeeName, setAuditeeName] = useState<string>();
	const [evaluations, setEvaluations] = useState<listEvaluationsDTO | null>({
		evaluations: [] as Evaluation[],
		total_count: 0,
	});
	const [isEvalLoading, setIsEvalLoading] = useState<boolean>(false);
	const [reportList, setReportList] = useState<ReportList[]>(null);
	const [isReportListLoading, setIsReportListLoading] =
		useState<boolean>(false);
	const [isAuditeeLoading, setIsAuditeeLoading] = useState<boolean>(true);
	const [isReportGenerating, setIsReportGenerating] =
		useState<boolean>(false);

	const activePollers = useRef(new Map<string, AdaptivePolling>());
	const statusService = useRef(new EvaluationStatusService());

	//method to update status of evaluations in state
	const handleStatusUpdate = useCallback((newStatus: evaluationStatusDTO) => {
		setEvaluations((prev) => {
			if (!prev) return prev;
			const updatedEvals = prev.evaluations.map((ev) => {
				if (ev.eval_id === newStatus.eval_id) {
					return {
						...ev,
						processing_status: newStatus.status,
						overall_score:
							newStatus.status === "completed"
								? parseInt(
										newStatus.progress.score_percentage.toFixed(
											2
										)
								  )
								: 0,
					};
				}
				return ev;
			});
			return {
				...prev,
				evaluations: updatedEvals,
			};
		});
	}, []);

	//Polling mechanism
	useEffect(() => {
		const pollers = activePollers.current;
		const currentStatusService = statusService.current;

		const evaluationToPoll = evaluations?.evaluations.filter((ev) =>
			[
				"pending",
				"in_progress",
				"failed",
				"processing_missing_elements",
			].includes(ev.processing_status)
		);

		evaluationToPoll.forEach((ev) => {
			if (!pollers.has(ev.eval_id)) {
				const poller = new AdaptivePolling();

				const fetchStatus = () =>
					currentStatusService.getStatus(
						userData.tenant_id,
						ev.tg_company_id,
						ev.eval_id
					);

				const onComplete = () => {
					pollers.delete(ev.eval_id);
				};

				poller.startPolling(
					fetchStatus,
					handleStatusUpdate,
					onComplete
				);
				pollers.set(ev.eval_id, poller);
			}
		});

		pollers.forEach((poller, evalId) => {
			const stillNeedsPolling = evaluations.evaluations.some(
				(ev) =>
					ev.eval_id === evalId &&
					[
						"pending",
						"in_progress",
						"failed",
						"processing_missing_elements",
					].includes(ev.processing_status)
			);
			if (!stillNeedsPolling) {
				poller.stopPolling();
				pollers.delete(evalId);
			}
		});
	}, [evaluations.evaluations, userData.tenant_id, handleStatusUpdate]);

	//cleanup pollers on unmount
	useEffect(() => {
		const pollers = activePollers.current;
		return () => {
			pollers.forEach((poller) => poller.stopPolling());
		};
	}, []);

	const isLoading = isEvalLoading || isAuditeeLoading;

	const columns: ColumnDef<Evaluation>[] = [
		{
			accessorKey: "tg_company_display_name",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={(e) => {
							e.stopPropagation();
							if (!column.getIsSorted()) {
								column.toggleSorting(false); // Ascending
							} else if (column.getIsSorted() === "asc") {
								column.toggleSorting(true); // Descending
							} else {
								column.clearSorting(); // Clear sorting
							}
						}}
						className="px-0 hover:bg-transparent hover:text-white"
					>
						Auditee
						{column.getIsSorted() === "asc" ? (
							<ArrowDownAZ className="ml-2 h-4 w-4 text-violet-400" />
						) : column.getIsSorted() === "desc" ? (
							<ArrowUpZA className="ml-2 h-4 w-4 text-violet-400" />
						) : (
							<ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
						)}
					</Button>
				);
			},
			sortingFn: "text",
		},
		{
			accessorKey: "collection_display_name",
			header: ({ column }) => {
				// Get unique control names for filter options
				const controlNames = [
					...new Set(
						evaluations?.evaluations.map(
							(evalItem) => evalItem.collection_display_name
						) || []
					),
				].filter(Boolean) as string[];

				const currentFilters =
					(column.getFilterValue() as string[]) || [];
				const isFilterActive = currentFilters.length > 0;

				return (
					<DropdownMenu>
						<DropdownMenuTrigger className="group p-1.5 -mx-1.5 rounded-md hover:bg-white/10 transition-colors text-base flex items-center gap-2">
							Framework
							<div className="relative">
								<Filter
									className={`h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity ${
										isFilterActive ? "text-violet-ryzr" : ""
									}`}
								/>
								{isFilterActive && (
									<span className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center text-xs font-medium rounded-full bg-violet-ryzr text-white">
										{currentFilters.length}
									</span>
								)}
							</div>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="min-w-[220px] bg-zinc-800 border-zinc-700 max-h-96 overflow-hidden flex flex-col">
							<div className="px-3 py-2 border-b border-zinc-700">
								<div className="flex justify-between items-center">
									<DropdownMenuLabel className="text-white/80 font-medium p-0">
										Filter by Framework
									</DropdownMenuLabel>
									<Button
										variant="ghost"
										size="sm"
										onClick={(e) => {
											e.stopPropagation();
											column.setFilterValue([]);
										}}
										className={`ml-3 h-6 text-xs text-violet-ryzr hover:text-white hover:bg-white/10 transition-opacity ${
											!isFilterActive
												? "opacity-0 pointer-events-none"
												: ""
										}`}
									>
										Clear all
									</Button>
								</div>
							</div>
							<div className="overflow-y-auto max-h-[300px] p-1">
								{controlNames.map((controlName) => {
									const isSelected =
										currentFilters.includes(controlName);
									return (
										<div
											key={controlName}
											onClick={(e) => {
												e.stopPropagation();
												const newFilters = isSelected
													? currentFilters.filter(
															(f) =>
																f !==
																controlName
													  )
													: [
															...currentFilters,
															controlName,
													  ];
												column.setFilterValue(
													newFilters.length
														? newFilters
														: undefined
												);
											}}
											className="flex items-center px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-white/10 text-white/90 group"
										>
											<div
												className={`h-4 w-4 rounded border ${
													isSelected
														? "bg-violet-ryzr border-violet-ryzr flex items-center justify-center"
														: "border-zinc-600"
												} mr-3`}
											>
												{isSelected && (
													<svg
														className="h-3 w-3 text-white"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M5 13l4 4L19 7"
														/>
													</svg>
												)}
											</div>
											<span
												className={
													isSelected
														? "text-white"
														: "text-white/90"
												}
											>
												{controlName}
											</span>
										</div>
									);
								})}
							</div>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
			filterFn: (row, columnId, filterValue) => {
				if (!filterValue || filterValue.length === 0) return true;
				const value = row.getValue(columnId) as string;
				return filterValue.includes(value);
			},
		},
		{
			accessorKey: "overall_score",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={(e) => {
							e.stopPropagation();
							if (!column.getIsSorted()) {
								column.toggleSorting(false); // Ascending
							} else if (column.getIsSorted() === "asc") {
								column.toggleSorting(true); // Descending
							} else {
								column.clearSorting(); // Clear sorting
							}
						}}
						className="px-0 hover:bg-transparent hover:text-white"
					>
						Evaluation Score
						{column.getIsSorted() === "asc" ? (
							<ArrowDown01 className="ml-2 h-4 w-4 text-violet-400" />
						) : column.getIsSorted() === "desc" ? (
							<ArrowUp10 className="ml-2 h-4 w-4 text-violet-400" />
						) : (
							<ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
						)}
					</Button>
				);
			},
			cell: ({ row }) => {
				const score: number = row.getValue("overall_score");
				const updatedScore =
					score == null || score == undefined || Number.isNaN(score)
						? 0
						: score;
				return (
					<div>
						{row.original.processing_status === "in_progress" ||
						row.original.processing_status ===
							"processing_missing_elements" ? (
							<div className="flex justify-center max-w-28">
								<RoundSpinner />
							</div>
						) : (
							<div className="relative max-w-28">
								<Progress
									value={updatedScore}
									className="h-6 bg-neutral-700 rounded-full"
									indicatorColor="bg-violet-ryzr"
								/>
								<div className="absolute inset-0 flex justify-center items-center text-white text-xs font-semibold">
									{updatedScore}%
								</div>
							</div>
						)}
					</div>
				);
			},
		},
		{
			accessorKey: "processing_status",
			header: ({ column }) => {
				const statusFilters = [
					{
						value: "in_progress",
						label: "In Progress",
						color: "bg-yellow-600",
					},
					{
						value: "completed",
						label: "Completed",
						color: "bg-green-ryzr",
					},
					{
						value: "cancelled",
						label: "Cancelled",
						color: "bg-red-ryzr",
					},
					{ value: "failed", label: "Failed", color: "bg-red-ryzr" },
				];

				const currentFilters =
					(column.getFilterValue() as string[]) || [];
				const isFilterActive = currentFilters.length > 0;

				return (
					<DropdownMenu>
						<DropdownMenuTrigger className="group p-1.5 -mx-1.5 rounded-md hover:bg-white/10 transition-colors text-base flex items-center gap-2">
							Status
							<div className="relative">
								<Filter
									className={`h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity ${
										isFilterActive ? "text-violet-ryzr" : ""
									}`}
								/>
								{isFilterActive && (
									<span className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center text-xs font-medium rounded-full bg-violet-ryzr text-white">
										{currentFilters.length}
									</span>
								)}
							</div>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="min-w-[220px] bg-zinc-800 border-zinc-700 max-h-96 overflow-hidden flex flex-col">
							<div className="px-3 py-2 border-b border-zinc-700">
								<div className="flex justify-between items-center">
									<DropdownMenuLabel className="text-white/80 font-medium p-0">
										Filter by Status
									</DropdownMenuLabel>
									<Button
										variant="ghost"
										size="sm"
										onClick={(e) => {
											e.stopPropagation();
											column.setFilterValue([]);
										}}
										className={`ml-3 h-6 text-xs text-violet-ryzr hover:text-white hover:bg-white/10 transition-opacity ${
											!isFilterActive
												? "opacity-0 pointer-events-none"
												: ""
										}`}
									>
										Clear all
									</Button>
								</div>
							</div>
							<div className="overflow-y-auto max-h-[300px] p-1">
								{statusFilters.map((status) => {
									const isSelected = currentFilters.includes(
										status.value
									);
									return (
										<div
											key={status.value}
											onClick={(e) => {
												e.stopPropagation();
												const newFilters = isSelected
													? currentFilters.filter(
															(f) =>
																f !==
																status.value
													  )
													: [
															...currentFilters,
															status.value,
													  ];
												column.setFilterValue(
													newFilters.length
														? newFilters
														: undefined
												);
											}}
											className="flex items-center px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-white/10 text-white/90 group"
										>
											<div
												className={`h-4 w-4 rounded border ${
													isSelected
														? "bg-violet-ryzr border-violet-ryzr flex items-center justify-center"
														: "border-zinc-600"
												} mr-3`}
											>
												{isSelected && (
													<svg
														className="h-3 w-3 text-white"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M5 13l4 4L19 7"
														/>
													</svg>
												)}
											</div>
											<div className="flex items-center gap-2">
												<span
													className={`w-2 h-2 rounded-full ${status.color}`}
												></span>
												<span
													className={
														isSelected
															? "text-white"
															: "text-white/90"
													}
												>
													{status.label}
												</span>
											</div>
										</div>
									);
								})}
							</div>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
			filterFn: (row, columnId, filterValue) => {
				if (!filterValue || filterValue.length === 0) return true;
				const value = row.getValue(columnId) as string;
				return filterValue.includes(value);
			},
			cell: ({ row }) => {
				const evals: string = row.getValue("processing_status");
				return (
					<span
						className={`px-2 py-1 rounded ${
							evals === "completed"
								? "bg-green-ryzr"
								: evals === "failed" || evals === "cancelled"
								? "bg-red-ryzr"
								: "bg-yellow-600"
						}`}
					>
						{evals.charAt(0).toUpperCase() +
							evals.slice(1).replace("_", " ")}
					</span>
				);
			},
		},
		{
			accessorKey: "created_at",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={(e) => {
							e.stopPropagation();
							if (!column.getIsSorted()) {
								column.toggleSorting(false); // Ascending
							} else if (column.getIsSorted() === "asc") {
								column.toggleSorting(true); // Descending
							} else {
								column.clearSorting(); // Clear sorting
							}
						}}
						className="px-0 hover:bg-transparent hover:text-white"
					>
						Conducted On
						{column.getIsSorted() === "asc" ? (
							<ArrowDown01 className="ml-2 h-4 w-4 text-violet-400" />
						) : column.getIsSorted() === "desc" ? (
							<ArrowUp10 className="ml-2 h-4 w-4 text-violet-400" />
						) : (
							<ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
						)}
					</Button>
				);
			},
		},
		{
			accessorKey: "created_by",
			header: "Created By",
		},
		{
			id: "reportNumber",
			header: () => {
				return <div className="text-center">Reports Generated</div>;
			},
			cell: ({ row }) => {
				const evaluation = row.original;
				return (
					<div className="flex justify-center">
						<Button
							variant="outline"
							className="p-4 hover:scale-105 hover:bg-violet-light-ryzr/70 duration-200 transition-all "
							disabled={evaluation.num_reports === 0}
							onSelect={(e) => e.preventDefault()}
							onClick={async (e) => {
								e.stopPropagation();
								setReportDialogOpen(true);
								try {
									setIsReportListLoading(true);
									const response : reportResultListDTO =
										await reportsService.getReportList(
											userData.tenant_id,
											evaluation.tg_company_id,
											evaluation.eval_id
										);
									if (response.total_count === 0) {
										toast({
											title: "No reports found",
											description:
												"No reports have been generated for this evaluation.",
											variant: "default",
										});
										setReportDialogOpen(false);
									} else {
										const updatedData = [
											...response.reports,
										]
											.map((item, index) => {
												return {
													...item,
													sNo: index + 1,
													created_at: new Date(
														item.created_at
													).toLocaleDateString(),
													reportName: `Report_${
														index + 1
													}`,
													report_type:
														item.report_type ===
														"Observations"
															? "Gap Analysis Report"
															: item.report_type,
												};
											})
											.sort((a, b) =>
												b.created_at.localeCompare(
													a.created_at
												)
											);
										setReportList(updatedData);
									}
								} catch (error) {
									toast({
										title: "Error",
										description: `Failed to fetch reports. Please try again later!`,
										variant: "destructive",
									});
								} finally {
									setIsReportListLoading(false);
								}
							}}
						>
							{evaluation.num_reports}
						</Button>
					</div>
				);
			},
		},
		{
			id: "actions",
			enableHiding: false,
			cell: ({ row }) => {
				const evaluation = row.original;
				const isInProgress =
					evaluation.processing_status === "in_progress" ||
					evaluation.processing_status === "pending" ||
					evaluation.processing_status ===
						"processing_missing_elements";

				const performDelete = async () => {
					try {
						const response =
							await evaluationService.evaluationService.deleteEvaluation(
								userData.tenant_id,
								evaluation.tg_company_id,
								evaluation.eval_id
							);
						if (response.status === "success") {
							setRefreshTrigger((prev) => prev + 1);
							toast({
								title: "Report Deleted!",
								description:
									"The report has been deleted successfully",
							});
						}
					} catch (error) {
						toast({
							title: "Error",
							description: `An error occurred while deleting the evaluation. Please try again later!`,
							variant: "destructive",
						});
					}
				};

				const cancelEvaluation = async () => {
					try {
						const response =
							await evaluationService.evaluationService.cancelEvaluation(
								userData.tenant_id,
								evaluation.tg_company_id,
								evaluation.eval_id
							);
						if (response) {
							setRefreshTrigger((prev) => prev + 1);
							toast({
								title: "Evaluation Cancelled!",
								description:
									"The evaluation has been cancelled successfully",
							});
						}
					} catch {
						toast({
							title: "Error",
							description: `An error occurred while cancelling this evaluation. Please try again later!`,
							variant: "destructive",
						});
					}
				};
				return (
					<DropdownMenu>
						<DropdownMenuTrigger
							asChild
							onClick={(e) => e.stopPropagation()} // Prevent row click
						>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="end"
							onClick={(e) => e.stopPropagation()} // Prevent row click
						>
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							{isInProgress ? (
								<AlertDialogBox
									trigger={
										<DropdownMenuItem
											onSelect={(e) => e.preventDefault()}
											onClick={(e) => e.stopPropagation()}
											className="text-yellow-600 focus:text-white focus:bg-yellow-700 hover:bg-yellow-700"
										>
											Cancel Evaluation
										</DropdownMenuItem>
									}
									title="Cancel Evaluation?"
									subheading="This action will stop the current evaluation process and cannot be restarted again. Are you sure you want to continue?"
									actionLabel="Confirm"
									onAction={cancelEvaluation}
									confirmButtonClassName="bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-600"
								/>
							) : (
								<AlertDialogBox
									trigger={
										<DropdownMenuItem
											onSelect={(e) => e.preventDefault()}
											onClick={(e) => e.stopPropagation()}
											className="text-rose-600 focus:text-white focus:bg-rose-600"
										>
											Delete Evaluation
										</DropdownMenuItem>
									}
									title="Are You Sure?"
									subheading={`Are you sure you want to delete this evaluation? This action cannot be undone.`}
									actionLabel="Delete"
									onAction={() => {
										performDelete();
									}}
									confirmButtonClassName="bg-rose-600 hover:bg-rose-700 focus:ring-rose-600"
								/>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];

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

	//Effect used to load evaluations for the auditee
	useEffect(() => {
		async function fetchEvaluations() {
			setIsEvalLoading(true);
			try {
				const response: listEvaluationsDTO =
					await evaluationService.evaluationService.getEvaluationsByCompanyId(
						userData.tenant_id,
						auditeeId
					);
				if (response.total_count > 0) {
					response.evaluations = response.evaluations.map(
						(evaluation: Evaluation) => {
							return {
								...evaluation,
								overall_score:
									evaluation.processing_status === "pending"
										? 0
										: Math.round(
												Number.parseFloat(
													evaluation.overall_score?.toFixed(
														2
													)
												)
										  ),
								created_at: new Date(
									evaluation.created_at
								).toLocaleDateString(),
								collection_created_at: new Date(
									evaluation.collection_created_at
								).toLocaleDateString(),
								collection_edited_on: new Date(
									evaluation.collection_edited_on
								).toLocaleDateString(),
							};
						}
					);
				}
				setEvaluations(response);
			} catch (error) {
				toast({
					title: "Error",
					description: `Failed to fetch the evaluations. Please try again later!`,
					variant: "destructive",
				});
			} finally {
				setIsEvalLoading(false);
			}
		}

		fetchEvaluations();
	}, [refreshTrigger, auditeeId, userData.tenant_id]);

	//Effect to fetch auditee name
	useEffect(() => {
		const fetchAuditeeName = async () => {
			setIsAuditeeLoading(true);
			try {
				const response: CompanyListDto =
					await companyService.getCompanyByCompanyId(
						userData.tenant_id,
						auditeeId
					);
				if (response && response.tg_company_display_name) {
					setAuditeeName(response.tg_company_display_name);
				}
			} catch (error) {
				toast({
					title: "Error",
					description: `Failed to fetch auditee details. Please try again later!`,
					variant: "destructive",
				});
				navigate("/auditee/edit/" + auditeeId);
			} finally {
				setIsAuditeeLoading(false);
			}
		};

		fetchAuditeeName();
	}, [auditeeId, userData.tenant_id]);

	const formatHeaderCells = (text: string): string => {
		return text
			.replace(/_/g, " ")
			.split(" ")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	};

	const handleReportDownload = async (reportId: string) => {
		try {
			setIsReportGenerating(true);
			const response: reportResultDTO =
				await reportsService.getExcelReportResult(
					userData.tenant_id,
					auditeeId,
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
			FileSaver.saveAs(blob, auditeeName + " report.xlsx");
		} catch {
			toast({
				title: "Error",
				description: `Failed to download report. Please try again later!`,
				variant: "destructive",
			});
		} finally {
			setIsReportGenerating(false);
		}
	};

	return (
		<div className="min-h-screen font-roboto bg-black text-white p-6">
			<section className="flex justify-center items-center w-full bg-black text-white pb-0 pt-10 px-3 sm:px-6 md:px-4 lg:px-16">
				<PageHeader
					heading={
						<div className="flex items-center gap-2">
							Manage Evaluations:{" "}
							{isAuditeeLoading ? <RoundSpinner /> : auditeeName}
						</div>
					}
					subtitle="Browse through evaluations related to this auditee. You can add, view, and delete evaluations as needed. Also, reports can be downloaded for each evaluation."
					buttonText="Add"
					variant="add"
					isLoading={isLoading}
					buttonUrl="/new-evaluation"
				>
					<Button
						variant="default"
						disabled={isLoading}
						className={`bg-zinc-700 hover:bg-zinc-800 rounded-2xl transition-colors text-white font-bold text-md`}
						onClick={() => navigate("/auditee/edit/" + auditeeId)}
					>
						{isLoading ? <RoundSpinner /> : "Back"}
					</Button>
				</PageHeader>
			</section>
			<section className="flex items-center w-full bg-black text-white  pt-10 px-3 sm:px-6 md:px-4  lg:px-16">
				<div className=" w-full">
					<ProgressBarDataTable
						columns={columns}
						externalSearch={true}
						data={evaluations.evaluations}
						filterKey="tg_company_display_name"
						rowIdKey={["tg_company_id", "eval_id"]}
						rowLinkPrefix="/evaluation/"
						isLoading={isEvalLoading}
						isRowDisabled={(row) =>
							row.processing_status !== "completed"
						}
					/>
				</div>
				<Dialog
					open={reportDialogOpen}
					onOpenChange={(isOpen) => {
						setReportDialogOpen(isOpen);
						if (!isOpen) {
							setReportList(null);
						}
					}}
				>
					<DialogContent className="flex flex-col max-h-[90vh] h-fit scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-800 lg:max-w-2xl">
						<DialogHeader className="flex-shrink-0 border-b pb-4 text-left">
							<DialogTitle>
								Download Reports: {auditeeName}
							</DialogTitle>
							<DialogDescription className="text-wrap">
								Here you can download any report you generated
								for this evaluation.
							</DialogDescription>
						</DialogHeader>
						{!reportList ? (
							<RoundSpinner />
						) : (
							<div className="flex-1 overflow-y-auto mt-4">
								<GenericDataTable
									columns={reportColumns}
									data={reportList}
									isLoading={isReportListLoading}
									filterKey="reportName"
									onRowClick={(row) =>
										handleReportDownload(row.report_id)
									}
									disabledRow={isReportGenerating}
									pageSize={5}
								/>
							</div>
						)}
					</DialogContent>
				</Dialog>
			</section>
		</div>
	);
}

export default AuditeeEvaluations;
