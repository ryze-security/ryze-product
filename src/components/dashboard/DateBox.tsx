import React from "react";

interface Props {
	date: string;
}

function DateBox({date}: Props) {
	const parsedDate = new Date(date);
	const options = { month: "short" } as const;

	const month = parsedDate.toLocaleString("en-US", options);
	const day = parsedDate.getDate();
	const year = parsedDate.getFullYear();

	return (
		<div className="bg-white text-black rounded-xl p-2 w-20 flex flex-col items-center justify-center shadow-md scale-90">
			<span className="text-sm font-medium tracking-wider uppercase text-rose-500">
				{month}
			</span>
			<span className="text-2xl font-bold">{day}</span>
			<span className="text-xs text-gray-600">{year}</span>
		</div>
	);
}

export default DateBox;
