import React from "react";
import DateBox from "./DateBox";
import { Progress } from "../ui/progress";

interface Props {
	companyName: string;
	framework: string;
	score: number; // 0 to 100
	date: string;
}

function RecentReviews(props: Props) {
	const { companyName, framework, score, date } = props;

	return (
		<div className="flex items-center gap-6 bg-transparent text-white rounded-xl p-4 w-full hover:bg-zinc-700 hover:bg-opacity-50 hover:shadow-md transition duration-150 ease-in-out hover:cursor-pointer">
			<DateBox date={date} />

			<div className="flex flex-col justify-center w-1/2">
				<h2 className="text-lg tracking-wider">
					{companyName}
				</h2>
				<span className="text-sm text-neutral-400">{framework}</span>
			</div>

			{/* Score Bar - pushed to the right */}
			<div className="flex-1 ml-auto max-w-20">
				<div className="relative w-full">
					<Progress
						value={score}
						className="h-6 bg-neutral-700 rounded-full"
						indicatorColor="bg-violet-ryzr"
					/>
					<div className="absolute inset-0 flex justify-center items-center text-white text-xs font-semibold">
						{score}%
					</div>
				</div>
			</div>
		</div>
	);
}

export default RecentReviews;
