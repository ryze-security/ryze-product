import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import tenantService from '@/services/tenantServices';
import { RoundSpinner } from '@/components/ui/spinner';
import { tenantDetailsDTO } from '@/models/tenant/TenantDTOs';
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
import { ArrowUpDown, ArrowDownAZ, ArrowUpZA, ArrowDown01, ArrowUp10, MoveLeft } from 'lucide-react';

const TenantsDashboard = () => {
    const [loadingTenants, setLoadingTenants] = useState(true);
    const [tenants, setTenants] = useState<tenantDetailsDTO[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchTenantsList = async () => {
            try {
                setLoadingTenants(true);
                const response = await tenantService.getTenantsList();
                setTenants(response || []);
                setError(null);
            } catch (error: any) {
                setError(error.message || 'Failed to load tenants');
            } finally {
                setLoadingTenants(false);
            }
        };
        fetchTenantsList();
    }, []);

    const columns = useMemo<ColumnDef<tenantDetailsDTO>[]>(
        () => [
            {
                accessorKey: 'tenant_display_name',
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
                        Tenant Name
                        {column.getIsSorted() === "asc" ? (
                            <ArrowDownAZ className="ml-2 h-4 w-4 text-violet-400" />
                        ) : column.getIsSorted() === "desc" ? (
                            <ArrowUpZA className="ml-2 h-4 w-4 text-violet-400" />
                        ) : (
                            <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
                        )}
                    </Button>
                ),
                cell: ({ row }) => (<span className='flex items-center gap-2'>{row.original.tenant_display_name}</span>
                )
                ,
            },
            {
                accessorKey: 'first_user',
                header: 'User Name',
            },
            {
                accessorKey: 'created_on',
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
                        Created On
                        {column.getIsSorted() === "asc" ? (
                            <ArrowDownAZ className="ml-2 h-4 w-4 text-violet-400" />
                        ) : column.getIsSorted() === "desc" ? (
                            <ArrowUpZA className="ml-2 h-4 w-4 text-violet-400" />
                        ) : (
                            <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
                        )}
                    </Button>
                ),
                cell: ({ row }) => (
                    <span className='flex items-center justify-center gap-2'>
                        {(() => {
                            const date = new Date(row.original.created_on);
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
                accessorKey: 'total_credits',
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
                        Total Credits
                        {column.getIsSorted() === "asc" ? (
                            <ArrowDown01 className="ml-2 h-4 w-4 text-violet-400" />
                        ) : column.getIsSorted() === "desc" ? (
                            <ArrowUp10 className="ml-2 h-4 w-4 text-violet-400" />
                        ) : (
                            <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
                        )}
                    </Button>
                ),
                cell: ({ row }) => (<span className='flex justify-center items-center gap-2'>{row.original.total_credits}</span>)
            },
            {
                accessorKey: 'remaining_credits',
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
                        Remaining Credits
                        {column.getIsSorted() === "asc" ? (
                            <ArrowDown01 className="ml-2 h-4 w-4 text-violet-400" />
                        ) : column.getIsSorted() === "desc" ? (
                            <ArrowUp10 className="ml-2 h-4 w-4 text-violet-400" />
                        ) : (
                            <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
                        )}
                    </Button>
                ),
                cell: ({ row }) => (<span className='flex justify-center items-center gap-2'>{row.original.remaining_credits}</span>)
            },
            {
                accessorKey: 'num_documents',
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
                        Documents
                        {column.getIsSorted() === "asc" ? (
                            <ArrowDown01 className="ml-2 h-4 w-4 text-violet-400" />
                        ) : column.getIsSorted() === "desc" ? (
                            <ArrowUp10 className="ml-2 h-4 w-4 text-violet-400" />
                        ) : (
                            <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
                        )}
                    </Button>
                ),
                cell: ({ row }) => (<span className='flex justify-center items-center gap-2'>{row.original.num_documents}</span>)
            },
            {
                accessorKey: 'num_evaluations',
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
                        Evaluations
                        {column.getIsSorted() === "asc" ? (
                            <ArrowDown01 className="ml-2 h-4 w-4 text-violet-400" />
                        ) : column.getIsSorted() === "desc" ? (
                            <ArrowUp10 className="ml-2 h-4 w-4 text-violet-400" />
                        ) : (
                            <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
                        )}
                    </Button>
                ),
                cell: ({ row }) => (<span className='flex justify-center items-center gap-2'>{row.original.num_evaluations}</span>)
            },
        ],
        []
    );

    const table = useReactTable({
        data: tenants,
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
            const value = row.original[columnId as keyof tenantDetailsDTO];
            return String(value).toLowerCase().includes(filterValue.toLowerCase());
        },
    });

    if (loadingTenants) {
        return (
            <div className="flex items-center justify-center">
                <RoundSpinner />
            </div>
        );
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
        <div className="space-y-4 max-w-7xl">
            <Input
                placeholder="Search tenants..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="max-w-sm text-xl"
            />
            <div className="rounded-md border">
                <Table className="rounded-md bg-zinc-900">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
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
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="cursor-pointer hover:bg-zinc-800"
                                    onClick={() => navigate(`${location.pathname}/tenant/${row.original.tenant_id}`, {
                                        state: {
                                            previousPath: location.pathname,
                                        },
                                    })}>
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
                                    No results found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-zinc-400">
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </div>
                {table.getPageCount() > 1 && (
                    <div className="space-x-2">
                        {table.getState().pagination.pageIndex !== 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                                className="bg-zinc-800 hover:bg-zinc-700 text-white"
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
        </div>
    );
};

export default TenantsDashboard;