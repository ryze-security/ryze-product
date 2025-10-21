import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ProgressBarDataTable } from '@/components/ProgressBarDataTable'
import PageHeader from "@/components/PageHeader";
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, Filter, MoreHorizontal, ArrowUpDown, ArrowDown01, ArrowUp10, ArrowDownAZ, ArrowUpZA, MoveLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import reportsService from "@/services/reportsServices";
import { RoundSpinner } from "@/components/ui/spinner";
import { AlertDialogBox } from "@/components/AlertDialogBox";
import { Progress } from "@/components/ui/progress";
import { useToast } from '@/hooks/use-toast';
import { useParams } from "react-router-dom";

const TenantDetails = () => {
    const [reportList, setReportList] = React.useState<ReportList[]>([]);
    const { toast } = useToast();
    const location = useLocation();
    const navigate = useNavigate();
    const [refreshTrigger, setRefreshTrigger] = React.useState<number>(0);
    const activePollers = useRef(new Map<string, AdaptivePolling>());
    const statusService = useRef(new EvaluationStatusService());
    const [evaluations, setEvaluations] = React.useState<listEvaluationsDTO | null>({
        evaluations: [],
        total_count: 0,
    });

    const [isEvalLoading, setIsEvalLoading] = React.useState<boolean>(false);

    const { tenantId: tenant_id } = useParams();

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
                        tenant_id,
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
    }, [evaluations.evaluations, tenant_id, handleStatusUpdate]);

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

                const currentFilters = (column.getFilterValue() as string[]) || [];
                const isFilterActive = currentFilters.length > 0;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger className="group p-1.5 -mx-1.5 rounded-md hover:bg-white/10 transition-colors text-base flex items-center gap-2">
                            Framework
                            <div className="relative">
                                <Filter className={`h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity ${isFilterActive ? 'text-violet-ryzr' : ''}`} />
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
                                        className={`ml-3 h-6 text-xs text-violet-ryzr hover:text-white hover:bg-white/10 transition-opacity ${!isFilterActive ? 'opacity-0 pointer-events-none' : ''}`}
                                    >
                                        Clear all
                                    </Button>
                                </div>
                            </div>
                            <div className="overflow-y-auto max-h-[300px] p-1">
                                {controlNames.map((controlName) => {
                                    const isSelected = currentFilters.includes(controlName);
                                    return (
                                        <div
                                            key={controlName}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const newFilters = isSelected
                                                    ? currentFilters.filter(f => f !== controlName)
                                                    : [...currentFilters, controlName];
                                                column.setFilterValue(newFilters.length ? newFilters : undefined);
                                            }}
                                            className="flex items-center px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-white/10 text-white/90 group"
                                        >
                                            <div className={`h-4 w-4 rounded border ${isSelected ? 'bg-violet-ryzr border-violet-ryzr flex items-center justify-center' : 'border-zinc-600'} mr-3`}>
                                                {isSelected && (
                                                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>
                                            <span className={isSelected ? 'text-white' : 'text-white/90'}>
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

                const currentFilters = (column.getFilterValue() as string[]) || [];
                const isFilterActive = currentFilters.length > 0;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger className="group p-1.5 -mx-1.5 rounded-md hover:bg-white/10 transition-colors text-base flex items-center gap-2">
                            Status
                            <div className="relative">
                                <Filter className={`h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity ${isFilterActive ? 'text-violet-ryzr' : ''}`} />
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
                                        className={`ml-3 h-6 text-xs text-violet-ryzr hover:text-white hover:bg-white/10 transition-opacity ${!isFilterActive ? 'opacity-0 pointer-events-none' : ''}`}
                                    >
                                        Clear all
                                    </Button>
                                </div>
                            </div>
                            <div className="overflow-y-auto max-h-[300px] p-1">
                                {statusFilters.map((status) => {
                                    const isSelected = currentFilters.includes(status.value);
                                    return (
                                        <div
                                            key={status.value}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const newFilters = isSelected
                                                    ? currentFilters.filter(f => f !== status.value)
                                                    : [...currentFilters, status.value];
                                                column.setFilterValue(newFilters.length ? newFilters : undefined);
                                            }}
                                            className="flex items-center px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-white/10 text-white/90 group"
                                        >
                                            <div className={`h-4 w-4 rounded border ${isSelected ? 'bg-violet-ryzr border-violet-ryzr flex items-center justify-center' : 'border-zinc-600'} mr-3`}>
                                                {isSelected && (
                                                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${status.color}`}></span>
                                                <span className={isSelected ? 'text-white' : 'text-white/90'}>{status.label}</span>
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
                                    setReportListLoading(true);
                                    const response = await reportsService.getReportList(
                                        tenant_id,
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
                            tenant_id,
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
                            tenant_id,
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

    useEffect(() => {
        async function fetchEvaluations() {
            setIsEvalLoading(true);
            try {
                const response = await evaluationService.evaluationService.getEvaluations(
                    tenant_id
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
    }, [refreshTrigger]);


    return (
        <div className="min-h-screen font-roboto bg-black text-white p-6">
            <section className='flex flex-col w-full bg-black text-white pb-0 pt-10 px-3 sm:px-6 md:px-4 lg:px-16 gap-6'>

                <PageHeader
                    heading="Tenant Details"
                    subtitle="This is what to be shown whenever user click a row from Users tab or Tenants tab."
                    isClickable={false}
                />

                <Button
                    onClick={() => navigate(location.state?.previousPath)}
                    disabled={tenant_id === null}
                    className="rounded-full bg-zinc-700 hover:bg-zinc-800 transition-colors text-white p-2 w-20"
                >
                    <MoveLeft
                        style={{
                            width: "28px",
                            height: "28px",
                        }}
                    />
                </Button>
            </section>

            <section className="flex items-center w-full bg-black text-white mt-8 px-3 sm:px-6 md:px-4 lg:px-16">

                <ProgressBarDataTable
                    columns={columns}
                    data={evaluations.evaluations}
                    filterKey="tg_company_display_name"
                    rowIdKey={["tg_company_id", "eval_id"]}
                    rowLinkPrefix={`${location.pathname}/`}
                    isLoading={isEvalLoading}
                    isRowDisabled={(row) => row.processing_status !== "completed"}

                />
            </section>
        </div>
    )
}

export default TenantDetails
