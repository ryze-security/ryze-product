import { ProgressBarDataTable } from "@/components/ProgressBarDataTable";
import PageHeader from "@/components/PageHeader";
import { useToast } from "@/hooks/use-toast";
import {
	Evaluation,
	listEvaluationsDTO,
} from "@/models/evaluation/EvaluationDTOs";
import evaluationService from "@/services/evaluationServices";
import { ColumnDef } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	ArrowDown,
	ChevronsUpDown,
	Ellipsis,
	MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	reportResultDTO,
	reportResultListDTO,
} from "@/models/reports/ExcelDTOs";
import reportsService from "@/services/reportsServices";
import { RoundSpinner } from "@/components/ui/spinner";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import * as dfd from "danfojs";
import * as ExcelJS from "exceljs";
import * as FileSaver from "file-saver";
import { useAppSelector } from "@/store/hooks";
import { AlertDialogBox } from "@/components/AlertDialogBox";

function EvaluationDashboard() {
	const [reportList, setReportList] =
		React.useState<reportResultListDTO>(null);
	const { toast } = useToast();
	const userData = useAppSelector((state) => state.appUser);
	const [refreshTrigger, setRefreshTrigger] = React.useState<number>(0);

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
				return (
					<span className="text-white font-semibold">
						{score == null ||
						score == undefined ||
						Number.isNaN(score)
							? 0
							: score}
					</span>
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
								<MoreHorizontal />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="end"
							onClick={(e) => e.stopPropagation()} // Prevent row click
						>
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuItem
								onSelect={(e) => e.preventDefault()}
								onClick={async (e) => {
									e.stopPropagation();
									setReportDialogOpen(true);
									try {
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
											setReportCompanyName(
												evaluation.tg_company_id
											);
										}
									} catch (error) {
										toast({
											title: "Error",
											description: `Failed to fetch reports. Please try again later!`,
											variant: "destructive",
										});
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
												await evaluationService.deleteEvaluation(
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
							/>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];

	const [reportDialogOpen, setReportDialogOpen] = useState<boolean>(false);
	const [reportCompanyName, setReportCompanyName] = React.useState<
		string | null
	>(null);

	const [evaluations, setEvaluations] =
		React.useState<listEvaluationsDTO | null>({
			evaluations: [],
			total_count: 0,
		});
	const [isEvalLoading, setIsEvalLoading] = React.useState<boolean>(false);
	const [isReportGenerating, setIsReportGenerating] =
		React.useState<boolean>(false);

	useEffect(() => {
		async function fetchEvaluations() {
			setIsEvalLoading(true);
			try {
				const response = await evaluationService.getEvaluations(
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
					reportCompanyName,
					reportId
				);
			const df = new dfd.DataFrame(response.results);

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

			worksheet.columns.forEach((columns) => {
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
							setReportCompanyName(null);
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
						{!reportList ? (
							<RoundSpinner />
						) : (
							<Collapsible className="flex w-[350px] flex-col gap-2">
								<div className="flex items-center justify-between gap-4 px-4">
									<h4 className="text-sm font-semibold">
										This evaluation has{" "}
										{reportList.total_count} reports.
									</h4>
									<CollapsibleTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											className="size-8"
										>
											<ChevronsUpDown />
											<span className="sr-only">
												Toggle
											</span>
										</Button>
									</CollapsibleTrigger>
								</div>
								<Button
									variant="ghost"
									className="rounded-md border w-fit justify-start px-4 py-2 font-mono text-sm"
									disabled={isReportGenerating}
									onClick={(e) => {
										handleReportDownload(
											reportList.reports[0].report_id
										);
									}}
								>
									{`${
										reportList.reports[0].report_id
									}  ${new Date(
										reportList.reports[0].created_at
									).toLocaleDateString()} ${new Date(
										reportList.reports[0].created_at
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
												onClick={(e) => {
													handleReportDownload(
														report.report_id
													);
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

export default EvaluationDashboard;
