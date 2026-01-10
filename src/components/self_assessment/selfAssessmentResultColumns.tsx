import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// The shape of the flattened data for the table
export interface AssessmentRowData {
	domainId: number;
	initials: string;
	name: string;
	criticality: string;
	userLevel: number;
	targetLevel: number;
	recommendationSnippet: string;
}

export const resultsColumns: ColumnDef<AssessmentRowData>[] = [
	{
		accessorKey: "initials",
		header: "ID",
		cell: ({ row }) => (
			<span className="font-mono text-zinc-400">
				{row.getValue("initials")}
			</span>
		),
	},
	{
		accessorKey: "name",
		header: "Domain",
		cell: ({ row }) => (
			<span className="font-semibold text-zinc-400">
				{row.getValue("name")}
			</span>
		),
	},
	{
		accessorKey: "criticality",
		header: "Criticality",
		cell: ({ row }) => (
			<Badge
				variant="outline"
				className={cn(
					"border-zinc-700 text-zinc-400",
					row.getValue("criticality") === "Critical"
						? "bg-rose-900/30 border-rose-700 text-rose-400"
						: row.getValue("criticality") === "High"
						? "bg-amber-900/30 border-amber-700 text-amber-400"
						: "bg-zinc-800 border-zinc-700 text-zinc-400"
				)}
			>
				{row.getValue("criticality")}
			</Badge>
		),
	},
	{
		accessorKey: "userLevel",
		header: () => <div className="text-center">Score</div>,
		cell: ({ row }) => {
			const score = row.getValue("userLevel") as number;
			const target = row.original.targetLevel;
			const isGap = score < target;
			const gapValue = target - score;

			// Determine background color based on gap severity
			let bgClass = "bg-green-ryzr"; // Default: Compliant (No Gap)
			if (isGap) {
				bgClass =
					gapValue === 1
						? "bg-amber-600" // Warning (Close) - Standard Tailwind
						: "bg-red-ryzr"; // Critical (Big Gap) - Custom Red
			}

			return (
				<div className="flex justify-center items-center w-full">
					<div
						className={`
                            flex items-center justify-center 
                            w-7 h-7 rounded-md 
                            text-sm font-bold text-white 
                            shadow-sm ${bgClass}
                        `}
					>
						{score}
					</div>
				</div>
			);
		},
	},
	{
		accessorKey: "targetLevel",
		header: () => <div className="text-center">Target</div>,
		cell: ({ row }) => (
			<div className="flex justify-center items-center w-full">
					<div
						className={`
                            flex items-center justify-center 
                            w-7 h-7 rounded-md 
                            text-sm font-bold text-white 
                            shadow-sm bg-zinc-700
                        `}
					>
						{row.getValue("targetLevel")}
					</div>
				</div>
		),
	},
	{
		accessorKey: "recommendationSnippet",
		header: "Primary Recommendation",
		cell: ({ row }) => {
			const text = row.getValue("recommendationSnippet") as string;
			return (
				<span
					className={`text-sm truncate max-w-[300px] block ${
						!text ? "text-zinc-300 italic" : "text-zinc-300"
					}`}
				>
					{text.length > 0 ? text : "No actions needed"}
				</span>
			);
		},
	},
	{
		id: "actions",
		cell: () => <ChevronRight className="w-4 h-4 text-zinc-600 ml-auto" />,
	},
];
