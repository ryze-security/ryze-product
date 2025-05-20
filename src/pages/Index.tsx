import FrameworkListItem from "@/components/dashboard/FrameworkListItem";
import RecentReviews from "@/components/dashboard/RecentReviews";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlusCircleIcon } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

function Index() {
	// Dummy data for recent reviews
	const recentReviews = [
		{
			companyName: "Company A",
			framework: "ISO 27001",
			score: 85,
			date: "2025-04-15",
		},
		{
			companyName: "Company B",
			framework: "NIST CSF",
			score: 60,
			date: "2025-03-10",
		},
		{
			companyName: "Company C",
			framework: "Internal",
			score: 90,
			date: "2025-01-15",
		},
	];

	// Dummy data for frameworks
	const frameworks = [
		{
			id: "1",
			framework: "ISO 27001",
			date: "2025-04-15",
		},
		{
			id: "2",
			framework: "NIST CSF",
			date: "2025-03-10",
		},
		{
			id: "3",
			framework: "Internal",
			date: "2025-01-15",
		},
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
								<DropdownMenuItem className="font-roboto">
									Auditee
								</DropdownMenuItem>
							</Link>
							<DropdownMenuItem className="font-roboto">
								Framework
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</section>

			{/* Cards */}
			<section className="flex justify-center items-center w-full bg-black text-white pt-10 px-6 sm:px-12 lg:px-16">
				<div className="max-w-7xl w-full px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Card 1 */}
					<div className="bg-zinc-900 rounded-xl p-6 text-white shadow-md">
						<div className="flex items-center justify-between mb-2">
							<h2 className="text-[26px] font-semibold tracking-wide pl-4">
								Recent reviews
							</h2>
							<span className="text-sm text-zinc-400 pr-4">
								Compliance
							</span>
						</div>
						{recentReviews.map((review) => (
							<RecentReviews
								companyName={review.companyName}
								framework={review.framework}
								score={review.score}
								date={review.date}
							/>
						))}
						<div className="flex justify-center mb-2 mt-4">
							<Button
								variant="outline"
								className="w-2/3 gap-2 border-violet-ryzr hover:bg-violet-ryzr hover:text-white hover:border-violet-ryzr bg-transparent text-violet-ryzr font-bold"
							>
								View reviews
							</Button>
						</div>
					</div>

					{/* Card 2 */}
					{/* <div className="bg-zinc-900 rounded-xl p-6 text-white shadow-md">
						<div className="flex items-center justify-between mb-2">
							<h2 className="text-xl font-semibold tracking-wide pl-4">
								Frameworks available
							</h2>
							<span className="text-sm text-zinc-400 pr-4">
								Last updated
							</span>
						</div>
						{frameworks.map((framework) => (
							<FrameworkListItem
								id={framework.id}
								framework={framework.framework}
								date={framework.date}
							/>
						))}
						<div className="flex justify-center mb-2 mt-4">
							<Button
								variant="outline"
								className="w-2/3 gap-2 border-violet-600 hover:bg-violet-600 hover:text-white hover:border-violet-600 bg-transparent text-violet-400 font-bold"
							>
								View All Frameworks
							</Button>
						</div>
					</div> */}
				</div>
			</section>
		</div>
	);
}

export default Index;
