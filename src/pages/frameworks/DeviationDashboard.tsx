import { GenericDataTable } from "@/components/GenericDataTable";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
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
			<section className="flex justify-center items-center w-full bg-black text-white pb-0 pt-10 px-3 sm:px-6 md:px-4 lg:px-16">
				<PageHeader
					heading="Frequent deviations"
					subtitle="Detect the most frequent or recurring deviations to address underlying risks or process inefficiencies."
					isClickable={false}
				/>
			</section>

			<section className="flex items-center w-full bg-black text-white mt-8 pt-10 px-3 sm:px-6 md:px-4 lg:px-16">
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
