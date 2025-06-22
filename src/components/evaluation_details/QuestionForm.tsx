import { questionResponse } from "@/models/evaluation/EvaluationDTOs";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { ArrowBigLeft, ArrowBigRight, PencilLine } from "lucide-react";
import { useFormContext } from "react-hook-form";

interface Props {
	questionData: questionResponse[];
	questionIndex: number;
}

function QuestionForm(props: Props) {
	const { questionData, questionIndex } = props;

	const [selectedQuestion, setSelectedQuestion] = useState<questionResponse>(
		questionData[questionIndex]
	);

	const [formattedEvidence, setFormattedEvidence] = useState<string[]>([]);

	const [index, setIndex] = useState<number>(questionIndex);

	const [isObservationEditing, setisObservationEditing] = useState(false);
	
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const { register, setValue, watch, reset } =
		useFormContext();

	// This effect is used to set the selected question and formatted evidence when the question data or index changes
	useEffect(() => {
		setIndex(questionIndex);
		updateEvidence(questionIndex);
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
			shouldDirty: false,});
		setValue("score", selectedQuestion?.Response.Score || false, {shouldDirty: false});
	}, [selectedQuestion, setValue]);

	// This function is used to update the observation
	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setValue("observation", e.target.value, { shouldDirty: true });
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto"; // reset
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}
	};

	// This function is used to update the formatted evidence
	const updateEvidence = (currentIndex: number) => {
		const rawEvidence = questionData[currentIndex]?.Response.evidence || "";
		const result = rawEvidence
			.split(/\d+\.\s/)
			.filter(Boolean)
			.map((item) => item.trim().replace(/^['"]|['"]$/g, ""));
		setFormattedEvidence(result);
	};

	const handleLeftArrowClick = () => {
		if (index > 0) {
			const newIndex = index - 1;
			setIndex(newIndex);
			setSelectedQuestion(questionData[newIndex]);
			updateEvidence(newIndex);
			reset({
				observation: questionData[newIndex]?.Response.Observation || "",
				score: questionData[newIndex]?.Response.Score || false,
				questionId: questionData[newIndex]?.q_id || "",
			}, { keepDirty: false})
		}
	};

	const handleRightArrowClick = () => {
		if (index < questionData.length - 1) {
			const newIndex = index + 1;
			setIndex(newIndex);
			setSelectedQuestion(questionData[newIndex]);
			updateEvidence(newIndex);
			reset({
				observation: questionData[newIndex]?.Response.Observation || "",
				score: questionData[newIndex]?.Response.Score || false,
				questionId: questionData[newIndex]?.q_id || "",
			}, { keepDirty: false})
		}
	};

	return (
		<div className="w-full">
			<section className="w-full max-w-[904px] px-4 mb-4 mt-8">
				{/* Question Name and changing arrows */}
				<div className="flex flex-col">
					<div className="flex justify-between">
						<div className="text-lg text-white tracking-wide bg-zinc-700 rounded-t-md px-3 py-1">
							Question
						</div>
						<div className="flex gap-2">
							<Button
								className="rounded-full text-white w-8 h-8 bg-gray-ryzr hover:bg-zinc-700"
								onClick={handleLeftArrowClick}
							>
								<ArrowBigLeft />
							</Button>
							<Button
								className="rounded-full text-white w-8 h-8 bg-gray-ryzr hover:bg-zinc-700"
								onClick={handleRightArrowClick}
							>
								<ArrowBigRight />
							</Button>
						</div>
					</div>
					<div className="bg-zinc-900 gap-2 flex rounded-md rounded-tl-none border border-zinc-700 p-4">
						<span>{`${selectedQuestion?.SNo}`}.</span>
						<span className="flex flex-wrap">{`${selectedQuestion?.question}`}</span>
					</div>
				</div>
				{/* Compliance status and toggle button */}
				<div className="flex gap-2 mt-8">
					<div className="text-lg tracking-wide text-zinc-400 opacity-85 rounded-t-md px-2 py-1">
						Found
					</div>
					<div className="flex w-fit gap-2">
						<Button
							type="button"
							onClick={() => setValue("score", true, { shouldDirty: true })}
							className={`min-w-20 max-w-20 py-1 px-6 rounded-full ${watch("score") ? "hover:bg-green-ryzr" : "hover:bg-zinc-800"} text-white ${
								watch("score") ? "bg-green-ryzr" : "bg-zinc-700"
							}`}
						>
							Yes
						</Button>
						<Button
							type="button"
							onClick={() => setValue("score", false, { shouldDirty: true })}
							className={`min-w-20 max-w-20 py-1 px-6 rounded-full text-white ${!watch("score") ? "hover:bg-red-ryzr" : "hover:bg-zinc-800"} ${
								!watch("score") ? "bg-red-ryzr" : "bg-zinc-700"
							}`}
						>
							No
						</Button>
					</div>
				</div>
				{/* Observation */}
				<div className="flex flex-col mt-8">
					<div className="flex gap-2">
						<div className="text-lg text-white tracking-wide bg-zinc-700 rounded-t-md px-3 py-1">
							Observation
						</div>
						<Button
							onClick={() => {
								setisObservationEditing(!isObservationEditing);
							}}
							className="bg-transparent hover:bg-zinc-700 text-white font-bold px-4"
						>
							<PencilLine className="opacity-80" />
						</Button>
					</div>
					<div className="bg-zinc-900 gap-2 flex rounded-md rounded-tl-none border border-zinc-700 p-4">
						{isObservationEditing ? (
							<textarea
							ref={(e) => {
								textareaRef.current = e;
								register("observation").ref(e);
							}}
								className="w-full bg-zinc-800 p-2 text-white border-none resize-none focus:outline-none rounded"
								value={watch("observation")}
								onChange={(e) => {
									handleChange(e);
								}}
								placeholder="Enter your observation..."
							/>
						) : (
							<span className="flex flex-wrap opacity-85">
								{watch("observation")}
							</span>
						)}
					</div>
				</div>
				{/* Evidence */}
				<div className="flex flex-col mt-8">
					<div className="flex justify-between">
						<div className="text-lg text-white tracking-wide bg-zinc-700 rounded-t-md px-3 py-1">
							Evidence
						</div>
					</div>
					<div className="bg-zinc-900 gap-2 flex flex-col rounded-md rounded-tl-none border border-zinc-700 p-4">
						{formattedEvidence.map((evidence, index) => (
							<div className="flex gap-2" key={index}>
								<span>{`${index + 1}.`}</span>
								<span className="flex flex-wrap opacity-85">{`${evidence}`}</span>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}

export default QuestionForm;
