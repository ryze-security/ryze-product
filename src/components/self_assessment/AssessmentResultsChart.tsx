import {
	Bar,
	BarChart,
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip,
	Cell,
} from "recharts";
import {
	ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { DomainResult } from "@/models/selfAssessment/selfAssessmentDTOs";

const chartConfig = {
	user_level: {
		label: "Your Level",
		color: "#914EC4", // violet-500
	},
	target_level: {
		label: "Target Level",
		color: "#914EC4", // zinc-700
	},
} satisfies ChartConfig;

interface Props {
	data: DomainResult[];
}

export function AssessmentResultsChart({ data }: Props) {
	// Format data for Recharts
	const chartData = data.map((d) => ({
		initials: d.domain_initials,
		name: d.domain_name,
		user_level: d.user_level,
		target_level: d.target_level,
	}));

	// Dynamic width calculation to force scrolling if many domains
	// 60px per domain ensures thick bars
	const chartWidth = Math.max(data.length * 80, 800);

	return (
		<div className="w-full overflow-x-auto pb-4 scrollbar-thin">
			<div style={{ width: `${chartWidth}px` }}>
				<ChartContainer
					config={chartConfig}
					className="max-h-[300px] w-full"
				>
					<BarChart
						accessibilityLayer
						data={chartData}
						margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
					>
						<CartesianGrid
							vertical={false}
							strokeDasharray="3 3"
							stroke="#3f3f46"
						/>

						{/* TRICK: We use two X-Axes with different IDs but same data key. 
                This forces the bars to "Layer" (overlap) instead of "Group" (side-by-side).
            */}
						<XAxis
							xAxisId="target_axis"
							dataKey="initials"
							tickLine={false}
							tickMargin={10}
							axisLine={false}
							stroke="#a1a1aa"
							hide // Hide one of the axes to avoid duplicate labels
						/>
						<XAxis
							xAxisId="user_axis"
							dataKey="initials"
							tickLine={false}
							tickMargin={10}
							axisLine={false}
							stroke="#a1a1aa"
							interval={0} // Show all labels
						/>

						<YAxis
							domain={[0, 5]}
							tickCount={6}
							axisLine={false}
							tickLine={false}
							stroke="#a1a1aa"
						/>

						<ChartTooltip
							cursor={{ fill: "#27272a" }}
							content={<ChartTooltipContent />}
						/>

						{/* 1. Target Level (Background Layer) - Solid */}
						<Bar
							xAxisId="target_axis"
							dataKey="target_level"
							fill="transparent"
							stroke="var(--color-user_level)"
							strokeWidth={3}
							strokeDasharray="1 3"
							radius={[4, 4, 0, 0]}
							barSize={40} // Thick Bars
						/>

						{/* 2. User Level (Foreground Layer) - Dashed & Transparent */}
						<Bar
							xAxisId="user_axis"
							dataKey="user_level"
							fill="var(--color-user_level)" // Transparent center
							radius={[4, 4, 0, 0]}
							barSize={43} // Same size to match perfectly
						/>
					</BarChart>
				</ChartContainer>
			</div>
		</div>
	);
}
