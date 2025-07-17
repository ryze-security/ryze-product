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
	percentageChange: number;
	changeDescription: string;
}

function SmallDisplayCard(props: Props) {
	const { title, icon, value, percentageChange, changeDescription } = props;

    function formatNumberWithCommas(num: number | string): string {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

	return (
		<div className="bg-[#18181B] rounded-3xl flex flex-col w-[31%] min-h-[148px] justify-center gap-3 pl-6 py-5">
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
				<div
					className={`rounded-full text-center flex items-center justify-center min-w-[62px] h-[26px] ${
						changeDescription === "positive"
							? "bg-green-ryzr"
							: "bg-red-ryzr"
					}`}
				>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>
								<p className="text-sm">
									{changeDescription === "positive"
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
				</div>
			</div>
			<div>
				<p className="font-light text-xs text-[#828282]">
					compared to last month
				</p>
			</div>
		</div>
	);
}

export default SmallDisplayCard;
