import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import {
	controlResponse,
	domainResponse,
	questionResponse,
} from "@/models/evaluation/EvaluationDTOs";
import { ColumnDef } from "@tanstack/react-table";
import { ProgressBarDataTable } from "../ProgressBarDataTable";
import { Button } from "../ui/button";
import {
	ArrowBigLeftDash,
	ArrowDown,
	ArrowLeft,
	ArrowUpDown,
	MoveLeft,
} from "lucide-react";
import QuestionForm from "./QuestionForm";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "../ui/hover-card";

interface Props {
	overallScore: string;
	domainDataMap: Record<string, domainResponse>;
	stepChangefn: (stepId: number) => void;
}

interface CardData {
	id: string;
	heading: string;
	data: string;
}

const columns: ColumnDef<controlResponse>[] = [
	{
		accessorKey: "controlId",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
					className="p-0 hover:bg-transparent hover:text-white/70 text-base"
				>
					Control Id
					<ArrowUpDown className="h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "Description",
		header: "Control Title",
	},
	{
		accessorKey: "Response.Score",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
					className="p-0 hover:bg-transparent hover:text-white/70 text-base"
				>
					Control Score
					<ArrowUpDown className="h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "missing_elements",
		header: "Missing elements",
		cell: ({ row }) => {
			const missing_elements: string = row.original.missing_elements;
			const compliance: number = row.original.Response.Score;
			return (
				<span className="text-wrap">
					{compliance === 100 ? (
						<span>No missing elements</span>
					) : missing_elements.split(" ").length > 30 ? (
						<HoverCard>
							<HoverCardTrigger className="text-left">
								<span>
									{missing_elements
										.split(" ")
										.slice(0, 30)
										.join(" ")}
									{missing_elements.split(" ").length > 30 &&
										"..."}
								</span>
							</HoverCardTrigger>
							<HoverCardContent className="bg-gray-ryzr">
								<span className="w-20 ">
									{missing_elements}
								</span>
							</HoverCardContent>
						</HoverCard>
					) : (
						missing_elements
					)}
				</span>
			);
		},
	},
];

const questionColumns: ColumnDef<questionResponse>[] = [
	{
		accessorKey: "SNo",
		header: "SNo",
	},
	{
		accessorKey: "question",
		header: "Control Check",
	},
	{
		accessorKey: "Response.Score",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
					className="p-0 hover:bg-transparent hover:text-white/70 text-base"
				>
					Compliance
					<ArrowUpDown className="h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "Response.Observation",
		header: "Observation",
		cell: ({ row }) => {
			const observation: string = row.original.Response.Observation;
			return (
				<span className="text-wrap">
					{observation.split(" ").slice(0, 30).join(" ")}
					{observation.split(" ").length > 30 && "..."}
				</span>
			);
		},
	},
];

function DetailHome(props: Props) {
	const { overallScore, domainDataMap, stepChangefn } = props;

	const [cardData, setCardData] = useState<CardData[]>([]);
	const [combinedControls, setCombinedControls] = useState<controlResponse[]>(
		[]
	);
	const [selectedRow, setSelectedRow] = useState<controlResponse>(null);
	const [selectedQuestion, setSelectedQuestion] =
		useState<questionResponse>(null);
	const [updatedQuestions, setUpdatedQuestions] = React.useState<
		questionResponse[]
	>([]);

	// updated combinedControls to have the score in percentage
	const updatedControlResponseList = React.useMemo(() => {
		return combinedControls.map((control) => ({
			...control,
			Response: {
				...control.Response,
				Score: Math.round(control.Response.Score * 100),
			},
		}));
	}, [combinedControls]);

	// This effect is used to set the combined controls when the domain data map changes
	useEffect(() => {
		const newCombinedControls: controlResponse[] = [];

		for (const domainId in domainDataMap) {
			const domain = domainDataMap[domainId];
			for (const control of domain.ControlResponseList) {
				newCombinedControls.push(control);
			}
		}

		setCombinedControls(newCombinedControls);
	}, [domainDataMap]);

	// This effect is used to convert the score to a boolean
	// and to set the SNo for each question
	useEffect(() => {
		if (selectedRow) {
			const updatedQuestionResponseList =
				selectedRow.QuestionResponseList.map((question, index) => {
					const updatedQuestion = {
						...question,
						SNo: (index + 1).toString(),
						Response: {
							...question.Response,
							Score:
								question.Response.Score === "true"
									? true
									: false,
						},
					};
					return updatedQuestion;
				});
			setUpdatedQuestions(updatedQuestionResponseList);
		}
	}, [selectedRow]);

	useEffect(() => {
		const newCardData: CardData[] = [];

		for (const domainId in domainDataMap) {
			const domain = domainDataMap[domainId];
			newCardData.push({
				id: domainId,
				heading: domain.Description,
				data: `${Math.round(domain.Response.Score * 100).toString()}%`,
			});
		}

		setCardData(newCardData);
	}, [domainDataMap]);

	const handleBack = () => {
		if (selectedQuestion) {
			setSelectedQuestion(null);
		} else if (selectedRow) {
			setSelectedRow(null);
		}
	};

	return (
		<div className="max-w-7xl w-full px-4">
			{/* Header */}
			{!selectedRow && (
				<>
					{/* Eval stats */}
					<div className="flex w-full justify-between mb-5">
						<div className="grid grid-cols-2 grid-rows-2 max-w-fit gap-1">
							<div className="flex justify-start gap-4 mb-6">
								<h3 className="text-lg font-semibold my-auto text-zinc-600">
									Review.
								</h3>
								<div className="bg-zinc-800 min-w-28 text-center p-1 px-5 rounded-sm text-white">
									Title
								</div>
							</div>
							<div className="flex justify-start gap-4 mb-6">
								<h3 className="text-lg font-semibold my-auto text-zinc-600">
									Auditee.
								</h3>
								<div className="bg-zinc-800 min-w-28 text-center p-1 px-5 rounded-sm text-white">
									Auditee Name
								</div>
							</div>
							<div className="flex justify-start gap-4 mb-6">
								<h3 className="text-lg font-semibold my-auto text-zinc-600">
									Control reference.
								</h3>
								<div className="bg-zinc-800 min-w-28 text-center p-1 px-5 rounded-sm text-white">
									ISO 27001
								</div>
							</div>
							<div className="flex justify-start gap-4 mb-6">
								<h3 className="text-lg font-semibold my-auto text-zinc-600">
									Documents uploaded.
								</h3>
								<div className="bg-zinc-800 min-w-28 text-center p-1 px-5 rounded-sm text-white">
									SOC 2 Type 2 report
								</div>
							</div>
						</div>
						<div>
							<DropdownMenu>
								<DropdownMenuTrigger
									className={` bg-sky-500 hover:bg-sky-600 rounded-2xl transition-colors text-white font-bold text-md px-4 py-2 flex items-center gap-2`}
								>
									Generate <ArrowDown className="w-4 h-4" />
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DropdownMenuItem>
										Report(.pdf)
									</DropdownMenuItem>
									<DropdownMenuItem>
										Exec. summary(.pptx)
									</DropdownMenuItem>
									<DropdownMenuItem>
										Policy statements(.docx)
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
					<div className="flex max-w-fit gap-2">
						<div className="text-[50px] font-semibold text-violet-ryzr tracking-wide">
							{overallScore}%.
						</div>
						<div className="text-[50px] font-semibold text-zinc-400 opacity-85 tracking-wide">
							Overall compliance score.
						</div>
					</div>
					{/* Evaluation Cards */}
					<div className="flex flex-wrap gap-4 w-fit mt-10">
						{cardData.map((item, index) => (
							<InfoCard
								key={item.id}
								heading={item.heading}
								data={item.data}
								stepChangefn={stepChangefn}
								itemId={index + 1}
							/>
						))}
					</div>
				</>
			)}

			{/* Full Data Data table */}
			<section
				className={`flex flex-col items-center w-full bg-black text-white ${
					selectedRow ? "" : "mt-8 pt-4"
				}`}
			>
				<div className="w-full mb-8 px-4">
					{selectedRow && (
						<div className="flex flex-col gap-2">
							{/* Back Button */}
							<div className="mb-4">
								<Button
									onClick={handleBack}
									className="rounded-full bg-zinc-700 hover:bg-zinc-800 transition-colors text-white p-2 w-20"
								>
									<MoveLeft
										style={{
											width: "28px",
											height: "28px",
										}}
									/>
								</Button>
							</div>
							<div className="flex justify-between">
								<div className="flex max-w-fit gap-2">
									<div className="text-4xl font-semibold text-zinc-400 opacity-85 tracking-wide">
										{selectedRow.controlId}
									</div>
									<div className="flex flex-col gap-2">
										<div className="text-4xl font-semibold text-white tracking-wide">
											{selectedRow.Description}
										</div>
										<div>
											<p className="text-base w-10/12 text-gray-light-ryzr">
												{
													selectedRow.control_description
												}
											</p>
										</div>
									</div>
								</div>

								<div className="min-w-[104px] h-[101px] bg-violet-ryzr rounded-lg flex flex-col justify-center align-middle items-center">
									<h1 className="text-4xl font-semibold text-white">
										{selectedRow.Response.Score}%
									</h1>
									<p className="text-sm">Compliance</p>
								</div>
							</div>
						</div>
					)}
				</div>
				{selectedQuestion ? (
					<QuestionForm
						questionData={updatedQuestions}
						questionIndex={updatedQuestions.indexOf(
							selectedQuestion
						)}
					/>
				) : (
					<>
						{selectedRow ? (
							<div className="w-full">
								{/* Detail Data Table */}
								<ProgressBarDataTable
									columns={questionColumns}
									data={updatedQuestions}
									filterKey="question"
									isLoading={false}
									onRowClick={(row) => {
										setSelectedQuestion(row);
									}}
								/>
							</div>
						) : (
							<ProgressBarDataTable
								columns={columns}
								data={updatedControlResponseList}
								filterKey="controlId"
								onRowClick={(row) => {
									setSelectedRow(row);
								}}
							/>
						)}
					</>
				)}
			</section>
		</div>
	);
}

const InfoCard = ({
	heading,
	data,
	stepChangefn,
	itemId,
}: {
	itemId: number;
	heading: string;
	data: string;
	stepChangefn?: (stepId: number) => void;
}) => {
	return (
		<Card
			className="bg-zinc-900 rounded-2xl max-h-48 max-w-60 min-h-48 min-w-72 cursor-pointer"
			onClick={() => {
				stepChangefn(itemId);
			}}
		>
			<CardContent className="p-6 flex flex-col justify-between gap-2 h-full">
				<div className="flex flex-wrap text-3xl text-zinc-400 opacity-85 font-bold tracking-wider">
					{heading}
				</div>
				<div className="text-[48px] text-white font-semibold">
					{data}
				</div>
			</CardContent>
		</Card>
	);
};

export default DetailHome;
