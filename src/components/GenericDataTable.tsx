import * as React from "react";
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getFilteredRowModel,
	useReactTable,
} from "@tanstack/react-table";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { RoundSpinner } from "./ui/spinner";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	filterKey: keyof TData;
	rowIdKey?: keyof TData;
	rowLinkPrefix?: string;
	isLoading: boolean;
}

export function GenericDataTable<TData, TValue>({
	columns,
	data,
	filterKey,
	rowIdKey,
	rowLinkPrefix,
	isLoading,
}: DataTableProps<TData, TValue>) {
	const [filter, setFilter] = React.useState("");
	const navigate = useNavigate();

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			globalFilter: filter,
		},
		onGlobalFilterChange: setFilter,
		globalFilterFn: (row, columnId, filterValue) => {
			const value = row.original[filterKey];
			return value
				?.toString()
				.toLowerCase()
				.includes(filterValue.toLowerCase());
		},
	});

	const handleRowClick = (row: TData) => {
		if (rowIdKey && rowLinkPrefix) {
			const id = row[rowIdKey];
			if (id !== undefined && id !== null) {
				navigate(`${rowLinkPrefix}${id}`);
			}
		}
	};

	return (
		<div className="space-y-4 px-4 max-w-6xl w-full">
			<Input
				placeholder="Search..."
				value={filter}
				onChange={(e) => setFilter(e.target.value)}
				className="max-w-sm"
			/>
			<div className="rounded-md border">
				<Table className="rounded-md">
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
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
						{table.getRowModel().rows.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									onClick={() => handleRowClick(row.original)}
									className="cursor-pointer hover:bg-muted/75 transition"
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
									{isLoading ? <RoundSpinner /> : "No results found."}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex justify-between items-center">
				<div className="text-sm text-muted-foreground">
					Page {table.getState().pagination.pageIndex + 1} of{" "}
					{table.getPageCount()}
				</div>
				{table.getPageCount() > 1 &&(<div className="space-x-2">
					{table.getState().pagination.pageIndex !== 0 &&(<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Previous
					</Button>)}
					<Button
						variant="default"
                        className="bg-sky-500 hover:bg-sky-600 text-white"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Next
					</Button>
				</div>)}
			</div>
		</div>
	);
}
