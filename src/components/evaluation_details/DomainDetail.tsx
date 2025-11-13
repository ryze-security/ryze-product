import {
	controlResponse,
	domainResponse,
	questionResponse,
} from "@/models/evaluation/EvaluationDTOs";
import React, {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useState,
} from "react";
import { Button } from "../ui/button";
import { ProgressBarDataTable } from "../ProgressBarDataTable";
import {
	ColumnDef,
	PaginationState,
	SortingState,
} from "@tanstack/react-table";
import {
	ArrowDownAZIcon,
	ArrowUpAZIcon,
	ArrowUpDownIcon,
	MoveLeft,
} from "lucide-react";
import QuestionForm from "./QuestionForm";
import { FormProvider, useForm } from "react-hook-form";
import { AlertDialogBox } from "../AlertDialogBox";
import { RoundSpinner } from "../ui/spinner";
import MarkdownRenderer from "./MarkdownRenderer";
import ProgressCircle from "./ProgressCircle";
import { Progress } from "../ui/progress";

interface Props {
	domainData: domainResponse;
	currentPage: number;
	questionUpdatefn: (
		observation: string,
		score: boolean,
		questionId: string
	) => Promise<void>;
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
					content={compliance == 100 ? null : missing_elements}
					// content={missing_elements}
					truncateAt={30}
					emptyState="No missing elements found"
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

const DomainDetail = forwardRef((props: Props, ref) => {
	const { domainData, currentPage, questionUpdatefn } = props;
	const methods = useForm<QuestionFormFields>({
		defaultValues: {
			score: false,
			observation: "",
			questionId: "",
		},
	});

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [selectedRow, setSelectedRow] = useState<controlResponse>(null);
	const [updatedData, setUpdatedData] = useState<domainResponse>(domainData);
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
	const [selectedQuestion, setSelectedQuestion] =
		useState<questionResponse>(null);

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

	// This effect is used to convert the score to a percentage
	useEffect(() => {
		setIsLoading(true);
		const updatedControlResponseList = domainData.ControlResponseList.map(
			(control) => {
				const updatedControl = {
					...control,
					serial: control.controlId.substring(2),
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

	useEffect(() => {
		if (selectedRow) {
			const updatedControl = updatedData.ControlResponseList.find(
				(control) => control.controlId === selectedRow.controlId
			);

			if (updatedControl) {
				setSelectedRow(updatedControl); // this triggers your `updatedQuestions` effect
			}
		}
	}, [updatedData.ControlResponseList]);

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


	// ----------- HANDLES PREVIOUS AND NEXT CONTROL LOGIC -----------

	const goToPreviousControl = () => {
		if (!selectedRow || !updatedData.ControlResponseList.length) return;

		const currentIndex = updatedData.ControlResponseList.findIndex(
			control => control.controlId === selectedRow.controlId
		);

		if (currentIndex > 0) {
			setSelectedRow(updatedData.ControlResponseList[currentIndex - 1]);
			// initialState.selectedControl = updatedData.ControlResponseList[currentIndex - 1].controlId;
			const lastQuestionFromPreviousControl = updatedData.ControlResponseList[currentIndex - 1].QuestionResponseList.length - 1;
			setSelectedQuestion(updatedData.ControlResponseList[currentIndex - 1].QuestionResponseList[lastQuestionFromPreviousControl]);
		}
	}

	const goToNextControl = () => {
		if (!selectedRow || !updatedData.ControlResponseList.length) return;

		const currentIndex = updatedData.ControlResponseList.findIndex(
			control => control.controlId === selectedRow.controlId
		);

		if (currentIndex < updatedData.ControlResponseList.length - 1) {
			setSelectedRow(updatedData.ControlResponseList[currentIndex + 1]);
			// initialState.selectedControl = updatedData.ControlResponseList[currentIndex + 1].controlId;
			setSelectedQuestion(updatedData.ControlResponseList[currentIndex + 1].QuestionResponseList[0]);

		}
	};

	// Updates whenever selected row and controls change to check if there is a next control
	useEffect(() => {
		if (!selectedRow || !updatedData.ControlResponseList.length) {
			setQuestionFormPagination({
				hasPreviousControl: null,
				hasNextControl: null,
			});
			return;
		}

		const currentIndex = updatedData.ControlResponseList.findIndex(
			control => control.controlId === selectedRow.controlId
		);
		setQuestionFormPagination({
			hasPreviousControl: currentIndex > 0,
			hasNextControl: currentIndex < updatedData.ControlResponseList.length - 1,
		});
	}, [selectedRow, updatedData.ControlResponseList]);





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

	useImperativeHandle(ref, () => ({
		resetSelection() {
			setSelectedRow(null);
			setSelectedQuestion(null);
		},
	}));

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
			{/* Header section */}
			{/* If row is selected then show row color else show domain color */}
			<div className={`w-full mb-4 pb-8 flex flex-col p-6 rounded-2xl bg-gradient-to-b to-[#020506] ${selectedRow
				? selectedRow.Response?.Score >= 75
					? 'from-[#71AE57]'
					: selectedRow.Response?.Score >= 50
						? 'from-[#FFB039]'
						: 'from-[#DA3D49]'
				: Math.round(domainData.Response.Score * 100) >= 75
					? 'from-[#71AE57] mb-0'
					: Math.round(domainData.Response.Score * 100) >= 50
						? 'from-[#FFB039] mb-0'
						: 'from-[#DA3D49] mb-0'
				}

					`}>
				{/* Heading */}
				{selectedRow ? (
					<div className="flex flex-col gap-2">
						{/* Back Button and update button */}
						<div className="flex gap-2">
							<div className="mb-4">
								{selectedQuestion &&
									methods.formState.isDirty ? (
									<AlertDialogBox
										trigger={
											<Button
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
							<div className="flex sm:max-w-[85%] flex-col w-full h-fit gap-5">
								<div className="flex justify-between text-5xl font-extralight  tracking-wide">
									<span className="text-end">{selectedRow.serial}</span>
								</div>

								<div className="flex flex-col gap-4">
									<div className="text-2xl sm:text-4xl font-extralight text-white tracking-wide">
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
				) : (
					<>
						<div className="flex flex-col max-w-fit gap-2">
							<span className="text-6xl font-semibold">
								{Math.round(domainData.Response.Score * 100).toString()}%.
							</span>
							<span className="text-4xl font-thin">
								{domainData.domainId.includes("nist")}


								{`Alignment with ${domainData.domainId.toLowerCase().includes("nist") ?
									domainData.Description
									: domainData.Description.toLowerCase().includes('pii')
										? domainData.Description.replace(/pii/gi, 'PII')
											.replace(/\bcontrollers\b/g, 'controller')
											.replace(/\bprocessors\b/g, 'processor')
										: domainData.Description.toLowerCase()
									}.`}
							</span>
						</div>
					</>
				)}

				{/* Export button */}
				{/* <Button
					variant="default"
					className={`rounded-2xl bg-neutral-800 hover:bg-neutral-700 transition-colors text-white font-bold text-md`}
				>
					{isLoading ? <RoundSpinner /> : buttonText}
					Export
				</Button> */}
			</div>
			<section className="flex items-center w-full bg-black text-white mt-8 pt-4">
				{selectedQuestion ? (
					<FormProvider {...methods}>
						{updatedQuestions && updatedQuestions.length > 0 && (
							<QuestionForm
								questionData={updatedQuestions}
								questionIndex={updatedQuestions.indexOf(
									selectedQuestion
								)}
								submitFn={onSubmit}
								isLoading={isQuestionUpdating}
								onPreviousControl={goToPreviousControl}
								onNextControl={goToNextControl}
								questionFormPagination={questionFormPagination}
							/>
						)}
					</FormProvider>
				) : selectedRow ? (
					<div className="w-full">
						{/* Detail Data Table */}
						<ProgressBarDataTable
							columns={questionColumns}
							data={updatedQuestions}
							filterKey="question"
							isLoading={false}
							onRowClick={(row) => {
								methods.reset(
									{
										score: row.Response.Score,
										observation: row.Response.Observation,
										questionId: row.q_id,
									},
									{ keepDirty: false }
								);
								setSelectedQuestion(row);
								const url = new URL(window.location.href);
								if (row.q_id) {
									url.searchParams.set("question", row.q_id);
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
							setExternalPagination={setQuestionPagination}
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
			</section>
		</div>
	);
});

export default DomainDetail;
