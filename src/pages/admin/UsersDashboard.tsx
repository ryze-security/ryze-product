import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import usersService from '@/services/usersService';
import { RoundSpinner } from '@/components/ui/spinner';
import { UserListDTO, UserDTO } from '@/models/users/UsersListDTO';
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
import { ArrowUpDown, ArrowDownAZ, ArrowUpZA } from 'lucide-react';

const UsersDashboard = () => {
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [users, setUsers] = useState<UserDTO[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const navigate = useNavigate();
    const location = useLocation();
    const columns = useMemo<ColumnDef<UserDTO>[]>(
        () => [
            {
                accessorKey: 'first_name',
                header: ({ column }) => (
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
                        Name
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
                        <span>{row.original.first_name} {row.original.last_name}</span>
                    </div>
                ),
            },
            {
                accessorKey: 'email',
                header: ({ column }) => (
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
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <span>{row.original.email}</span>
                    </div>
                ),
            },
            {
                accessorKey: 'tenant_id',
                header: 'Tenant',
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <span>{row.original.tenant_id}</span>
                    </div>
                ),
            },
        ],
        []
    );

    const table = useReactTable({
        data: users,
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
            const value = row.original[columnId as keyof UserDTO];
            return String(value).toLowerCase().includes(filterValue.toLowerCase());
        },
    });

    useEffect(() => {
        const fetchUsersList = async () => {
            try {
                setLoadingUsers(true);
                const response = await usersService.getUsersList();
                setUsers(response.users || []);
                setError(null);
            } catch (error: any) {
                console.error('Error fetching users:', error);
                setError(error.message || 'Failed to load users');
            } finally {
                setLoadingUsers(false);
            }
        };

        fetchUsersList();
    }, []);

    if (loadingUsers) {
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
        <div className="space-y-4 max-w-7xl w-full">
            <Input
                placeholder="Search..."
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
                    <TableBody className="">
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className="cursor-pointer hover:bg-zinc-800"
                                    onClick={() => navigate(`${location.pathname}/tenant/${row.original.tenant_id}`, {
                                        state: {
                                            previousPath: location.pathname,
                                        },
                                    })}
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
                                    {loadingUsers ? (
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
                            className="bg-neutral-800 hover:bg-neutral-700 text-white"
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

export default UsersDashboard;