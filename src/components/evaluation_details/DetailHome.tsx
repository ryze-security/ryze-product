import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import {
	controlResponse,
	domainResponse,
	evaluationMetadata,
	questionResponse,
} from "@/models/evaluation/EvaluationDTOs";
import {
	ColumnDef,
	PaginationState,
	SortingState,
} from "@tanstack/react-table";
import { ProgressBarDataTable } from "../ProgressBarDataTable";
import { Button } from "../ui/button";
import { ArrowDownAZIcon, ArrowUpAZIcon, ArrowUpDownIcon, MoveLeft } from "lucide-react";
import QuestionForm from "./QuestionForm";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "../ui/hover-card";
import { Separator } from "../ui/separator";
import { FormProvider, useForm } from "react-hook-form";
import { RoundSpinner } from "../ui/spinner";
import { AlertDialogBox } from "../AlertDialogBox";

interface Props {
	overallScore: string;
	domainDataMap: Record<string, domainResponse>;
	stepChangefn: (stepId: number) => void;
	evalMetadata: evaluationMetadata;
	questionUpdatefn: (
		observation: string,
		score: boolean,
		questionId: string
	) => Promise<void>;
}

interface CardData {
	id: string;
	heading: string;
	data: string;
}

interface QuestionFormFields {
	observation: string;
	score: boolean | string;
	questionId: string;
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
					{column.getIsSorted() === "asc" ? (
						<ArrowDownAZIcon className="h-4 w-4" />
					) : column.getIsSorted() === "desc" ? (
						<ArrowUpAZIcon className="h-4 w-4" />
					) : (
						<ArrowUpDownIcon className="h-4 w-4" />
					)}
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
					{column.getIsSorted() === "asc" ? (
						<ArrowDownAZIcon className="h-4 w-4" />
					) : column.getIsSorted() === "desc" ? (
						<ArrowUpAZIcon className="h-4 w-4" />
					) : (
						<ArrowUpDownIcon className="h-4 w-4" />
					)}
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
					{column.getIsSorted() === "asc" ? (
						<ArrowDownAZIcon className="h-4 w-4" />
					) : column.getIsSorted() === "desc" ? (
						<ArrowUpAZIcon className="h-4 w-4" />
					) : (
						<ArrowUpDownIcon className="h-4 w-4" />
					)}
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
					{observation.split(" ").length > 30 ? (
						<HoverCard>
							<HoverCardTrigger className="text-left">
								<span>
									{observation
										.split(" ")
										.slice(0, 30)
										.join(" ")}
									{observation.split(" ").length > 30 &&
										"..."}
								</span>
							</HoverCardTrigger>
							<HoverCardContent className="bg-gray-ryzr">
								<span className="w-20 ">{observation}</span>
							</HoverCardContent>
						</HoverCard>
					) : (
						observation
					)}
				</span>
			);
		},
	},
];

function DetailHome(props: Props) {
	const {
		overallScore,
		domainDataMap,
		stepChangefn,
		evalMetadata,
		questionUpdatefn,
	} = props;
	const methods = useForm<QuestionFormFields>({
		defaultValues: {
			score: false,
			observation: "",
			questionId: "",
		},
	});

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

	const [controlSort, setControlSort] = useState<SortingState>([]);
	const [controlFilter, setControlFilter] = useState<string>("");

	const [questionSort, setQuestionSort] = useState<SortingState>([]);
	const [questionFilter, setQuestionFilter] = useState<string>("");

	const [controlPagination, setControlPagination] = useState<PaginationState>(
		{
			pageIndex: 0,
			pageSize: 10,
		}
	);
	const [questionPagination, setQuestionPagination] =
		useState<PaginationState>({
			pageIndex: 0,
			pageSize: 10,
		});

	const [isQuestionUpdating, setIsQuestionUpdating] =
		useState<boolean>(false);

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

	// used to update the selected row when the combined controls change after a redux refresh
	useEffect(() => {
		if (selectedRow) {
			const updatedControl = updatedControlResponseList.find(
				(control) => control.controlId === selectedRow.controlId
			);

			if (updatedControl) {
				setSelectedRow(updatedControl); // this triggers your `updatedQuestions` effect
			}
		}
	}, [updatedControlResponseList]);

	// used to update the selected question when the updatedQuestions change after a redux refresh
	useEffect(() => {
		if (selectedQuestion) {
			const updatedQuestion = updatedQuestions.find(
				(question) => question.q_id === selectedQuestion.q_id
			);
			if (updatedQuestion) {
				setSelectedQuestion(updatedQuestion);
				methods.reset({
					score: updatedQuestion.Response.Score,
					observation: updatedQuestion.Response.Observation,
					questionId: updatedQuestion.q_id,
				});
			}
		}
	}, [updatedQuestions]);

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
			setQuestionFilter("");
			setQuestionSort([]);
			setQuestionPagination({
				pageIndex: 0,
				pageSize: 10,
			});
		}
	};

	const onSubmit = async (data: any) => {
		setIsQuestionUpdating(true);
		const { observation, score, questionId } = data;
		if (selectedQuestion) {
			const updatedQuestion = updatedQuestions.find(
				(question) => question.q_id === questionId
			);
			if (updatedQuestion) {
				setSelectedQuestion(updatedQuestion);
			}
		}
		await questionUpdatefn(observation, score, questionId);
		setIsQuestionUpdating(false);
	};

	return (
		<div className="max-w-7xl w-full px-4">
			{/* Header */}
			{!selectedRow && (
				<>
					{/* Eval stats */}
					<div className="flex w-full justify-between mb-5">
						<div className="flex w-full justify-between">
							{/* <div className="flex justify-start gap-4 mb-6">
								<h3 className="text-lg font-semibold my-auto text-zinc-600">
									Review.
								</h3>
								<div className="bg-zinc-800 min-w-28 text-center p-1 px-5 rounded-sm text-white">
									Title
								</div>
							</div> */}
							<div className="flex justify-start gap-4 mb-6 w-fit">
								<h3 className="text-lg font-semibold my-auto text-zinc-600">
									Auditee.
								</h3>
								<div className="bg-zinc-800 min-w-28 h-fit my-auto text-center p-1 px-5 rounded-sm text-white">
									{evalMetadata?.company_display_name}
								</div>
							</div>
							<div className="flex justify-start gap-4 mb-6">
								<h3 className="text-lg font-semibold my-auto text-zinc-600">
									Control reference.
								</h3>
								<div className="bg-zinc-800 min-w-28 h-fit my-auto text-center p-1 px-5 rounded-sm text-white">
									{evalMetadata?.collection_display_name}
								</div>
							</div>
							<div className="flex justify-start gap-4 mb-6">
								<h3 className="text-lg font-semibold my-auto text-zinc-600">
									Documents uploaded.
								</h3>
								<HoverCard>
									<HoverCardTrigger className="bg-zinc-800 min-w-28 h-fit my-auto text-center p-1 px-5 rounded-sm text-white">
										{evalMetadata?.file_names[0]}{" "}
										{evalMetadata?.file_names.length > 2
											? `and ${
													evalMetadata?.file_names
														.length - 1
											  } more`
											: ""}
									</HoverCardTrigger>
									<HoverCardContent className="w-fit">
										{evalMetadata?.file_names.map(
											(file, index) => (
												<div key={index}>
													<div className="text-sm text-white/80 w-fit">
														{file}
													</div>
													<Separator className="my-2" />
												</div>
											)
										)}
									</HoverCardContent>
								</HoverCard>
							</div>
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
							{/* Back Button and update button */}
							<div className="flex gap-2">
								<div className="mb-4">
									{selectedQuestion &&
									methods.formState.isDirty ? (
										<AlertDialogBox
											trigger={
												<Button
													disabled={
														isQuestionUpdating
													}
													className="rounded-full bg-zinc-700 hover:bg-zinc-800 transition-colors text-white p-2 w-20"
												>
													<MoveLeft
														style={{
															width: "28px",
															height: "28px",
														}}
													/>
												</Button>
											}
											subheading="You have unsaved changes on this page! Clicking confirm will remove any unsaved changes."
											actionLabel="Confirm"
											onAction={handleBack}
										/>
									) : (
										<Button
											onClick={handleBack}
											disabled={isQuestionUpdating}
											className="rounded-full bg-zinc-700 hover:bg-zinc-800 transition-colors text-white p-2 w-20"
										>
											<MoveLeft
												style={{
													width: "28px",
													height: "28px",
												}}
											/>
										</Button>
									)}
								</div>
								{selectedQuestion &&
									methods.formState.isDirty && (
										<div className="mb-4">
											<AlertDialogBox
												trigger={
													<Button
														className="rounded-full bg-sky-500 hover:bg-sky-600 transition-colors text-white p-2 w-20"
														disabled={
															isQuestionUpdating
														}
													>
														{isQuestionUpdating ? (
															<RoundSpinner />
														) : (
															<span className="font-bold text-white">
																Update
															</span>
														)}
													</Button>
												}
												subheading="Are you sure you want to save the changes to this question? Confirming will permanently update the evaluation record."
												onAction={methods.handleSubmit(
													onSubmit
												)}
												actionLabel="Confirm"
											/>
										</div>
									)}
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
					<FormProvider {...methods}>
						<QuestionForm
							questionData={updatedQuestions}
							questionIndex={updatedQuestions.indexOf(
								selectedQuestion
							)}
						/>
					</FormProvider>
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
										methods.reset({
											score: row.Response.Score,
											observation:
												row.Response.Observation,
											questionId: row.q_id,
										});
									}}
									externalFilter={questionFilter}
									setExternalFilter={setQuestionFilter}
									externalSorting={questionSort}
									setExternalSorting={setQuestionSort}
									externalPagination={questionPagination}
									setExternalPagination={
										setQuestionPagination
									}
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
								externalFilter={controlFilter}
								setExternalFilter={setControlFilter}
								externalSorting={controlSort}
								setExternalSorting={setControlSort}
								externalPagination={controlPagination}
								setExternalPagination={setControlPagination}
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
	const dataInInteger = parseInt(data);
	return (
		<Card
			className={`${
				dataInInteger >= 75
					? "bg-[#71AE57]/30"
					: dataInInteger >= 50 && dataInInteger < 75
					? "bg-[#FFB266]/30"
					: "bg-[#FF6666]/30"
			} rounded-2xl max-h-52 max-w-60 min-h-48 min-w-72 cursor-pointer`}
			onClick={() => {
				stepChangefn?.(itemId);
			}}
		>
			<CardContent className="p-6 flex flex-col justify-between h-full">
				<div className="flex-grow text-2xl text-white opacity-85 font-bold leading-snug whitespace-pre-wrap break-words">
					{heading.split(" ").join("\n")}
				</div>
				<div
					className={`text-[48px] ${
						dataInInteger >= 75
							? "text-[#71AE57]"
							: dataInInteger >= 50 && dataInInteger < 75
							? "text-[#FFB266]"
							: "text-[#FF6666]"
					} mt-auto font-semibold`}
				>
					{data}
				</div>
			</CardContent>
		</Card>
	);
};

export default DetailHome;
