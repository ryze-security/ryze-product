import FrameworkListItem from "@/components/dashboard/FrameworkListItem";
import RecentReviews from "@/components/dashboard/RecentReviews";
import SmallDisplayCard from "@/components/dashboard/SmallDisplayCard";
import TableRowWithNumber from "@/components/dashboard/TableRowWithNumber";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Building,
	CircleAlert,
	icons,
	PlusCircleIcon,
	Search,
	Table,
	TriangleAlert,
} from "lucide-react";
import { title } from "process";
import React from "react";
import { Link } from "react-router-dom";

function Index() {
	// Dummy data for recent reviews
	const vulnerablities = [
		{
			companyName: "Company A",
			score: 62,
		},
		{
			companyName: "Company B",
			score: 47,
		},
		{
			companyName: "Company C",
			score: 24,
		},
	];

	// Dummy data for frameworks
	const views = [
		{
			title: "Auditees registered",
			icon: <Building />,
			value: 106,
			percentageChange: 10,
			changeDescription: "positive",
		},
		{
			title: "Reviews conducted",
			icon: <Search />,
			value: 358,
			percentageChange: 5,
			changeDescription: "positive",
		},
		{
			title: "Deviation recorded",
			icon: <TriangleAlert />,
			value: 2434,
			percentageChange: 15,
			changeDescription: "negative",
		},
	];

	const deviations = [
		"Managing Information Security in the ICT Supply Chain",
		"Employee screening",
		"Information security in supplier relationships",
	];

	function getFormattedDateTime() {
		const now = new Date();

		const pad = (n: number) => n.toString().padStart(2, "0");

		const day = pad(now.getDate());
		const month = pad(now.getMonth() + 1); // Months are 0-indexed
		const year = now.getFullYear();

		const hours = pad(now.getHours());
		const minutes = pad(now.getMinutes());
		const seconds = pad(now.getSeconds());

		return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
	}

	return (
		<div className="font-roboto text-white w-full min-h-screen p-6">
			{/* Header */}
			<section className="flex justify-center items-center w-full bg-black text-white pb-0 pt-10 px-6 sm:px-12 lg:px-16">
				<div className="max-w-7xl w-full flex justify-between px-4">
					<div className="flex flex-col gap-2">
						{/* Left: Welcome message */}
						<h1 className="text-4xl font-semibold text-white tracking-wide">
							Welcome, Aditya!
						</h1>

						{/* Subtitle */}
						<p className="text-base text-zinc-500">{`Last logged in ${getFormattedDateTime()}`}</p>
					</div>

					{/* Right: Button */}
					<DropdownMenu>
						<DropdownMenuTrigger>
							<Button
								variant="default"
								className="bg-sky-500 rounded-2xl hover:bg-sky-600 text-white font-bold text-md"
							>
								<PlusCircleIcon />
								New
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<Link to={"/new-evaluation"}>
								<DropdownMenuItem className="font-roboto cursor-pointer">
									Evaluation
								</DropdownMenuItem>
							</Link>
							<Link to={"/auditee/new"}>
								<DropdownMenuItem className="font-roboto cursor-pointer">
									Auditee
								</DropdownMenuItem>
							</Link>
							<DropdownMenuItem className="font-roboto text-gray-light-ryzr">
								Framework
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</section>

			{/* Cards */}
			<section className="flex flex-col gap-4 justify-start bg-black text-white pt-10 px-6 sm:px-12 lg:px-16 w-[90%]">
				<div className="max-w-7xl w-full px-4 flex gap-7 justify-between">
					{views.map((view) => (
						<SmallDisplayCard
							title={view.title}
							icon={view.icon}
							value={view.value}
							percentageChange={view.percentageChange}
							changeDescription={view.changeDescription}
						/>
					))}
				</div>

				<div className="max-w-7xl items-start w-full px-4 flex gap-6 justify-between">
					{/* Card 1 */}
					<div className="flex flex-col bg-gray-ryzr rounded-xl p-6 shadow-md w-[48%] h-[330px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-light-ryzr scrollbar-track-transparent">
						<div className="flex items-center flex-grow justify-between mb-2">
							<h2 className="flex gap-2 text-xl text-gray-light-ryzr font-semibold tracking-wide pl-4">
								<Building />
								<span>Vulnerable auditees</span>
							</h2>
							<span className="text-sm text-gray-light-ryzr pr-4">
								Deviation
							</span>
						</div>
						{vulnerablities.map((vulnerability) => (
							<TableRowWithNumber
								companyName={vulnerability.companyName}
								score={vulnerability.score}
							/>
						))}
						<div className="w-full">
							<Link
								to={"/auditee/vulnerable"}
								className="flex justify-center mb-2 mt-4 sticky bottom-0 bg-transparent"
							>
								<Button
									variant="outline"
									className="w-2/3 gap-2 border-violet-ryzr hover:bg-violet-ryzr hover:text-white hover:border-violet-ryzr bg-gray-ryzr text-violet-ryzr font-bold"
								>
									View more
								</Button>
							</Link>
						</div>
					</div>

					{/* Card 2 */}
					<div className="flex flex-col bg-gray-ryzr rounded-xl p-6 shadow-md w-[48%] h-[330px]">
						<div className="flex justify-between mb-2">
							<h2 className="flex gap-2 text-xl text-gray-light-ryzr font-semibold tracking-wide pl-4">
								<TriangleAlert />
								<span>Frequent deviations</span>
							</h2>
						</div>
						<div className="flex flex-grow flex-col">
							{deviations.map((deviation, index) => (
								<DeviationRows key={index} deviation={deviation} />
							))}
						</div>
						<div className="w-full">
							<Link
								to={"/framework/deviation"}
								className="flex justify-center mb-2 mt-4"
							>
								<Button
									variant="outline"
									className="w-2/3 gap-2 border-violet-ryzr hover:bg-violet-ryzr hover:text-white hover:border-violet-ryzr bg-gray-ryzr text-violet-ryzr font-bold"
								>
									View more
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}

const DeviationRows = ({ deviation }: { deviation: string }) => {
	return (
		<div className="flex items-center gap-4 bg-transparent text-white rounded-xl p-3 w-full hover:bg-zinc-700 hover:bg-opacity-50 hover:shadow-md transition duration-150 ease-in-out hover:cursor-pointer">
			<div className="flex items-center justify-center w-1/12">
				<CircleAlert className="text-[#FBBC05]" />
			</div>
			<div className="flex flex-col justify-center w-11/12">
				<p className="text-base">{deviation}</p>
			</div>
		</div>
	);
};

export default Index;
