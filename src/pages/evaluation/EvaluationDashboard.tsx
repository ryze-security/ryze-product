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
import { Ellipsis, MoreHorizontal, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
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

function EvaluationDashboard() {
    const [reportList, setReportList] = React.useState<ReportList[]>([]);
    const { toast } = useToast();
    const userData = useAppSelector((state) => state.appUser);
    const [refreshTrigger, setRefreshTrigger] = React.useState<number>(0);
    const activePollers = useRef(new Map<string, AdaptivePolling>());
    const statusService = useRef(new EvaluationStatusService());
    const [evaluations, setEvaluations] = React.useState<listEvaluationsDTO | null>({
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
                                ? parseInt(newStatus.progress.score_percentage.toFixed(2))
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
            ["pending", "in_progress", "failed", "processing_missing_elements"].includes(
                ev.processing_status
            )
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

                poller.startPolling(fetchStatus, handleStatusUpdate, onComplete);
                pollers.set(ev.eval_id, poller);
            }
        });

        pollers.forEach((poller, evalId) => {
            const stillNeedsPolling = evaluations.evaluations.some(
                (ev) =>
                    ev.eval_id === evalId &&
                    ["pending", "in_progress", "failed", "processing_missing_elements"].includes(
                        ev.processing_status
                    )
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
                            <ArrowUp className="ml-2 h-4 w-4 text-violet-400" />
                        ) : column.getIsSorted() === "desc" ? (
                            <ArrowDown className="ml-2 h-4 w-4 text-violet-400" />
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

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger className="group p-1.5 -mx-1.5 rounded-md hover:bg-white/10 transition-colors text-base flex items-center gap-2">
                            {column.getFilterValue() && (
                                <span className="h-2 w-2 rounded-full bg-violet-ryzr" />
                            )}
                            Framework
                            <Ellipsis className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="min-w-[200px] bg-zinc-800 border-zinc-700">
                            <DropdownMenuLabel className="text-white/80 font-medium">
                                Filter by Framework
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-zinc-700" />
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation();
                                    column.setFilterValue("");
                                }}
                                className="focus:text-white cursor-pointer"
                            >
                                <span className="px-3 py-1.5 rounded-md bg-zinc-700/50 text-sm font-medium w-full text-center transition-colors hover:bg-zinc-600/50">
                                    Reset Filter
                                </span>
                            </DropdownMenuItem>
                            {controlNames.map((controlName) => (
                                <DropdownMenuItem
                                    key={controlName}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        column.setFilterValue(controlName);
                                    }}
                                    className={`text-white/90 focus:bg-zinc-700/50 px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${column.getFilterValue() === controlName &&
                                        "bg-violet-ryzr text-white"
                                        }`}
                                >
                                    {controlName}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
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
                            <ArrowUp className="ml-2 h-4 w-4 text-violet-400" />
                        ) : column.getIsSorted() === "desc" ? (
                            <ArrowDown className="ml-2 h-4 w-4 text-violet-400" />
                        ) : (
                            <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
                        )}
                    </Button>
                );
            },
            cell: ({ row }) => {
                const score: number = row.getValue("overall_score");
                const updatedScore =
                    score == null || score == undefined || Number.isNaN(score) ? 0 : score;
                return (
                    <div>
                        {row.original.processing_status === "in_progress" ||
                            row.original.processing_status === "processing_missing_elements" ? (
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
                    { value: "in_progress", label: "In Progress", color: "bg-yellow-600" },
                    { value: "completed", label: "Completed", color: "bg-green-ryzr" },
                    { value: "cancelled", label: "Cancelled", color: "bg-red-ryzr" },
                    { value: "failed", label: "Failed", color: "bg-red-ryzr" },
                ];

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger className="group p-1.5 -mx-1.5 rounded-md hover:bg-white/10 transition-colors text-base flex items-center gap-1.5">
                            {column.getFilterValue() && (
                                <span className={`h-2 w-2 rounded-full ${column.getFilterValue() === "in_progress" ? "bg-yellow-600" : column.getFilterValue() === "completed" ? "bg-green-ryzr" : column.getFilterValue() === "cancelled" ? "bg-red-ryzr" : "bg-red-ryzr"}`} />
                            )}
                            Status
                            <Ellipsis className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="min-w-[180px] bg-zinc-800 border-zinc-700">
                            <DropdownMenuLabel className="text-white/80 font-medium">
                                Filter by Status
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-zinc-700" />
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation();
                                    column.setFilterValue("");
                                }}
                                className="focus:text-white cursor-pointer"
                            >
                                <span className="px-3 py-1.5 rounded-md bg-zinc-700/50 text-sm font-medium w-full text-center transition-colors hover:bg-zinc-600/50">
                                    Reset Filter
                                </span>
                            </DropdownMenuItem>
                            {statusFilters.map((status) => (
                                <DropdownMenuItem
                                    key={status.value}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        column.setFilterValue(status.value);
                                    }}
                                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${column.getFilterValue() === status.value
                                        ? "bg-violet-ryzr text-white"
                                        : "focus:text-white/90 focus:bg-zinc-700/50"
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`w-2.5 h-2.5 rounded-full ${status.color}`}
                                        ></span>
                                        <span>{status.label}</span>
                                    </div>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
            cell: ({ row }) => {
                const evals: string = row.getValue("processing_status");
                return (
                    <span
                        className={`px-2 py-1 rounded ${evals === "completed"
                            ? "bg-green-ryzr"
                            : evals === "failed" || evals === "cancelled"
                                ? "bg-red-ryzr"
                                : "bg-yellow-600"
                            }`}
                    >
                        {evals.charAt(0).toUpperCase() + evals.slice(1).replace("_", " ")}
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
                            <ArrowUp className="ml-2 h-4 w-4 text-violet-400" />
                        ) : column.getIsSorted() === "desc" ? (
                            <ArrowDown className="ml-2 h-4 w-4 text-violet-400" />
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
                                    setReportListLoading(true);
                                    const response = await reportsService.getReportList(
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
                                        const updatedData = [...response.reports]
                                            .map((item, index) => {
                                                return {
                                                    ...item,
                                                    sNo: index + 1,
                                                    created_at: new Date(
                                                        item.created_at
                                                    ).toLocaleDateString(),
                                                    reportName: `Report_${index + 1}`,
                                                    report_type:
                                                        item.report_type === "Observations"
                                                            ? "Gap Analysis Report"
                                                            : item.report_type,
                                                };
                                            })
                                            .sort((a, b) =>
                                                b.created_at.localeCompare(a.created_at)
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
                const isInProgress =
                    evaluation.processing_status === "in_progress" ||
                    evaluation.processing_status === "pending" ||
                    evaluation.processing_status === "processing_missing_elements";

                const performDelete = async () => {
                    try {
                        const response = await evaluationService.evaluationService.deleteEvaluation(
                            userData.tenant_id,
                            evaluation.tg_company_id,
                            evaluation.eval_id
                        );
                        if (response.status === "success") {
                            setRefreshTrigger((prev) => prev + 1);
                            toast({
                                title: "Report Deleted!",
                                description: "The report has been deleted successfully",
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
                        const response = await evaluationService.evaluationService.cancelEvaluation(
                            userData.tenant_id,
                            evaluation.tg_company_id,
                            evaluation.eval_id
                        );
                        if (response) {
                            setRefreshTrigger((prev) => prev + 1);
                            toast({
                                title: "Evaluation Cancelled!",
                                description: "The evaluation has been cancelled successfully",
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

    const [reportDialogOpen, setReportDialogOpen] = useState<boolean>(false);
    const [reportListLoading, setReportListLoading] = useState<boolean>(false);
    const [reportCompany, setreportCompany] = React.useState<{
        id: string;
        name: string;
    }>({ id: "", name: "" });

    const [isEvalLoading, setIsEvalLoading] = React.useState<boolean>(false);
    const [isReportGenerating, setIsReportGenerating] = React.useState<boolean>(false);

    useEffect(() => {
        async function fetchEvaluations() {
            setIsEvalLoading(true);
            try {
                const response = await evaluationService.evaluationService.getEvaluations(
                    userData.tenant_id
                );
                if (response.total_count !== 0) {
                    response.evaluations = response.evaluations.map((evaluation: Evaluation) => {
                        return {
                            ...evaluation,
                            overall_score:
                                evaluation.processing_status === "pending"
                                    ? 0
                                    : Math.round(
                                        Number.parseFloat(evaluation.overall_score?.toFixed(2))
                                    ),
                            created_at: new Date(evaluation.created_at).toLocaleDateString(),
                            collection_created_at: new Date(
                                evaluation.collection_created_at
                            ).toLocaleDateString(),
                            collection_edited_on: new Date(
                                evaluation.collection_edited_on
                            ).toLocaleDateString(),
                        };
                    });
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
            const response: reportResultDTO = await reportsService.getExcelReportResult(
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

                    if (cell.value && cell.value.toString().includes('**')) {
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
            <section className="flex justify-center items-center w-full bg-black text-white pb-0 pt-10 px-3 sm:px-6 md:px-4 lg:px-16">
                <PageHeader
                    heading="Past reviews"
                    subtitle="Browse through previously completed reviews to track progress and revisit findings."
                    buttonText="Add"
                    variant="add"
                    buttonUrl="/new-evaluation"
                />
            </section>

            <section className="flex items-center w-full bg-black text-white mt-8 pt-10 px-3 sm:px-6 md:px-4 lg:px-16">
                <ProgressBarDataTable
                    columns={columns}
                    data={evaluations.evaluations}
                    filterKey="tg_company_display_name"
                    rowIdKey={["tg_company_id", "eval_id"]}
                    rowLinkPrefix="/evaluation/"
                    isLoading={isEvalLoading}
                    isRowDisabled={(row) => row.processing_status !== "completed"}
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
                    <DialogContent className="flex flex-col max-h-[90vh] h-fit scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-800 lg:max-w-2xl">
                        <DialogHeader className="flex-shrink-0 border-b pb-4 text-left">
                            <DialogTitle>Download Reports: {reportCompany?.name}</DialogTitle>
                            <DialogDescription className="text-wrap">
                                Here you can download any report you generated for this evaluation.
                            </DialogDescription>
                        </DialogHeader>
                        {!reportList ? (
                            <RoundSpinner />
                        ) : (
                            <div className="flex-1 overflow-y-auto mt-4">
                                <GenericDataTable
                                    columns={reportColumns}
                                    data={reportList}
                                    isLoading={reportListLoading}
                                    filterKey="reportName"
                                    onRowClick={(row) => handleReportDownload(row.report_id)}
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
