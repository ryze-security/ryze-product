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
		footer,
	} = props;

	function formatNumberWithCommas(num: number | string): string {
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	return (
		<div
			className={`bg-[#18181B] rounded-3xl flex flex-col w-[96%] min-h-[148px] justify-start gap-3 pl-6 py-5 ${
				warning && value === 0 ? "border-2 border-red-ryzr" : ""
			}`}
		>
			<div className="text-gray-light-ryzr text-xl font-semibold tracking-wide flex gap-2">
				{
					<>
						{icon} <span>{title}</span>
					</>
				}
			</div>
			<div className="flex gap-6  items-center">
				<span className="text-5xl font-semibold text-white">
					{formatNumberWithCommas(value)}
				</span>
				{changeDescription && percentageChange && (
					<div
						className={`rounded-full text-center flex items-center justify-center min-w-[62px] h-[26px] ${
							changeDescription &&
							changeDescription === "positive"
								? "bg-green-ryzr"
								: "bg-red-ryzr"
						}`}
					>
						{changeDescription && percentageChange && (
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger>
										<p className="text-sm">
											{changeDescription &&
											changeDescription === "positive"
												? "+"
												: "-"}
											{percentageChange}%
										</p>
									</TooltipTrigger>
									<TooltipContent className="bg-gray-ryzr/95">
										<p>compared to last month</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						)}
					</div>
				)}
			</div>

			<div>
				<p className="font-light text-xs text-[#828282]">
					{footer ? footer : "compared to last month"}
				</p>
			</div>
		</div>
	);
}

export default SmallDisplayCard;
