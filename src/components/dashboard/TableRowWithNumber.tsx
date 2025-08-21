import React from "react";
import DateBox from "./DateBox";
import { Progress } from "../ui/progress";
import { Building } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
	companyName: string;
	score: number; // 0 to 100
	icon?: React.ReactNode;
	link?: string;
}

function TableRowWithNumber(props: Props) {
	const { companyName, score, icon, link } = props;
	const navigate = useNavigate();

	return (
		<div
			className="flex items-center gap-6 bg-transparent text-white rounded-xl p-4 w-full hover:bg-zinc-700 hover:bg-opacity-50 hover:shadow-md transition duration-150 ease-in-out hover:cursor-pointer"
			onClick={() => link && navigate(`/auditee/edit/${link}`)}
		>
			{/* Icon - left aligned, if provided */}
			<div className="flex items-center justify-center w-1/12">
				{icon ? (
					<div className="text-[#404040]">{icon}</div>
				) : (
					<Building className="text-[#404040]" />
				)}
			</div>

			<div className="flex flex-col justify-center w-1/2">
				<p className="text-base tracking-wider">{companyName}</p>
			</div>

			{/* Score Bar - pushed to the right */}
			<div className="flex justify-end ml-auto max-w-20">
				<div className="rounded-full text-center flex items-center justify-center min-w-[62px] h-[26px] w-fit bg-[#404040]">
					{score}
				</div>
			</div>
		</div>
	);
}

export default TableRowWithNumber;
