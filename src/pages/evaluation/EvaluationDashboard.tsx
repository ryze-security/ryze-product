import { ProgressBarDataTable } from "@/components/ProgressBarDataTable";
import PageHeader from "@/components/PageHeader";
import { useToast } from "@/hooks/use-toast";
import {
	Evaluation,
	evaluationStatusDTO,
	listEvaluationsDTO,
} from "@/models/evaluation/EvaluationDTOs";
import evaluationService, {
	AdaptivePolling,
	EvaluationStatusService,
} from "@/services/evaluationServices";
import { ColumnDef } from "@tanstack/react-table";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { reportResultDTO } from "@/models/reports/ExcelDTOs";
import reportsService from "@/services/reportsServices";
import { RoundSpinner } from "@/components/ui/spinner";
import * as dfd from "danfojs";
import * as ExcelJS from "exceljs";
import * as FileSaver from "file-saver";
import { useAppSelector } from "@/store/hooks";
import { AlertDialogBox } from "@/components/AlertDialogBox";
import { GenericDataTable } from "@/components/GenericDataTable";
import { Progress } from "@/components/ui/progress";

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

function EvaluationDashboard() {
	const [reportList, setReportList] = React.useState<ReportList[]>([]);
	const { toast } = useToast();
	const userData = useAppSelector((state) => state.appUser);
	const [refreshTrigger, setRefreshTrigger] = React.useState<number>(0);
	const activePollers = useRef(new Map<string, AdaptivePolling>());
	const statusService = useRef(new EvaluationStatusService());
	const [evaluations, setEvaluations] =
		React.useState<listEvaluationsDTO | null>({
			evaluations: [],
			total_count: 0,
		});

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

	const columns: ColumnDef<Evaluation>[] = [
		{
			accessorKey: "tg_company_display_name",
			header: "Auditee Title",
		},
		{
			accessorKey: "collection_display_name",
			header: "Controls",
		},
		{
			accessorKey: "overall_score",
			header: "Evaluation Score",
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
				return (
					<DropdownMenu>
						<DropdownMenuTrigger className="p-0 hover:bg-transparent hover:text-white/70 text-base flex justify-between items-center gap-2">
							Status
							<Ellipsis className="h-4 w-4" />
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuLabel>
								Filter by status
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() =>
									column.setFilterValue("in_progress")
								}
							>
								<span
									className={`px-2 py-1 rounded bg-yellow-600`}
								>
									In Progress
								</span>
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() =>
									column.setFilterValue("completed")
								}
							>
								<span
									className={`px-2 py-1 rounded bg-green-ryzr`}
								>
									Completed
								</span>
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => column.setFilterValue("failed")}
							>
								<span
									className={`px-2 py-1 rounded bg-red-ryzr`}
								>
									Failed
								</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
			cell: ({ row }) => {
				const evals: string = row.getValue("processing_status");
				return (
					<span
						className={`px-2 py-1 rounded ${
							evals === "completed"
								? "bg-green-ryzr"
								: evals === "failed"
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
			header: "Conducted On",
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
									setReportListLoading(true);
									const response =
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
													report_type: item.report_type === "Observations" ? "Gap Analysis Report" : item.report_type,
												};
											})
											.sort((a, b) =>
												b.created_at.localeCompare(
													a.created_at
												)
											);
										setReportList(updatedData);
										setreportCompany({
											id: evaluation.tg_company_id,
											name: evaluation.tg_company_display_name,
										});
									}
								} catch (error) {
									toast({
										title: "Error",
										description: `Failed to fetch reports. Please try again later!`,
										variant: "destructive",
									});
								} finally {
									setReportListLoading(false);
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
									const performDelete = async () => {
										try {
											const response =
												await evaluationService.evaluationService.deleteEvaluation(
													userData.tenant_id,
													evaluation.tg_company_id,
													evaluation.eval_id
												);
											if (response.status === "success") {
												setRefreshTrigger(
													(prev) => prev + 1
												);
												toast({
													title: "Report Deleted!",
													description:
														"The report has been deleted successfully",
													variant: "destructive",
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

									performDelete();
								}}
								confirmButtonClassName="bg-rose-600 hover:bg-rose-700 focus:ring-rose-600"
							/>
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

	const [reportDialogOpen, setReportDialogOpen] = useState<boolean>(false);
	const [reportListLoading, setReportListLoading] = useState<boolean>(false);
	const [reportCompany, setreportCompany] = React.useState<{
		id: string;
		name: string;
	}>({ id: "", name: "" });

	const [isEvalLoading, setIsEvalLoading] = React.useState<boolean>(false);
	const [isReportGenerating, setIsReportGenerating] =
		React.useState<boolean>(false);

	useEffect(() => {
		async function fetchEvaluations() {
			setIsEvalLoading(true);
			try {
				const response =
					await evaluationService.evaluationService.getEvaluations(
						userData.tenant_id
					);
				if (response.total_count !== 0) {
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
					description: `Failed to fetch your data. Exiting with error: ${error}`,
					variant: "destructive",
				});
			} finally {
				setIsEvalLoading(false);
			}
		}

		fetchEvaluations();
	}, [refreshTrigger, userData.tenant_id]);

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
			setIsReportGenerating(true);
			const response: reportResultDTO =
				await reportsService.getExcelReportResult(
					userData.tenant_id,
					reportCompany?.id,
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
			FileSaver.saveAs(blob, reportCompany.name + " report.xlsx");
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
			<section className="flex justify-center items-center w-full bg-black text-white pb-0 pt-10 px-6 sm:px-12 lg:px-16">
				<PageHeader
					heading="Past reviews"
					subtitle="Browse through previously completed reviews to track progress and revisit findings."
					buttonText="Add"
					variant="add"
					buttonUrl="/new-evaluation"
				/>
			</section>

			<section className="flex items-center w-full bg-black text-white mt-8 pt-10 px-6 sm:px-12 lg:px-16">
				<ProgressBarDataTable
					columns={columns}
					data={evaluations.evaluations}
					filterKey="tg_company_display_name"
					rowIdKey={["tg_company_id", "eval_id"]}
					rowLinkPrefix="/evaluation/"
					isLoading={isEvalLoading}
				/>
				<Dialog
					open={reportDialogOpen}
					onOpenChange={(isOpen) => {
						setReportDialogOpen(isOpen);
						if (!isOpen) {
							setReportList(null);
							setreportCompany(null);
						}
					}}
				>
					<DialogContent className="overflow-y-auto max-h-[90vh] h-fit scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-800 max-w-2xl w-full">
						<DialogHeader>
							<DialogTitle>
								Download Reports: {reportCompany?.name}
							</DialogTitle>
							<DialogDescription>
								Here you can download any report you generated
								for this evaluation.
							</DialogDescription>
						</DialogHeader>
						{!reportList ? (
							<RoundSpinner />
						) : (
							<div className="w-full">
								<GenericDataTable
									columns={reportColumns}
									data={reportList}
									isLoading={reportListLoading}
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

export default EvaluationDashboard;
