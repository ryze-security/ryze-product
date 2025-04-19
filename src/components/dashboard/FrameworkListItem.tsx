import React from "react";
import { Link } from "react-router-dom";

interface Props {
	id: string;
	framework: string;
	date: string;
}

function FrameworkListItem(props: Props) {
	const { id, framework, date } = props;

	return (
		<Link
			to={`/framework/${id}`}
			className="flex justify-between items-center px-4 py-3 bg-transparent text-white rounded-md hover:bg-zinc-700 hover:bg-opacity-50 hover:shadow-md transition duration-150 ease-in-out hover:cursor-pointer h-16"
		>
			<span className="font-semibold tracking-wide text-lg">{framework}</span>
			<span className="text-sm text-zinc-400">{date}</span>
		</Link>
	);
}

export default FrameworkListItem;
