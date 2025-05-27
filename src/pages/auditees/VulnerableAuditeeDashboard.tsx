import { GenericDataTable } from "@/components/GenericDataTable";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import React from "react";

interface VulnerableAuditeeDto {
	id: string;
	auditee_name: string;
	reviews_conducted: number;
	deviations_recorded: number;
	created_on: string;
}

const columns: ColumnDef<VulnerableAuditeeDto>[] = [
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
		accessorKey: "auditee_name",
		header: "Auditee",
	},
	{
		accessorKey: "reviews_conducted",
		header: "Reviews",
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
					Deviations
					<ArrowUpDown className="h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "created_on",
		header: "Last reviewed",
	},
];

function VulnerableAuditeeDashboard() {
	// Mock data for vulnerable auditees
	const mockVulnerableAuditeeData: VulnerableAuditeeDto[] = [
		{
			id: "1",
			auditee_name: "Acme Corporation",
			reviews_conducted: 12,
			deviations_recorded: 5,
			created_on: "2023-05-15",
		},
		{
			id: "2",
			auditee_name: "Global Tech Solutions",
			reviews_conducted: 8,
			deviations_recorded: 3,
			created_on: "2023-06-10",
		},
		{
			id: "3",
			auditee_name: "Innovatech Ltd.",
			reviews_conducted: 15,
			deviations_recorded: 7,
			created_on: "2023-04-20",
		},
		{
			id: "4",
			auditee_name: "Pioneer Industries",
			reviews_conducted: 10,
			deviations_recorded: 6,
			created_on: "2023-07-01",
		},
		{
			id: "5",
			auditee_name: "NextGen Enterprises",
			reviews_conducted: 9,
			deviations_recorded: 4,
			created_on: "2023-03-12",
		},
	];

	return (
		<div className="min-h-screen font-roboto bg-black text-white p-6">
			<section className="flex justify-center items-center w-full bg-black text-white pb-0 pt-10 px-6 sm:px-12 lg:px-16">
				<PageHeader
					heading="Vulnerable auditees"
					subtitle="Identify auditees with the highest number of deviations across all assessments."
					isClickable={false}
				/>
			</section>

			<section className="flex items-center w-full bg-black text-white mt-8 pt-10 px-6 sm:px-12 lg:px-16">
				<GenericDataTable
					columns={columns}
					data={mockVulnerableAuditeeData}
					filterKey={"auditee_name"}
					rowIdKey={["id"]}
				/>
			</section>
		</div>
	);
}

export default VulnerableAuditeeDashboard;
