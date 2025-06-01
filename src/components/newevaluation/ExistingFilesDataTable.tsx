import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, Control } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { FilesUploadResponseDTO } from "@/models/files/FilesUploadResponseDTO";
import { RoundSpinner } from "../ui/spinner";

interface DataTableProps<TData> {
	columns: ColumnDef<TData>[];
	data: TData[];
	filterKey: keyof TData;
	control: Control<any>;
	name: string;
	selectId: keyof TData;
	isLoading: boolean;
	openDialog?: () => void;
}

export function FilesDataTable<TData>({
	columns,
	data,
	filterKey,
	control,
	name,
	selectId,
	isLoading,
	openDialog = () => {},
}: DataTableProps<TData>) {
	const [globalFilter, setGlobalFilter] = useState("");
	const [visibleCount, setVisibleCount] = useState(20);
	const scrollRef = useRef<HTMLDivElement>(null);
	const BATCH_SIZE = 20;

	const filteredData = useMemo(() => {
		return data.filter((item) => {
			const value = item[filterKey];
			return typeof value === "string"
				? value.toLowerCase().includes(globalFilter.toLowerCase())
				: true;
		});
	}, [data, filterKey, globalFilter]);

	const visibleData = filteredData.slice(0, visibleCount);

	const handleScroll = () => {
		const el = scrollRef.current;
		if (!el) return;
		if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
			if (visibleCount < filteredData.length) {
				setVisibleCount((prev) => prev + BATCH_SIZE);
			}
		}
	};

	useEffect(() => {
		setVisibleCount(BATCH_SIZE);
	}, [globalFilter]);

	return (
		<Controller
			control={control}
			name={name}
			render={({ field }) => {
				// documentExistingSelected hsould be the default onMount state please act accordingly
				const documents: FilesUploadResponseDTO[] = field.value || [];
				const isSelected = (row: TData) =>
					documents.some((doc) => doc.file_id === row[selectId]);

				const toggleRow = (row: TData) => {
					const id = row[selectId];
					const alreadyIncluded = documents.some(
						(doc) => doc.file_id === id
					);

					if (alreadyIncluded) {
						// Remove from documents
						const updated = documents.filter(
							(doc) => doc.file_id !== id
						);
						field.onChange(updated);
					} else {
						// Add selected file (from existing server files list)
						field.onChange([...documents, row]);
					}
				};

				const selectAll = () => {
					const newSelections = data.filter(
						(row) =>
							!documents.some(
								(doc) => doc.file_id === row[selectId]
							)
					);
					field.onChange([...documents, ...newSelections]);
				};

				const clearAll = () => {
					const updated = documents.filter(
						(doc) =>
							!visibleData.some(
								(row) => row[selectId] === doc.file_id
							)
					);
					field.onChange(updated);
				};

				const isAllSelected = visibleData.every((row) =>
					documents.some((doc) => doc.file_id === row[selectId])
				);

				const toggleAll = () => {
					isAllSelected ? clearAll() : selectAll();
				};

				const getSelectedCount = () => {
					return data.filter((row) =>
						documents.some((doc) => doc.file_id === row[selectId])
					).length;
				};

				const enhancedColumns: ColumnDef<TData>[] = [
					{
						id: "select",
						header: () => (
							<Checkbox
								checked={isAllSelected}
								onCheckedChange={toggleAll}
							/>
						),
						cell: ({ row }) => {
							const rowData = row.original;
							return (
								<Checkbox
									checked={isSelected(rowData)}
									onCheckedChange={() => toggleRow(rowData)}
								/>
							);
						},
					},
					...columns,
				];

				const table = useReactTable({
					data: visibleData,
					columns: enhancedColumns,
					getCoreRowModel: getCoreRowModel(),
				});

				return (
					<div className="space-y-4 rounded-md p-2 shadow-sm bg-black font-roboto">
						<div className="flex justify-between">
							<Input
								placeholder={`Filter by File Name`}
								value={globalFilter}
								onChange={(e) =>
									setGlobalFilter(e.target.value)
								}
								className="max-w-sm bg-black font-roboto"
							/>

							<Button
								variant="outline"
								type="button"
								disabled={isLoading}
								onClick={openDialog}
							>
								{isLoading ? (
									<RoundSpinner />
								) : (
									"Upload New File"
								)}
							</Button>
						</div>
						<ScrollArea
							ref={scrollRef}
							className="h-96 scrollbar-none overflow-hidden border rounded"
							onScroll={handleScroll}
						>
							<table className="w-full text-sm">
								<thead className="bg-zinc-900 sticky top-0 z-10 font-roboto">
									{table
										.getHeaderGroups()
										.map((headerGroup) => (
											<tr key={headerGroup.id}>
												{headerGroup.headers.map(
													(header) => (
														<th
															key={header.id}
															className="p-2 text-left"
														>
															{flexRender(
																header.column
																	.columnDef
																	.header,
																header.getContext()
															)}
														</th>
													)
												)}
											</tr>
										))}
								</thead>
								<tbody>
									{table.getRowModel().rows.map((row) => (
										<tr
											key={row.id}
											className="border-t hover:bg-zinc-800 transition-colors"
										>
											{row
												.getVisibleCells()
												.map((cell) => (
													<td
														key={cell.id}
														className="p-2"
													>
														{flexRender(
															cell.column
																.columnDef.cell,
															cell.getContext()
														)}
													</td>
												))}
										</tr>
									))}
									{table.getRowModel().rows.length === 0 && (
										<tr>
											<td
												colSpan={enhancedColumns.length}
												className="p-4 text-center text-slate-300"
											>
												{isLoading ? (
													<RoundSpinner />
												) : (
													"No results."
												)}
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</ScrollArea>
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="sm"
								type="button"
								onClick={toggleAll}
							>
								{isAllSelected ? "Clear All" : "Select All"}
							</Button>
							<span className="text-sm text-muted-foreground">
								Selected: {getSelectedCount()}
							</span>
						</div>
					</div>
				);
			}}
		/>
	);
}
