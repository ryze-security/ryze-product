import React, {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useState,
} from "react";
import { Card, CardContent } from "../ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
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
import {
	ArrowDownAZIcon,
	ArrowUpAZIcon,
	ArrowUpDownIcon,
	MoveLeft,
} from "lucide-react";
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
import MarkdownRenderer from "./MarkdownRenderer";
import ProgressCircle from "./ProgressCircle";
import { Progress } from "@/components/ui/progress";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

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

interface QuestionFormPagination {
	hasPreviousControl: boolean;
	hasNextControl: boolean;
}

const columns: ColumnDef<controlResponse>[] = [
	{
		accessorKey: "serial",
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
		cell: ({ row }) => {
			const score: number = row.original.Response.Score;
			return (
				<div>
					<div className="relative max-w-28">
						<Progress
							value={score == null || Number.isNaN(score) ? 0 : score as number}
							className="h-6 bg-neutral-700 rounded-full"
							indicatorColor="bg-violet-ryzr"
						/>
						<div className="absolute inset-0 flex justify-center items-center text-white text-xs font-semibold">
							{score == null || Number.isNaN(score) ? 0 : score as number}%
						</div>
					</div>
				</div>
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
				<MarkdownRenderer
					content={missing_elements}
					truncateAt={30}
					disableBoldText={true}
					// emptyState="No missing elements found"
				/>
			);
		},
	},
];

const questionColumns: ColumnDef<questionResponse>[] = [
	{
		accessorKey: "SNo",
		header: "Q.No.",
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
				<MarkdownRenderer
					content={observation}
					truncateAt={30}
					emptyState="No observation found"
				/>
			);
		},
	},
];

const getInitialState = (): {
	selectedControl: string;
	selectedQuestion: string;
} => {
	const store = {
		selectedControl: null,
		selectedQuestion: null,
	};
	if (typeof window === "undefined") return store; // Guard for server-side rendering
	const params = new URLSearchParams(window.location.search);
	const selectedControlFromUrl = params.get("controlId");
	const selectedQuestionsFromUrl = params.get("question");
	if (selectedControlFromUrl) {
		store.selectedControl = selectedControlFromUrl;
	}
	if (selectedQuestionsFromUrl) {
		store.selectedQuestion = selectedQuestionsFromUrl;
	}
	return store;
};

const DetailHome = forwardRef((props: Props, ref) => {
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
	//TODO: whole question system can be refactored to use index instead of entire question object
	const updatedQuestions: questionResponse[] = React.useMemo(() => {
		if (!selectedRow) {
			return []; // Return an empty array if no row is selected
		}
		// This logic is the same as your old useEffect
		return [...selectedRow.QuestionResponseList]
			.sort((a, b) =>
				a.q_id.localeCompare(b.q_id, undefined, { numeric: true })
			)
			.map((question, index) => ({
				...question,
				SNo: (index + 1).toString(),
				Response: {
					...question.Response,
					Score:
						question.Response.Score === "true"
							? true
							: question.Response.Score === "false"
								? false
								: null,
				},
			}));
	}, [selectedRow]);


	// State that tracks if another control section exists or not. Highly convenient for navigation in QuestionForm.
	const [questionFormPagination, setQuestionFormPagination] = useState<QuestionFormPagination>({
		hasPreviousControl: null,
		hasNextControl: null,
	});

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

	const [initialState] = useState(getInitialState);

	const [isInitialSyncCompleted, setIsInitialSyncCompleted] =
		useState<boolean>(false);

	// updated combinedControls to have the score in percentage
	const updatedControlResponseList = React.useMemo(() => {
		const updatedControls = combinedControls.map((control) => ({
			...control,
			serial: control.controlId.substring(2),
			Response: {
				...control.Response,
				Score: Math.round(control.Response.Score * 100),
			},
		}));
		return updatedControls;
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

	//This effect is used to simulate the browser history state so user can back and forward easily
	useEffect(() => {
		// This function will run when the user clicks back/forward
		const handlePopState = (event) => {
			if (event.state && event.state.selectedControl) {
				setSelectedRow(event.state.selectedControl);
			} else {
				setSelectedRow(null);
			}

			if (event.state && event.state.selectedQuestion) {
				setSelectedQuestion(event.state.selectedQuestion);
				methods.reset({
					score: event.state.selectedQuestion.Response.Score,
					observation:
						event.state.selectedQuestion.Response.Observation,
					questionId: event.state.selectedQuestion.q_id,
				});
			} else {
				setSelectedQuestion(null);
			}
		};

		window.addEventListener("popstate", handlePopState);

		// Clean up the event listener when the component unmounts
		return () => {
			window.removeEventListener("popstate", handlePopState);
		};
	}, []);

	//The effects below are used to initial load the selection from shareable link
	useEffect(() => {
		if (
			combinedControls.length === 0 ||
			!initialState.selectedControl ||
			isInitialSyncCompleted
		) {
			if (!isInitialSyncCompleted && !initialState.selectedControl) {
				setIsInitialSyncCompleted(true);
			}
			return;
		}

		const initialControl = updatedControlResponseList.find(
			(control) => control.controlId === initialState.selectedControl
		);

		if (initialControl) {
			setSelectedRow(initialControl);

			if (!initialState.selectedQuestion) {
				setIsInitialSyncCompleted(true);
			}
		} else {
			setIsInitialSyncCompleted(true);
		}
	}, [combinedControls, initialState, isInitialSyncCompleted]);

	useEffect(() => {
		if (
			isInitialSyncCompleted ||
			updatedQuestions.length === 0 ||
			!initialState.selectedQuestion ||
			!selectedRow
		) {
			return;
		}

		if (selectedRow.controlId !== initialState.selectedControl) {
			return;
		}

		const initialQuestion = updatedQuestions.find(
			(question) => question.q_id === initialState.selectedQuestion
		);

		if (initialQuestion) {
			setSelectedQuestion(initialQuestion);
			methods.reset({
				score: initialQuestion.Response.Score,
				observation: initialQuestion.Response.Observation,
				questionId: initialQuestion.q_id,
			});
			setIsInitialSyncCompleted(true);
		} else {
			setIsInitialSyncCompleted(true);
		}
	}, [updatedQuestions, initialState, selectedRow, isInitialSyncCompleted]);


	// ----------- HANDLES PREVIOUS AND NEXT CONTROL LOGIC -----------

	const goToPreviousControl = () => {
		if (!selectedRow || !updatedControlResponseList.length) return;

		const currentIndex = updatedControlResponseList.findIndex(
			control => control.controlId === selectedRow.controlId
		);

		if (currentIndex > 0) {
			setSelectedRow(updatedControlResponseList[currentIndex - 1]);
			initialState.selectedControl = updatedControlResponseList[currentIndex - 1].controlId;
			const lastQuestionFromPreviousControl = updatedControlResponseList[currentIndex - 1].QuestionResponseList.length - 1;
			setSelectedQuestion(updatedControlResponseList[currentIndex - 1].QuestionResponseList[lastQuestionFromPreviousControl]);
		}
	}

	const goToNextControl = () => {
		if (!selectedRow || !updatedControlResponseList.length) return;

		const currentIndex = updatedControlResponseList.findIndex(
			control => control.controlId === selectedRow.controlId
		);

		if (currentIndex < updatedControlResponseList.length - 1) {
			setSelectedRow(updatedControlResponseList[currentIndex + 1]);
			initialState.selectedControl = updatedControlResponseList[currentIndex + 1].controlId;
			setSelectedQuestion(updatedControlResponseList[currentIndex + 1].QuestionResponseList[0]);

		}
	};

	// Updates whenever selected row and controls change to check if there is a next control
	useEffect(() => {
		if (!selectedRow || !combinedControls.length) {
			setQuestionFormPagination({
				hasPreviousControl: null,
				hasNextControl: null,
			});
			return;
		}

		const currentIndex = combinedControls.findIndex(
			control => control.controlId === selectedRow.controlId
		);
		setQuestionFormPagination({
			hasPreviousControl: currentIndex > 0,
			hasNextControl: currentIndex < combinedControls.length - 1,
		});
	}, [selectedRow, combinedControls]);


	const handleBack = () => {
		const url = new URL(window.location.href);
		if (selectedQuestion) {
			setSelectedQuestion(null);

			url.searchParams.delete("question");
			history.pushState({ controlId: selectedRow?.controlId }, "", url);
		} else if (selectedRow) {
			setSelectedRow(null);
			setQuestionFilter("");
			setQuestionSort([]);
			setQuestionPagination({
				pageIndex: 0,
				pageSize: 10,
			});

			url.searchParams.delete("controlId");
			history.pushState({}, "", url);
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

	useImperativeHandle(ref, () => ({
		resetSelection() {
			setSelectedRow(null);
			setSelectedQuestion(null);
		},
	}));

	return (
		<div className="max-w-7xl w-full px-4">
			{/* Header */}
			{!selectedRow && (
				<>
					{/* Eval stats */}
					{/* Eval stats */}
					<div className={`flex flex-col pb-12 rounded-t-2xl bg-gradient-to-b to-black 
					${Number(overallScore) >= 75
							? 'from-[#71AE57]'
							: Number(overallScore) >= 50
								? 'from-[#FFB039]'
								: 'from-[#DA3D49]'
						}
					`}>
						<div className="p-6 pb-0 flex space-y-6 flex-col">
							{/* Controls reference Name */}
							<div className="bg-zinc-700 min-w-28 w-fit h-fit my-auto text-center p-1 px-5 rounded-sm text-white">
								{evalMetadata?.collection_display_name}
							</div>


							<div className="text-5xl sm:text-7xl font-bold mb-6 ">
								{evalMetadata?.company_display_name}
							</div>

							<div className="flex flex-col !mt-4 sm:flex-row gap-x-4 text-base sm:items-baseline text-nowrap">
								<span>
									Documents uploaded.
								</span>

								<div className="flex flex-wrap gap-2 text-base">
									<div className="min-w-28 h-fit my-auto text-center rounded-sm text-white flex flex-wrap gap-2 justify-center">
										{evalMetadata?.file_names?.slice(0, 2).map((file, i) => (
											<div
												key={i}
												className="bg-zinc-700 px-2 py-1 rounded text-white/90 truncate max-w-[300px]"
											>
												{file}
											</div>

										))}
									</div>

									{evalMetadata?.file_names?.length > 2 && (
										<HoverCard>
											{/* Trigger showing up to 2 docs as boxes */}
											<HoverCardTrigger className="min-w-28 h-fit my-auto text-center rounded-sm text-white flex">
												{/* Show +X more if additional files exist */}
												{evalMetadata?.file_names?.length > 2 && (
													<div className="bg-zinc-700 px-2 py-1 rounded text-white/80">
														+{evalMetadata.file_names.length - 2} more
													</div>
												)}
											</HoverCardTrigger>

											{/* Hover card content */}
											<HoverCardContent className="w-fit bg-transparent/50 backdrop-blur-sm">
												<div className="flex flex-col gap-2">
													{evalMetadata?.file_names?.slice(2).map((file, index) => (
														<div
															key={index}
															className="bg-zinc-700 px-2 py-1 rounded text-white/80"
														>
															{file}
														</div>
													))}
												</div>
											</HoverCardContent>
										</HoverCard>
									)}
								</div>
							</div>

							<div className="pb-4 sm:pb-0 font-bold text-4xl flex flex-col sm:flex-row max-w-fit gap-2">
								{overallScore}%.
								Overall compliance score.
							</div>
						</div>
					</div>

					{/* Evaluation Cards */}
					<div className="flex overflow-x-auto space-x-4 w-full p-4 sm:mt-2 rounded-b-2xl scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
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
				className={`flex flex-col items-center w-full bg-black text-white`}
			>
				<div className={`w-full mb-0 pb-0 flex flex-col p-6 rounded-2xl bg-gradient-to-b to-[#020506] ${selectedRow
					? selectedRow.Response?.Score >= 75
						? 'from-[#71AE57]'
						: selectedRow.Response?.Score >= 50
							? 'from-[#FFB039]'
							: 'from-[#DA3D49]'
					: ''} ${selectedRow ? 'mb-4 pb-8' : 'mb-0 pb-0'}`}>

					{selectedRow && (
						<div className="flex flex-col gap-2">
							{/* Back Button*/}
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
							</div>

							<div className="flex justify-between">
								<div className="flex sm:max-w-[85%] flex-col w-full h-fit gap-3">
									<div className="flex justify-between text-5xl font-thin tracking-wide">
										<span className="text-end">{selectedRow.serial}</span>
									</div>

									<div className="flex flex-col gap-4">
										<div className="text-2xl sm:text-4xl font-thin text-white tracking-wide">
											{selectedRow.Description}
										</div>
										<div>
											<p className="text-sm sm:text-base w-full">
												{selectedRow.control_description}
											</p>
										</div>

										<div className="flex text-4xl font-bold pb-4">
											<span>{Math.round(selectedRow.Response.Score)}%.</span>
											<span>Compliance.</span>
										</div>
									</div>


									{/* <div className="sm:w-[27%] bg-gradient-to-r rounded-md py-1 px-2 from-gray-light-ryzr/50 to-transparent ">
										{
											selectedRow.QuestionResponseList
												.length
										}{" "}
										Total Questions
									</div> */}
								</div>
							</div>
						</div>
					)}
				</div>

				{selectedQuestion ? (
					<FormProvider {...methods}>
						{updatedQuestions && updatedQuestions.length > 0 && (
							<QuestionForm
								questionData={updatedQuestions}
								questionIndex={updatedQuestions.indexOf(
									selectedQuestion
								) === -1 ? 0 : updatedQuestions.indexOf(
									selectedQuestion
								)}
								submitFn={onSubmit}
								isLoading={isQuestionUpdating}
								onNextControl={goToNextControl}
								onPreviousControl={goToPreviousControl}
								questionFormPagination={questionFormPagination}
							/>
						)}
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
										const url = new URL(
											window.location.href
										);
										if (row.q_id) {
											url.searchParams.set(
												"question",
												row.q_id
											);
										} else {
											url.searchParams.delete("question");
										}
										history.pushState(
											{
												selectedControl: selectedRow,
												selectedQuestion: row,
											},
											"",
											url
										);
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
									const url = new URL(window.location.href);
									if (row.controlId) {
										url.searchParams.set(
											"controlId",
											row.controlId
										);
									} else {
										url.searchParams.delete("controlId");
									}
									history.pushState(
										{
											selectedControl: row,
											selectedQuestion: null,
										},
										"",
										url
									);
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
});

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

	const formatHeading = (text: string) => {
		const firstSpaceIndex = text.indexOf(' ');
		if (firstSpaceIndex === -1) {
			return text;
		}
		return text.substring(0, firstSpaceIndex) + '\n' + text.substring(firstSpaceIndex + 1);
	};

	return (
		<Card
			className={`${dataInInteger >= 75
				? "bg-[#71AE57]/30"
				: dataInInteger >= 50 && dataInInteger < 75
					? "bg-[#FFB039]/30"
					: "bg-[#FF6666]/30"
				} rounded-2xl w-full max-w-60 min-w-72 cursor-pointer`}
			onClick={() => {
				stepChangefn?.(itemId);
			}}
		>
			<CardContent className="p-6 flex flex-col justify-between h-full">
				<div className="flex-grow text-3xl text-white opacity-85 font-bold leading-snug">
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<p className="line-clamp-2 whitespace-pre-wrap">
									{formatHeading(heading)}
								</p>
							</TooltipTrigger>
							<TooltipContent className="max-w-md">
								<p className="whitespace-pre-wrap">{heading}</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
				<div
					className={`text-[48px] ${dataInInteger >= 75
						? "text-[#71AE57]"
						: dataInInteger >= 50 && dataInInteger < 75
							? "text-[#FFB039]"
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
