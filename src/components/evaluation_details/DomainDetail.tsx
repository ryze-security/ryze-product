import {
	controlResponse,
	domainResponse,
	questionResponse,
} from "@/models/evaluation/EvaluationDTOs";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { GenericDataTable } from "../GenericDataTable";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowBigLeftDash } from "lucide-react";
import QuestionForm from "./QuestionForm";

interface Props {
	domainData: domainResponse;
	currentPage: number;
}

const columns: ColumnDef<controlResponse>[] = [
	{
		accessorKey: "controlId",
		header: "Control Id",
	},
	{
		accessorKey: "Description",
		header: "Control Title",
	},
	{
		accessorKey: "Response.Score",
		header: "Control Score",
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
		header: "Compliance",
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
						Score: Number.parseFloat(
							(control.Response.Score * 100).toFixed(2)
						),
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

	const handleBack = () => setSelectedRow(null);

	const handleQuestionBack = () => setSelectedQuestion(null);

	return (
		<div className="max-w-7xl w-full">
			{/* Header section */}
			<div className="flex justify-between w-full px-4">
				{/* Heading */}
				{selectedRow ? (
					<div className="flex max-w-fit gap-2">
						<div className="text-4xl font-semibold text-zinc-400 opacity-85 tracking-wide">
							{selectedRow.controlId}
						</div>
						<div className="text-4xl font-semibold text-white tracking-wide">
							{selectedRow.Description}
						</div>
					</div>
				) : (
					<div className="flex max-w-fit gap-2">
						<div className="text-4xl font-semibold text-amber-600 tracking-wide">
							{(domainData.Response.Score * 100).toFixed(2)}%.
						</div>
						<div className="text-4xl font-semibold text-zinc-400 opacity-85 tracking-wide">
							{`Alignment with ${domainData.Description.toLowerCase()}.`}
						</div>
					</div>
				)}

				{/* Export button */}
				<Button
					variant="default"
					className={`rounded-2xl bg-sky-500 hover:bg-sky-600 transition-colors text-white font-bold text-md`}
				>
					{/* {isLoading ? <RoundSpinner /> : buttonText} */}
					Export
				</Button>
			</div>
			<section className="flex items-center w-full bg-black text-white mt-8 pt-4">
				{selectedQuestion ? (
					<QuestionForm
						questionData={updatedQuestions}
						questionIndex={updatedQuestions.indexOf(
							selectedQuestion
						)}
						handleBack={handleQuestionBack}
					/>
				) : selectedRow ? (
					<div className="w-full">
						{/* Back Button */}
						<div className="px-4 mb-4">
							<Button
								onClick={handleBack}
								className="rounded-2xl bg-sky-500 hover:bg-sky-600 transition-colors text-white font-bold text-md"
							>
								<ArrowBigLeftDash className="w-12 h-12" /> Back
							</Button>
						</div>
						{/* Detail Data Table */}
						<GenericDataTable
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
					<GenericDataTable
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
