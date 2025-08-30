import { questionResponse } from "@/models/evaluation/EvaluationDTOs";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../ui/button";
import {
	ArrowBigLeft,
	ArrowBigRight,
	CheckIcon,
	ChevronLeft,
	ChevronRight,
	ChevronsUpDownIcon,
	Lock,
	PencilLine,
} from "lucide-react";
import { useFormContext } from "react-hook-form";
import MarkdownRenderer from "./MarkdownRenderer";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList,
} from "../ui/command";
import { cn } from "@/lib/utils";
import { AlertDialogBox } from "../AlertDialogBox";
import { RoundSpinner } from "../ui/spinner";

interface Props {
	questionData: questionResponse[];
	questionIndex: number;
	submitFn: (data: any) => void;
	isLoading?: boolean;
}

const complianceStatus = [
	{ value: "null", label: "N/A" },
	{ value: "true", label: "COMPLIANT" },
	{ value: "false", label: "NON-COMPLIANT" },
];

function QuestionForm(props: Props) {
	const { questionData, questionIndex, submitFn, isLoading } = props;

	const [selectedQuestion, setSelectedQuestion] = useState<questionResponse>(
		questionData[questionIndex]
	);

	useMemo(() => {
		setSelectedQuestion(questionData[questionIndex]);
	}, [questionData, questionIndex]);

	// const [formattedEvidence, setFormattedEvidence] = useState<string[]>([]);

	const [index, setIndex] = useState<number>(questionIndex);

	const [isObservationEditing, setisObservationEditing] = useState(false);
	const [open, setOpen] = useState(false);
	const [isAlertOpen, setIsAlertOpen] = useState(false);

	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const { register, setValue, watch, reset, formState, handleSubmit } =
		useFormContext();

	// This effect is used to set the selected question and formatted evidence when the question data or index changes
	useEffect(() => {
		setIndex(questionIndex);
		// updateEvidence(newIndex);
	}, [questionData, questionIndex]);

	// This effect is used to change the text area size and focus on it when editing
	// the observation
	useEffect(() => {
		if (isObservationEditing && textareaRef.current) {
			const el = textareaRef.current;
			el.focus();

			const length = el.value.length;
			el.setSelectionRange(length, length);

			// Reset and then set to scrollHeight
			el.style.height = "auto";
			el.style.height = `${el.scrollHeight}px`;
		}
	}, [isObservationEditing]);

	useEffect(() => {
		setValue("observation", selectedQuestion?.Response.Observation || "", {
			shouldDirty: false,
		});
		setValue("score", selectedQuestion?.Response.Score || false, {
			shouldDirty: false,
		});
	}, [selectedQuestion, setValue]);

	useEffect(() => {
		if (!isObservationEditing && formState.isDirty) {
			setIsAlertOpen(true);
		}
	}, [isObservationEditing, formState.isDirty]);

	// This function is used to update the observation
	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setValue("observation", e.target.value, { shouldDirty: true });
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto"; // reset
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}
	};

	// This function is used to update the formatted evidence
	// const updateEvidence = (currentIndex: number) => {
	// 	const rawEvidence = questionData[currentIndex]?.Response.evidence || "";
	// 	const result = rawEvidence
	// 		.split(/\d+\.\s/)
	// 		.filter(Boolean)
	// 		.map((item) => item.trim().replace(/^['"]|['"]$/g, ""));
	// 	setFormattedEvidence(result);
	// };

	const handleLeftArrowClick = () => {
		if (index > 0) {
			const newIndex = index - 1;
			setIndex(newIndex);
			setSelectedQuestion(questionData[newIndex]);
			setisObservationEditing(false);
			// updateEvidence(newIndex);
			reset(
				{
					observation:
						questionData[newIndex]?.Response.Observation || "",
					score: questionData[newIndex]?.Response.Score || false,
					questionId: questionData[newIndex]?.q_id || "",
				},
				{ keepDirty: false }
			);
		}
	};

	const handleRightArrowClick = () => {
		if (index < questionData.length - 1) {
			const newIndex = index + 1;
			setIndex(newIndex);
			setSelectedQuestion(questionData[newIndex]);
			// updateEvidence(newIndex);
			setisObservationEditing(false);
			reset(
				{
					observation:
						questionData[newIndex]?.Response.Observation || "",
					score: questionData[newIndex]?.Response.Score || false,
					questionId: questionData[newIndex]?.q_id || "",
				},
				{ keepDirty: false }
			);
		}
	};

	return (
		<div className="w-full px-4">
			<section className="w-full bg-gray-ryzr rounded-lg mb-4 mt-8">
				{/* <div className="bg-gray-ryzr rounded-md h-fit w-fit px-2 py-1 flex gap-2">
					{questionData.map((question, index) => (
						<div
							key={index}
							className={`text-gray-light-ryzr w-fit p-2 align-middle rounded ${selectedQuestion.q_id === question.q_id ? "bg-violet-light-ryzr text-white" : question.Response.Score ? "text-green-ryzr" : "text-red-ryzr"} cursor-pointer hover:bg-violet-light-ryzr/85 hover:text-white transition-colors duration-200`}
						>
							{index + 1}
						</div>
					))}
				</div> */}
				{/* Question Name and compliance button*/}
				<div className="flex w-full border-b-black border-b-2 p-6">
					<div className="flex flex-col justify-center w-8/12">
						<span className="text-sm font-bold text-[#AAAAAA] tracking-wide uppercase mb-1">
							Question
						</span>
						<div className="gap-2 flex text-lg">
							<span>{`${selectedQuestion?.SNo}`}.</span>
							<span className="flex flex-wrap">{`${selectedQuestion?.question}`}</span>
						</div>
					</div>
					{/* Compliance status and toggle button */}
					<div className="flex gap-3 justify-end w-4/12 items-center">
						<Popover open={open} onOpenChange={setOpen}>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									role="combobox"
									aria-expanded={open}
									disabled={!isObservationEditing}
									className={`w-[200px] justify-between bg-gray-light-ryzr text-white ${
										watch("score") === null
											? "bg-zinc-700 hover:bg-zinc-700/75"
											: watch("score")
											? "bg-green-ryzr hover:bg-green-ryzr/75"
											: "bg-red-ryzr hover:bg-red-ryzr/75"
									} transition-opacity duration-200 disabled:opacity-100 font-semibold`}
								>
									{
										complianceStatus.find(
											(status) =>
												status.value ===
												String(watch("score"))
										)?.label
									}
									<ChevronsUpDownIcon
										className={cn(
											"ml-2 h-4 w-4 shrink-0",
											isObservationEditing
												? "opacity-75"
												: "opacity-0"
										)}
									/>
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-[200px] p-0">
								<Command>
									<CommandList>
										<CommandEmpty>
											No framework found.
										</CommandEmpty>
										<CommandGroup>
											{complianceStatus.map(
												(status, index) => (
													<CommandItem
														key={index}
														value={status.value}
														onSelect={(
															currentValue
														) => {
															const finalValue =
																currentValue ===
																"true"
																	? true
																	: currentValue ===
																	  "false"
																	? false
																	: null;
															setValue(
																"score",
																finalValue,
																{
																	shouldDirty:
																		true,
																}
															);
															setOpen(false);
														}}
													>
														<CheckIcon
															className={cn(
																"mr-2 h-4 w-4",
																String(
																	watch(
																		"score"
																	)
																) ===
																	status.value
																	? "opacity-100"
																	: "opacity-0"
															)}
														/>
														{status.label}
													</CommandItem>
												)
											)}
										</CommandGroup>
									</CommandList>
								</Command>
							</PopoverContent>
						</Popover>
						<AlertDialogBox
							open={isAlertOpen}
							onOpenChange={setIsAlertOpen}
							subheading="Are you sure you want to save the changes to this question? Confirming will permanently update the evaluation record."
							onAction={handleSubmit(submitFn)}
							actionLabel="Confirm"
							onCancel={() => {
								reset(
									{
										observation:
											selectedQuestion?.Response
												.Observation || "",
										score:
											selectedQuestion?.Response.Score ||
											false,
										questionId:
											selectedQuestion?.q_id || "",
									},
									{ keepDirty: false }
								);
							}}
						/>
						<Button
							onClick={() => {
								setisObservationEditing(!isObservationEditing);
							}}
							className="bg-[#4A4A4A] hover:bg-[#4A4A4A]/75 text-white font-bold p-2.5"
							disabled={isLoading}
						>
							{isLoading ? (
								<RoundSpinner />
							) : isObservationEditing ? (
								<Lock className="opacity-80" />
							) : (
								<PencilLine className="opacity-80" />
							)}
						</Button>
					</div>
				</div>
				<div className="flex w-full">
					<div className="p-6 w-1/2 border-r border-black flex flex-col gap-2">
						<span className="text-sm font-bold text-[#AAAAAA] tracking-wide uppercase">
							Observation
						</span>
						{/* Observation and textarea */}
						<div className="w-full">
							{isObservationEditing ? (
								<textarea
									ref={(e) => {
										textareaRef.current = e;
										register("observation").ref(e);
									}}
									className="w-full bg-black/30 p-2 text-white border-none resize-none focus:outline-none rounded"
									value={watch("observation")}
									onChange={(e) => {
										handleChange(e);
									}}
									placeholder="Enter your observation..."
								/>
							) : (
								<div className="w-full opacity-85 leading-relaxed text-lg">
									<MarkdownRenderer
										content={watch("observation")}
									/>
								</div>
							)}
						</div>
					</div>
					{/* Evidence */}
					<div className="flex flex-col p-6 w-1/2 gap-2">
						<span className="text-sm font-bold text-[#AAAAAA] tracking-wide uppercase">
							Evidence
						</span>
						<div className="gap-2 flex flex-col">
							<span className="flex flex-wrap text-opacity-85 leading-relaxed text-lg">{`${selectedQuestion?.Response.evidence}`}</span>
							<span className="text-opacity-85 leading-relaxed text-lg">{selectedQuestion?.Response.page_numbers}</span>
						</div>
					</div>
				</div>
			</section>
			<div className="flex justify-between w-full">
				{formState.isDirty ? (
					<AlertDialogBox
						subheading="You have unsaved changes on this page! Clicking confirm will remove any unsaved changes."
						actionLabel="Confirm"
						trigger={
							<Button
								variant="outline"
								className="w-[49%] bg-[#4A4A4A] hover:bg-[#4A4A4A]/75 text-white text-lg py-6 rounded-sm"
								disabled={index === 0 || isLoading}
							>
								<ChevronLeft className="mr-2 h-4 w-4" />{" "}
								Previous
							</Button>
						}
						onAction={() => {
							handleLeftArrowClick();
						}}
					/>
				) : (
					<Button
						variant="outline"
						onClick={handleLeftArrowClick}
						className="w-[49%] bg-[#4A4A4A] hover:bg-[#4A4A4A]/75 text-white text-lg py-6 rounded-sm"
						disabled={index === 0 || isLoading}
					>
						<ChevronLeft className="mr-2 h-4 w-4" /> Previous
					</Button>
				)}

				{formState.isDirty ? (
					<AlertDialogBox
						subheading="You have unsaved changes on this page! Clicking confirm will remove any unsaved changes."
						actionLabel="Confirm"
						trigger={
							<Button
								variant="outline"
								className="w-[49%] bg-[#4A4A4A] hover:bg-[#4A4A4A]/75 text-white text-lg py-6 rounded-sm"
								disabled={
									index === questionData.length - 1 ||
									isLoading
								}
							>
								<ChevronRight className="mr-2 h-4 w-4" /> Next
							</Button>
						}
						onAction={() => {
							handleRightArrowClick();
						}}
					/>
				) : (
					<Button
						variant="outline"
						onClick={handleRightArrowClick}
						className="w-[49%] bg-[#4A4A4A] hover:bg-[#4A4A4A]/75 text-white text-lg py-6 rounded-sm"
						disabled={
							index === questionData.length - 1 || isLoading
						}
					>
						<ChevronRight className="mr-2 h-4 w-4" /> Next
					</Button>
				)}
			</div>
		</div>
	);
}

export default QuestionForm;
