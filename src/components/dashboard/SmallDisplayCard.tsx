import { Building } from "lucide-react";
import React from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../ui/tooltip";
import { RoundSpinner } from "../ui/spinner";

interface Props {
	title: string;
	icon: React.ReactNode;
	value: number;
	warning?: boolean;
	loading?: boolean;
}

function SmallDisplayCard(props: Props) {
	const { title, icon, value, warning = false, loading = false } = props;

	function formatNumberWithCommas(num: number | string): string {
		if (num !== null && num !== undefined) {
			return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		} else {
			return "0";
		}
	}

	return (
		<div
			className={`
        bg-[#18181B] rounded-3xl flex flex-col w-full p-6 
        justify-center gap-2
        ${
			warning && value === 0
				? "border-2 border-red-ryzr"
				: "border-2 border-transparent"
		}
    `}
		>
			{/* Title: Smaller, uppercase, and muted for better hierarchy */}
			<div className="flex items-center gap-2 text-sm font-semibold tracking-wider text-gray-light-ryzr uppercase">
				{icon}
				<span>{title}</span>
			</div>

			{/* Value: Large and bold to be the focal point */}
			<div className="flex items-center">
				{loading ? (
					<RoundSpinner />
				) : (
					<span className="text-5xl font-bold text-white">
						{formatNumberWithCommas(value)}
					</span>
				)}
			</div>
		</div>
	);
}

export default SmallDisplayCard;
