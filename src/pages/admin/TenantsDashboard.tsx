import React, { useEffect, useState, useMemo } from 'react';
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
import { ArrowUpDown, ArrowDownAZ, ArrowUpZA, ArrowDown01, ArrowUp10 } from 'lucide-react';

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
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <span className="font-medium">{row.original.tenant_display_name}</span>
                    </div>
                ),
            },
            {
                accessorKey: 'tenant_id',
                header: 'Tenant ID',
                cell: ({ row }) => (
                    <div className="text-zinc-400">
                        {row.original.tenant_id}
                    </div>
                ),
            },
            {
                accessorKey: 'num_companies',
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
                        Companies
                        {column.getIsSorted() === "asc" ? (
                            <ArrowDown01 className="ml-2 h-4 w-4 text-violet-400" />
                        ) : column.getIsSorted() === "desc" ? (
                            <ArrowUp10 className="ml-2 h-4 w-4 text-violet-400" />
                        ) : (
                            <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
                        )}
                    </Button>
                ),
                cell: ({ row }) => row.original.num_companies,
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
                cell: ({ row }) => row.original.total_credits.toLocaleString(),
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
                cell: ({ row }) => (
                    <span className={row.original.remaining_credits < (row.original.total_credits * 0.2) ? 'text-red-400' : ''}>
                        {row.original.remaining_credits.toLocaleString()}
                    </span>
                ),
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
        <div className="space-y-4 lg:px-4 max-w-7xl w-full">
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
                            variant="default"
                            className="bg-sky-500 hover:bg-sky-600 text-white"
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