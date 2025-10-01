import React from 'react';
import { useReactTable, getCoreRowModel, getSortedRowModel, getPaginationRowModel, ColumnDef, flexRender, SortingState } from '@tanstack/react-table';
import { Button } from "@/components/ui/button";
import { ArrowDownAZ, ArrowUpZA, ArrowUpDown } from 'lucide-react';
import PageHeader from "@/components/PageHeader";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

type CreditRequest = {
    id: string;
    name: string;
    email: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    requestedAt: string;
};

interface CreditsRequiredProps {
    creditRequests: CreditRequest[];
}

const CreditsRequired: React.FC<CreditsRequiredProps> = ({ creditRequests }) => {
    const [sorting, setSorting] = React.useState<SortingState>([]);

    const columns: ColumnDef<CreditRequest>[] = [
        {
            accessorKey: 'name',
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
                    className="p-0 hover:bg-transparent text-white text-base font-normal"
                >
                    Name
                    {column.getIsSorted() === 'asc' ? (
                        <ArrowDownAZ className="ml-2 h-4 w-4 text-violet-400" />
                    ) : column.getIsSorted() === 'desc' ? (
                        <ArrowUpZA className="ml-2 h-4 w-4 text-violet-400" />
                    ) : (
                        <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
                    )}
                </Button>
            ),
            cell: info => (
                <div className="text-white">
                    {info.getValue() as React.ReactNode}
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
                    className="p-0 hover:bg-transparent text-white text-base font-normal"
                >
                    Email
                    {column.getIsSorted() === 'asc' ? (
                        <ArrowDownAZ className="ml-2 h-4 w-4 text-violet-400" />
                    ) : column.getIsSorted() === 'desc' ? (
                        <ArrowUpZA className="ml-2 h-4 w-4 text-violet-400" />
                    ) : (
                        <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
                    )}
                </Button>
            ),
            cell: info => (
                <div className="text-white">
                    {info.getValue() as React.ReactNode}
                </div>
            ),
        },
        {
            accessorKey: 'status',
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
                    className="p-0 hover:bg-transparent text-white text-base font-normal"
                >
                    Status
                    {column.getIsSorted() === 'asc' ? (
                        <ArrowDownAZ className="ml-2 h-4 w-4 text-violet-400" />
                    ) : column.getIsSorted() === 'desc' ? (
                        <ArrowUpZA className="ml-2 h-4 w-4 text-violet-400" />
                    ) : (
                        <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
                    )}
                </Button>
            ),
            cell: ({ row }) => {
                const status: string = row.getValue('status');
                const statusConfig = {
                    'Approved': { label: 'Approved', bg: 'bg-green-ryzr', text: 'text-white' },
                    'Rejected': { label: 'Rejected', bg: 'bg-red-ryzr', text: 'text-white' },
                    'Pending': { label: 'Pending', bg: 'bg-yellow-600', text: 'text-white' },
                };
                const statusInfo = statusConfig[status as keyof typeof statusConfig] || {
                    label: status,
                    bg: 'bg-gray-500',
                    text: 'text-white'
                };

                return (
                    <div className={`inline-flex items-center px-3 py-1 rounded-sm ${statusInfo.bg} ${statusInfo.text} text-sm font-medium`}>
                        {statusInfo.label}
                    </div>
                );
            },
        },
        {
            accessorKey: 'requestedAt',
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
                    className="p-0 hover:bg-transparent text-white text-base font-normal"
                >
                    Requested At
                    {column.getIsSorted() === 'asc' ? (
                        <ArrowDownAZ className="ml-2 h-4 w-4 text-violet-400" />
                    ) : column.getIsSorted() === 'desc' ? (
                        <ArrowUpZA className="ml-2 h-4 w-4 text-violet-400" />
                    ) : (
                        <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
                    )}
                </Button>
            ),
            cell: info => (
                <div className="text-white">
                    {new Date(info.getValue() as string).toLocaleString()}
                </div>
            ),
        },
    ];

    const table = useReactTable({
        data: creditRequests,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 5,
            },
        },
    });

    return (
        <div className="space-y-4 mt-10 w-full">
            <PageHeader
                heading="Credit Requests"
                subtitle="Manage and review all credit requests"
                isClickable={false}
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
                                        className={`text-white text-base ${index === 0
                                            ? "rounded-tl-md"
                                            : index === headerGroup.headers.length - 1
                                                ? "rounded-tr-md"
                                                : ""
                                            }`}
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
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className="hover:bg-zinc-800 cursor-pointer"
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
                                    className="text-center text-white py-4"
                                >
                                    No credit requests found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex justify-between items-center">
                <div className="text-sm text-gray-400">
                    Page {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount()}
                </div>
                {table.getPageCount() > 1 && (
                    <div className="space-x-2">
                        {table.getState().pagination.pageIndex !== 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                                className="text-white border-gray-600 hover:bg-gray-700"
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

export default CreditsRequired;
