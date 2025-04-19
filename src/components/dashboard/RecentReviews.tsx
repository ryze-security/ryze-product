import React from "react";
import DateBox from "./DateBox";

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
				<h2 className="text-lg font-semibold tracking-wide">
					{companyName}
				</h2>
				<span className="text-sm text-neutral-400">{framework}</span>
			</div>

			{/* Score Bar - pushed to the right */}
			<div className="flex-1 ml-auto max-w-xs">
				<div className="relative w-full h-4 bg-neutral-700 rounded-full overflow-hidden">
					<div
						className="absolute top-0 left-0 h-full bg-violet-600 text-xs text-white font-semibold flex items-center justify-end pr-2"
						style={{ width: `${score}%`, minWidth: "2.5rem" }}
					>
						{score}%
					</div>
				</div>
			</div>
		</div>
	);
}

export default RecentReviews;
