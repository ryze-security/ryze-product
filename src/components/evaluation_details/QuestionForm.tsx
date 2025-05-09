import { questionResponse } from "@/models/evaluation/EvaluationDTOs";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { ArrowBigLeft, ArrowBigLeftDash, ArrowBigRight, PencilLine } from "lucide-react";

interface Props {
	questionData: questionResponse[];
	questionIndex: number;
	handleBack: () => void;
}

function QuestionForm(props: Props) {
	const { questionData, questionIndex, handleBack } = props;

	const [selectedQuestion, setSelectedQuestion] =
		useState<questionResponse>(questionData[questionIndex]);

	const [formattedEvidence, setFormattedEvidence] = useState<string[]>([]);

    const [index, setIndex] = useState<number>(questionIndex);

	const [isEditing, setIsEditing] = useState(false);

	const [observation, setObservation] = useState("");

	const textareaRef = useRef<HTMLTextAreaElement>(null);

    // This effect is used to set the selected question and formatted evidence when the question data or index changes
	useEffect(() => {
        setIndex(questionIndex);
		updateEvidence(questionIndex);
		setObservation(selectedQuestion?.Response.Observation);
	}, [questionData, questionIndex]);

    // This effect is used to change the text area size and focus on it when editing
    // the observation
	useEffect(() => {
		if (isEditing && textareaRef.current) {
			const el = textareaRef.current;
			el.focus();

			const length = el.value.length;
			el.setSelectionRange(length, length);

			// Reset and then set to scrollHeight
			el.style.height = "auto";
			el.style.height = `${el.scrollHeight}px`;
		}
	}, [isEditing]);


    // This function is used to update the observation
	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setObservation(e.target.value);
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto"; // reset
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}
	};

    // This function is used to update the formatted evidence
    const updateEvidence = (currentIndex: number) => {
        const result = questionData[currentIndex]?.Response.evidence
			.split(/\d+\.\s/)
			.filter(Boolean)
			.map((item) => item.trim().replace(/^['"]|['"]$/g, ""));
		setFormattedEvidence(result);
    }

    const handleLeftArrowClick = () => {
        if (index > 0) {
            const newIndex = index - 1;
            setIndex(newIndex);
            setSelectedQuestion(questionData[newIndex]);
            updateEvidence(newIndex);
            setObservation(questionData[newIndex]?.Response.Observation);
        }
    }

    const handleRightArrowClick = () => {
        if (index < questionData.length - 1) {
            const newIndex = index + 1;
            setIndex(newIndex);
            setSelectedQuestion(questionData[newIndex]);
            updateEvidence(newIndex);
            setObservation(questionData[newIndex]?.Response.Observation);
        }
    }

	return (
		<div className="w-full">
			<div className="px-4 mb-4">
				<Button
					onClick={handleBack}
					className="rounded-2xl bg-sky-500 hover:bg-sky-600 transition-colors text-white font-bold text-md"
				>
					<ArrowBigLeftDash className="w-12 h-12" /> Back
				</Button>
			</div>
			<section className="w-full max-w-[904px] px-4 mb-4 mt-8">
				{/* Question Name and changing arrows */}
				<div className="flex flex-col">
					<div className="flex justify-between">
						<div className="text-lg text-white tracking-wide bg-zinc-700 rounded-t-md px-3 py-1">
							Question
						</div>
						<div className="flex gap-2">
							<Button className="rounded-full text-white w-8 h-8 bg-zinc-900 hover:bg-zinc-700" onClick={handleLeftArrowClick}>
                                <ArrowBigLeft />
                            </Button>
                            <Button className="rounded-full text-white w-8 h-8 bg-zinc-900 hover:bg-zinc-700" onClick={handleRightArrowClick}>
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
					<div className="flex w-fit px-4 gap-2">
						<div
							className={`flex items-center justify-center text-center whitespace-nowrap min-w-20 max-w-20 py-1 px-6 rounded-full text-white ${
								selectedQuestion?.Response.Score
									? "bg-green-700"
									: "bg-zinc-700"
							}`}
						>
							Yes
						</div>
						<div
							className={`flex items-center justify-center text-center whitespace-nowrap min-w-20 max-w-20 py-1 px-6 rounded-full text-white ${
								selectedQuestion?.Response.Score
									? "bg-zinc-700"
									: "bg-rose-700"
							}`}
						>
							No
						</div>
					</div>
					<Button className="bg-transparent hover:bg-zinc-700 text-white font-bold py-2 px-4">
						<PencilLine className="opacity-80" />
					</Button>
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
				{/* Observation */}
				<div className="flex flex-col mt-8">
					<div className="flex gap-2">
						<div className="text-lg text-white tracking-wide bg-zinc-700 rounded-t-md px-3 py-1">
							Observation
						</div>
						<Button
							onClick={() => {
								setIsEditing(!isEditing);
							}}
							className="bg-transparent hover:bg-zinc-700 text-white font-bold px-4"
						>
							<PencilLine className="opacity-80" />
						</Button>
					</div>
					<div className="bg-zinc-900 gap-2 flex rounded-md rounded-tl-none border border-zinc-700 p-4">
						{isEditing ? (
							<textarea
								ref={textareaRef}
								className="w-full bg-zinc-800 p-2 text-white border-none resize-none focus:outline-none rounded"
								value={observation}
								onChange={handleChange}
								placeholder="Enter your observation..."
							/>
						) : (
							<span className="flex flex-wrap opacity-85">
								{observation}
							</span>
						)}
					</div>
				</div>
			</section>
		</div>
	);
}

export default QuestionForm;
