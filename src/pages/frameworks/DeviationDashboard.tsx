import { GenericDataTable } from "@/components/GenericDataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { SearchIcon, PlusCircleIcon } from "lucide-react";
import {
	frequentDeviation,
	frequentDeviationsDTO,
} from "@/models/collection/collectionDTOs";
import collectionService from "@/services/collectionServices";
import { useAppSelector } from "@/store/hooks";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown01Icon, ArrowUp01Icon, ArrowUpDownIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

function DeviationDashboard() {
	const userData = useAppSelector((state) => state.appUser);
	const { toast } = useToast();
	const [deviations, setDeviations] = useState<frequentDeviation[]>(
		[] as frequentDeviation[]
	);
	const [isDeviationsLoading, setIsDeviationsLoading] =
		useState<boolean>(false);

	useEffect(() => {
		const fetchDeviations = async () => {
			try {
				setIsDeviationsLoading(true);
				const response = (await collectionService.getFrequentDeviations(
					userData.tenant_id
				)) as frequentDeviationsDTO;
				const updatedDeviations = [...response.deviations].map(
					(item, index) => {
						return {
							...item,
							id: item.control_id.slice(2),
						};
					}
				);
				setDeviations(updatedDeviations);
			} catch (error) {
				toast({
					variant: "destructive",
					title: "Error",
					description:
						"Failed to fetch frequent deviations. Please try again.",
				});
			} finally {
				setIsDeviationsLoading(false);
			}
		};

		if (userData.tenant_id) {
			fetchDeviations();
		}
	}, [userData.tenant_id]);

	const columns: ColumnDef<frequentDeviation>[] = [
		{
			accessorKey: "id",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() =>
							column.toggleSorting(column.getIsSorted() === "asc")
						}
						className="p-0 hover:bg-transparent hover:text-white/70 text-base"
					>
						Control Id
						{column.getIsSorted() === "asc" ? (
							<ArrowDown01Icon className="h-4 w-4" />
						) : column.getIsSorted() === "desc" ? (
							<ArrowUp01Icon className="h-4 w-4" />
						) : (
							<ArrowUpDownIcon className="h-4 w-4" />
						)}
					</Button>
				);
			},
		},
		{
			accessorKey: "control_display_name",
			header: "Non-compliant control",
		},
		{
			accessorKey: "num_evals_failed",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() =>
							column.toggleSorting(column.getIsSorted() === "asc")
						}
						className="p-0 hover:bg-transparent hover:text-white/70 text-base"
					>
						Occurrences
						{column.getIsSorted() === "asc" ? (
							<ArrowDown01Icon className="h-4 w-4" />
						) : column.getIsSorted() === "desc" ? (
							<ArrowUp01Icon className="h-4 w-4" />
						) : (
							<ArrowUpDownIcon className="h-4 w-4" />
						)}
					</Button>
				);
			},
			cell: ({ row }) => {
				const occurences: number = row.original.num_evals_failed;
				return (
					<div className="rounded-full text-center flex items-center justify-center min-w-16 h-7 w-fit bg-[#404040]">
						{occurences}
					</div>
				);
			},
		},
	];

	return (
		<div className="min-h-screen font-roboto bg-black text-white p-6">
			<section className="flex w-full bg-black text-white pb-0 pt-16 lg:pt-10 px-3 sm:px-6 md:px-4 lg:px-16">
				<div className="max-w-7xl flex flex-col sm:flex-row justify-between rounded-2xl bg-gradient-to-b from-[#B05BEF] to-[black] w-full p-0 sm:p-6 pb-10">
					<div className="flex flex-col space-y-4 p-6">
						<h1 className="text-6xl font-bold">Frequent deviations</h1>
						<h3>Detect the most frequent or recurring deviations to address underlying risks or process inefficiencies.</h3>

						{/* search input */}
						{/* <div className="relative pt-4">
							<Input
								placeholder={"Search deviations..."}
								// value={filter}
								// onChange={(e) => setFilter(e.target.value)}
								className="max-w-sm text-xl bg-white pl-10 text-black selection:text-black"
							/>
							<SearchIcon className="absolute left-3 top-9 transform -translate-y-1/2 text-gray-500 size-5" />
						</div> */}
					</div>
				</div>
			</section>

			<section className="flex items-center w-full bg-black text-white mt-8 px-3 sm:px-6 md:px-4 lg:px-16">
				<GenericDataTable
					columns={columns}
					data={deviations}
					filterKey={"control_display_name"}
					isLoading={isDeviationsLoading}
					clickableRow={false}
				/>
			</section>
		</div>
	);
}

export default DeviationDashboard;
