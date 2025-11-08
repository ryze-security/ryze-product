import { useEffect, useState, useMemo, useCallback } from 'react';
import { CustomFormListResponseDTO, CustomFormSubmissionDTO } from '@/models/forms/FormsResponseDTO';
import customFormsService from '@/services/customFormsServices';
import { RoundSpinner } from '@/components/ui/spinner';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    SortingState,
    useReactTable,
    PaginationState,
} from '@tanstack/react-table';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ArrowDownAZ, ArrowUpZA, ArrowDown01, ArrowUp10 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';




const RequestedForms = ({ requestedType }: { requestedType: 'request_credits' | 'request_framework' }) => {
    const [loadingCreditsData, setLoadingCreditsData] = useState(true)
    const [requestedCreditsList, setRequestedCreditsList] = useState<CustomFormListResponseDTO>()
    const [error, setError] = useState<string | null>(null)
    const [sorting, setSorting] = useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })


    const fetchData = useCallback(async () => {
        try {
            setLoadingCreditsData(true);
            const response = await customFormsService.getFormsList({
                form_type: requestedType,
                skip: pagination.pageIndex * pagination.pageSize,
                limit: pagination.pageSize,
            });
            setRequestedCreditsList(response);
            setError(null);
        } catch (error: any) {
            console.error('Error fetching credits list:', error);
            setError(error.message || 'Failed to load credits list');
        } finally {
            setLoadingCreditsData(false);
        }
    }, [pagination.pageIndex, pagination.pageSize]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);


    const columns = useMemo<ColumnDef<CustomFormSubmissionDTO>[]>(
        () => [
            {
                accessorKey: 'first_name',
                header: 'Name',
                cell: ({ row }) => <span className='flex gap-2'>{row.original.first_name} {row.original.last_name}</span>,
            },
            {
                accessorKey: 'blob',
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!column.getIsSorted()) {
                                column.toggleSorting(false);
                            } else if (column.getIsSorted() === "asc") {
                                column.toggleSorting(true);
                            } else {
                                column.clearSorting();
                            }
                        }}
                        className="px-0 hover:bg-transparent hover:text-white"
                    >
                        Email
                        {column.getIsSorted() === "asc" ? (
                            <ArrowDownAZ className="ml-2 h-4 w-4 text-violet-400" />
                        ) : column.getIsSorted() === "desc" ? (
                            <ArrowUpZA className="ml-2 h-4 w-4 text-violet-400" />
                        ) : (
                            <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
                        )}
                    </Button>
                ),
                cell: ({ row }) => {
                    const blob = row.original.blob;
                    return blob ? JSON.parse(blob).email : '';
                },
            },
            {
                accessorKey: 'created_at',
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!column.getIsSorted()) {
                                column.toggleSorting(false);
                            } else if (column.getIsSorted() === "asc") {
                                column.toggleSorting(true);
                            } else {
                                column.clearSorting();
                            }
                        }}
                        className="px-0 hover:bg-transparent hover:text-white"
                    >
                        Created At
                        {column.getIsSorted() === "asc" ? (
                            <ArrowDown01 className="ml-2 h-4 w-4 text-violet-400" />
                        ) : column.getIsSorted() === "desc" ? (
                            <ArrowUp10 className="ml-2 h-4 w-4 text-violet-400" />
                        ) : (
                            <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
                        )}
                    </Button>
                ),
                cell: ({ row }) => (
                    <span className='flex items-center justify-center gap-2'>
                        {(() => {
                            const createdAt = row.original.created_at;
                            const date = new Date(createdAt);
                            const day = String(date.getDate()).padStart(2, "0");
                            const month = date.toLocaleString("en-GB", { month: "short" });
                            const year = date.getFullYear();
                            const hours = String(date.getHours()).padStart(2, "0");
                            const minutes = String(date.getMinutes()).padStart(2, "0");
                            return `${day}-${month}-${year} ${hours}:${minutes}`;
                        })()}
                    </span>
                ),
            },
            {
                accessorKey: 'submission_id',
                header: 'Submission ID',
                cell: ({ row }) => <span className='flex gap-2'>{row.original.submission_id}</span>,
            },
        ],
        []
    )

    const creditsRequestTable = useReactTable({
        data: requestedCreditsList?.submissions || [],
        columns,
        state: {
            sorting,
            globalFilter,
            pagination,
        },
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: (row, columnId, filterValue) => {
            const value = row.original[columnId as keyof CustomFormSubmissionDTO];
            return String(value).toLowerCase().includes(filterValue.toLowerCase());
        },
    })

    if (loadingCreditsData) {
        return (
            <div className="flex items-center justify-center">
                <RoundSpinner />
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-4">
                <div className="text-red-400 p-4 rounded-md bg-red-900/20">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 lg:px-4 max-w-7xl w-full">
            <Input
                placeholder="Search..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="max-w-sm text-xl"
            />

            <div className="rounded-md border">
                <Table className="rounded-md bg-zinc-900">
                    <TableHeader>
                        {creditsRequestTable.getHeaderGroups().map((headerGroup) => (
                            <TableRow
                                key={headerGroup.id}
                                className="bg-[#404040] hover:bg-[#404040] transition-opacity"
                            >
                                {headerGroup.headers.map((header, index) => (
                                    <TableHead
                                        key={header.id}
                                        className={`text-white text-base
                                                        ${index === 0
                                                ? "rounded-tl-md"
                                                : index ===
                                                    headerGroup.headers.length - 1
                                                    ? "rounded-tr-md"
                                                    : ""
                                            }
                                                    `}
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody className="">
                        {creditsRequestTable.getRowModel().rows?.length ? (
                            creditsRequestTable.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className="cursor-pointer hover:bg-zinc-800"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="text-center"
                                >
                                    {loadingCreditsData ? (
                                        <div className="flex items-center justify-center">
                                            <div className="h-8 w-8 border-4 border-zinc-400 border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    ) : (
                                        "No results found."
                                    )}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>


            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-zinc-400">
                    Page {creditsRequestTable.getState().pagination.pageIndex + 1} of {creditsRequestTable.getPageCount()}
                </div>
                {creditsRequestTable.getPageCount() > 1 && (
                    <div className="space-x-2">
                        {creditsRequestTable.getState().pagination.pageIndex !== 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => creditsRequestTable.previousPage()}
                                disabled={!creditsRequestTable.getCanPreviousPage()}
                                className="bg-zinc-800 hover:bg-zinc-700 text-white"
                            >
                                Previous
                            </Button>
                        )}
                        <Button
                            variant="default"
                            className="bg-sky-500 hover:bg-sky-600 text-white"
                            size="sm"
                            onClick={() => creditsRequestTable.nextPage()}
                            disabled={!creditsRequestTable.getCanNextPage()}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}


const CreditsAndFrameWorkRequested = () => {
    return (
        <div className="space-y-4 p-4">
            <h1 className="text-2xl font-bold">Credits And Framework Requests</h1>

            <Tabs defaultValue="credits" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="credits">Credits Requests</TabsTrigger>
                    <TabsTrigger value="framework">Framework Requests</TabsTrigger>
                </TabsList>

                <TabsContent value="credits" className="mt-4">
                    <RequestedForms requestedType='request_credits' />
                </TabsContent>

                <TabsContent value="framework" className="mt-4">
                    <RequestedForms requestedType='request_framework' />
                </TabsContent>
            </Tabs>
        </div>
    );
}




export default CreditsAndFrameWorkRequested
