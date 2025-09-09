import { AlertDialogBox } from "@/components/AlertDialogBox";
import PageHeader from "@/components/PageHeader";
import { ProgressBarDataTable } from "@/components/ProgressBarDataTable";
import { Button } from "@/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
	DropdownMenuSeparator,
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
import { ChevronsUpDownIcon, Ellipsis, MoreHorizontalIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as dfd from "danfojs";
import * as ExcelJS from "exceljs";
import * as FileSaver from "file-saver";
import { Progress } from "@/components/ui/progress";

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
	const [reportList, setReportList] = useState<reportResultListDTO>(null);
	const [isReportListLoading, setIsReportListLoading] =
		useState<boolean>(false);
	const [isDeletingEvaluation, setIsDeletingEvaluation] =
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
								onClick={() => column.setFilterValue("pending")}
							>
								<span
									className={`px-2 py-1 rounded bg-yellow-600`}
								>
									Pending
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
						{evals.charAt(0).toUpperCase() + evals.slice(1)}
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
								<MoreHorizontalIcon />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="end"
							onClick={(e) => e.stopPropagation()} // Prevent row click
						>
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuItem
								onSelect={(e) => e.preventDefault()}
								disabled={isReportListLoading}
								onClick={async (e) => {
									e.stopPropagation();
									setReportDialogOpen(true);
									try {
										setIsReportListLoading(true);
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
											setReportList(response);
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
								Download Report
							</DropdownMenuItem>
							<AlertDialogBox
								trigger={
									<DropdownMenuItem
										onSelect={(e) => e.preventDefault()}
										onClick={(e) => e.stopPropagation()}
										disabled={isDeletingEvaluation}
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
											setIsDeletingEvaluation(true);
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
										} finally {
											setIsDeletingEvaluation(false);
										}
									};

									performDelete();
								}}
							/>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
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
			<section className="flex items-center w-full bg-black text-white mt-8 pt-10 px-3 sm:px-6 md:px-4 lg:px-16">
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
						}
					}}
				>
					<DialogContent className="overflow-y-auto max-h-[90vh] h-fit scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-800">
						<DialogHeader>
							<DialogTitle>Download Reports</DialogTitle>
							<DialogDescription>
								Here you can download any report you generated
								for this evaluation.
							</DialogDescription>
						</DialogHeader>
						{isReportListLoading || !reportList ? (
							<RoundSpinner />
						) : (
							<Collapsible className="flex w-[350px] flex-col gap-2">
								<div className="flex items-center justify-between gap-4 px-4">
									<h4 className="text-sm font-semibold">
										This evaluation has{" "}
										{reportList?.total_count} reports.
									</h4>
									<CollapsibleTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											className="size-8"
										>
											<ChevronsUpDownIcon />
											<span className="sr-only">
												Toggle
											</span>
										</Button>
									</CollapsibleTrigger>
								</div>
								{/* Represents the first button which is always shown in the collapsible tab */}
								<Button
									variant="ghost"
									className="rounded-md border w-fit justify-start px-4 py-2 font-mono text-sm"
									disabled={isReportGenerating}
									onClick={async (e) => {
										try {
											setIsReportGenerating(true);
											const response: reportResultDTO =
												await reportsService.getExcelReportResult(
													userData.tenant_id,
													auditeeId,
													reportList.reports[0]
														.report_id
												);
											if (response) {
												const df = new dfd.DataFrame(
													response.results
												);

												const workbook =
													new ExcelJS.Workbook();
												workbook.creator = "Ryzr";
												workbook.created = new Date();
												const worksheet =
													workbook.addWorksheet(
														"Evaluation Report"
													);

												//Formats and adds headers
												const headerRow =
													worksheet.addRow(
														df.columns
													);
												headerRow.eachCell(
													(cell, index) => {
														cell.value =
															formatHeaderCells(
																cell.value.toString()
															);
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
													}
												);

												const jsonData = dfd.toJSON(
													df
												) as Array<Record<string, any>>;

												//Adds and formats data rows
												jsonData.forEach((record) => {
													const row =
														worksheet.addRow(
															Object.values(
																record
															)
														);

													row.eachCell(
														(cell, index) => {
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
														}
													);
												});

												worksheet.columns.forEach(
													(columns) => {
														columns.width = 20;
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
													}
												);

												const buffer =
													await workbook.xlsx.writeBuffer();
												const blob = new Blob(
													[buffer],
													{
														type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
													}
												);
												FileSaver.saveAs(
													blob,
													"report.xlsx"
												);
											}
										} catch (error) {
											toast({
												title: "Error",
												description: `Failed to download report. Please try again later!`,
												variant: "destructive",
											});
										} finally {
											setIsReportGenerating(false);
										}
									}}
								>
									{`${
										reportList?.reports[0].report_id
									}  ${new Date(
										reportList?.reports[0].created_at
									).toLocaleDateString()} ${new Date(
										reportList?.reports[0].created_at
									).toLocaleTimeString()}`}
								</Button>
								<CollapsibleContent className="flex flex-col gap-2">
									{reportList.reports
										.slice(1)
										.map((report, index) => (
											<Button
												variant="ghost"
												key={index}
												className="rounded-md border justify-start px-4 py-2 font-mono text-sm w-fit"
												disabled={isReportGenerating}
												onClick={async (e) => {
													try {
														setIsReportGenerating(
															true
														);
														const response: reportResultDTO =
															await reportsService.getExcelReportResult(
																userData.tenant_id,
																auditeeId,
																report.report_id
															);
														if (response) {
															const df =
																new dfd.DataFrame(
																	response.results
																);

															dfd.toExcel(df, {
																fileName:
																	"report.xlsx",
																sheetName:
																	"Evaluation Report",
															});
														}
													} catch (error) {
														toast({
															title: "Error",
															description: `Failed to download report. Please try again later!`,
															variant:
																"destructive",
														});
													} finally {
														setIsReportGenerating(
															false
														);
													}
												}}
											>
												{`${
													report.report_id
												} ${new Date(
													report.created_at
												).toLocaleDateString()} 
												${new Date(report.created_at).toLocaleTimeString()}`}
											</Button>
										))}
								</CollapsibleContent>
							</Collapsible>
						)}
					</DialogContent>
				</Dialog>
			</section>
		</div>
	);
}

export default AuditeeEvaluations;
