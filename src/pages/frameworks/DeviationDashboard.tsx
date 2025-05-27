import { GenericDataTable } from "@/components/GenericDataTable";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import React from "react";

interface DeviationDto {
	id: string;
	control_name: string;
	deviations_recorded: number;
}

const mockDeviationData: DeviationDto[] = [
	{
		id: "1",
		control_name: "Access Control Policy",
		deviations_recorded: 15,
	},
	{
		id: "2",
		control_name: "Data Encryption Standards",
		deviations_recorded: 12,
	},
	{
		id: "3",
		control_name: "Incident Response Plan",
		deviations_recorded: 9,
	},
	{
		id: "4",
		control_name: "Password Management Policy",
		deviations_recorded: 20,
	},
	{
		id: "5",
		control_name: "Network Security Controls",
		deviations_recorded: 8,
	},
	{
		id: "6",
		control_name: "Third-Party Risk Management",
		deviations_recorded: 14,
	},
	{
		id: "7",
		control_name: "Change Management Process",
		deviations_recorded: 10,
	},
	{
		id: "8",
		control_name: "Physical Security Controls",
		deviations_recorded: 7,
	},
	{
		id: "9",
		control_name: "Backup and Recovery Procedures",
		deviations_recorded: 11,
	},
	{
		id: "10",
		control_name: "Audit Logging and Monitoring",
		deviations_recorded: 13,
	},
];

const columns: ColumnDef<DeviationDto>[] = [
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
					ID
					<ArrowUpDown className="h-4 w-4" />
				</Button>
			);
		},
		sortingFn: (a, b) => {
			const valueA = parseInt(a.getValue<string>("id"));
			const valueB = parseInt(b.getValue<string>("id"));
			return valueA - valueB; // Sort numerically
		},
	},
	{
		accessorKey: "control_name",
		header: "Non-compiliant control",
	},
	{
		accessorKey: "deviations_recorded",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
					className="p-0 hover:bg-transparent hover:text-white/70 text-base"
				>
					Occurances
					<ArrowUpDown className="h-4 w-4" />
				</Button>
			);
		},
	},
];

function DeviationDashboard() {
	return (
		<div className="min-h-screen font-roboto bg-black text-white p-6">
			<section className="flex justify-center items-center w-full bg-black text-white pb-0 pt-10 px-6 sm:px-12 lg:px-16">
				<PageHeader
					heading="Frequent deviations"
					subtitle="Detect the most frequent or recurring deviations to address underlying risks or process inefficiencies."
					isClickable={false}
				/>
			</section>

			<section className="flex items-center w-full bg-black text-white mt-8 pt-10 px-6 sm:px-12 lg:px-16">
				<GenericDataTable
					columns={columns}
					data={mockDeviationData}
					filterKey={"control_name"}
					rowIdKey={["id"]}
				/>
			</section>
		</div>
	);
}

export default DeviationDashboard;
