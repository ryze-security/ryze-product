import {
	controlResponse,
	domainResponse,
	questionResponse,
} from "@/models/evaluation/EvaluationDTOs";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ProgressBarDataTable } from "../ProgressBarDataTable";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowBigLeftDash, ArrowUpDown, MoveLeft } from "lucide-react";
import QuestionForm from "./QuestionForm";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "../ui/hover-card";

interface Props {
	domainData: domainResponse;
	currentPage: number;
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
	},
];

function DomainDetail(props: Props) {
	const { domainData, currentPage } = props;
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [selectedRow, setSelectedRow] = useState<controlResponse>(null);
	const [updatedData, setUpdatedData] = useState<domainResponse>(domainData);
	const [updatedQuestions, setUpdatedQuestions] = useState<
		questionResponse[]
	>([]);
	const [selectedQuestion, setSelectedQuestion] =
		useState<questionResponse>(null);

	// This effect is used to convert the score to a percentage
	useEffect(() => {
		setIsLoading(true);
		const updatedControlResponseList = domainData.ControlResponseList.map(
			(control) => {
				const updatedControl = {
					...control,
					Response: {
						...control.Response,
						Score: Math.round(control.Response.Score * 100),
					},
				};
				return updatedControl;
			}
		);
		const updatedDomainData = {
			...domainData,
			ControlResponseList: updatedControlResponseList,
		};
		setUpdatedData(updatedDomainData);
		setIsLoading(false);
	}, [domainData]);

	// This effect is used to handle the back button when page changes
	useEffect(() => {
		handleBack();
	}, [currentPage]);

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

	const handleBack = () => {
		if (selectedQuestion) {
			setSelectedQuestion(null);
		} else if (selectedRow) {
			setSelectedRow(null);
		}
	};

	return (
		<div className="max-w-7xl w-full">
			{/* Header section */}
			<div className="w-full px-4">
				{/* Heading */}
				{selectedRow ? (
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
											{selectedRow.control_description}
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
				) : (
					<div className="flex max-w-fit gap-2">
						<div className="text-5xl font-semibold text-violet-ryzr tracking-wide">
							{Math.round(
								domainData.Response.Score * 100
							).toString()}
							%.
						</div>
						<div className="text-5xl font-semibold text-zinc-400 opacity-85 tracking-wide">
							{`Alignment with ${domainData.Description.toLowerCase()}.`}
						</div>
					</div>
				)}

				{/* Export button */}
				{/* <Button
					variant="default"
					className={`rounded-2xl bg-sky-500 hover:bg-sky-600 transition-colors text-white font-bold text-md`}
				>
					{isLoading ? <RoundSpinner /> : buttonText}
					Export
				</Button> */}
			</div>
			<section className="flex items-center w-full bg-black text-white mt-8 pt-4">
				{selectedQuestion ? (
					<QuestionForm
						questionData={updatedQuestions}
						questionIndex={updatedQuestions.indexOf(
							selectedQuestion
						)}
					/>
				) : selectedRow ? (
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
						data={updatedData.ControlResponseList}
						filterKey="Description"
						isLoading={isLoading}
						onRowClick={(row) => {
							setSelectedRow(row);
						}}
					/>
				)}
			</section>
		</div>
	);
}

export default DomainDetail;
