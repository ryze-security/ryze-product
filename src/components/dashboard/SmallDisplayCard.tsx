import { Building } from "lucide-react";
import React from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../ui/tooltip";

interface Props {
	title: string;
	icon: React.ReactNode;
	value: number;
	percentageChange?: number;
	changeDescription?: string;
	warning?: boolean;
	footer?: string;
}

function SmallDisplayCard(props: Props) {
	const {
		title,
		icon,
		value,
		percentageChange,
		changeDescription,
		warning = false,
	} = props;

	function formatNumberWithCommas(num: number | string): string {
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
			<div className="flex items-center gap-2 text-sm font-semibold tracking-wider text-zinc-400 uppercase">
				{icon}
				<span>{title}</span>
			</div>

			{/* Value: Large and bold to be the focal point */}
			<div className="flex items-center">
				<span className="text-5xl font-bold text-white">
					{formatNumberWithCommas(value)}
				</span>
			</div>
		</div>
	);
}

export default SmallDisplayCard;
