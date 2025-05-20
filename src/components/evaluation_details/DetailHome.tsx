import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import {
	controlResponse,
	domainResponse,
	questionResponse,
} from "@/models/evaluation/EvaluationDTOs";
import { ColumnDef } from "@tanstack/react-table";
import { GenericDataTable } from "../GenericDataTable";
import { Button } from "../ui/button";
import { ArrowBigLeftDash } from "lucide-react";
import QuestionForm from "./QuestionForm";

interface Props {
	overallScore: string;
	domainDataMap: Record<string, domainResponse>;
}

interface CardData {
	id: string;
	heading: string;
	data: string;
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

function DetailHome(props: Props) {
	const { overallScore, domainDataMap } = props;

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

	const handleBack = () => setSelectedRow(null);

	const handleQuestionBack = () => setSelectedQuestion(null);

	return (
		<div className="max-w-7xl w-full px-4">
			{/* Header */}
			{!selectedRow && <>
				<div className="flex max-w-fit gap-2">
					<div className="text-4xl font-semibold text-amber-600 tracking-wide">
						{overallScore}%.
					</div>
					<div className="text-4xl font-semibold text-zinc-400 opacity-85 tracking-wide">
						Overall compliance score.
					</div>
				</div>
				{/* Evaluation Cards */}
				<div className="flex flex-wrap gap-4 w-fit mt-10">
					{cardData.map((item) => (
						<InfoCard
							key={item.id}
							heading={item.heading}
							data={item.data}
						/>
					))}
				</div>
			</>}

			{/* Full Data Data table */}
			<section className={`flex flex-col items-center w-full bg-black text-white ${selectedRow ? "" : "mt-8 pt-4"}`}>
				<div className="w-full mb-8 px-4">
					{selectedRow && (
						<div className="flex max-w-fit gap-2">
							<div className="text-4xl font-semibold text-zinc-400 opacity-85 tracking-wide">
								{selectedRow.controlId}
							</div>
							<div className="text-4xl font-semibold text-white tracking-wide">
								{selectedRow.Description}
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
						handleBack={handleQuestionBack}
					/>
				) : (
					<>
						{selectedRow ? (
							<div className="w-full">
								{/* Back Button */}
								<div className="px-4 mb-4">
									<Button
										onClick={handleBack}
										className="rounded-2xl bg-sky-500 hover:bg-sky-600 transition-colors text-white font-bold text-md"
									>
										<ArrowBigLeftDash className="w-12 h-12" />{" "}
										Back
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
								data={updatedControlResponseList}
								filterKey="Description"
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

const InfoCard = ({ heading, data }: { heading: string; data: string }) => {
	return (
		<Card className="bg-zinc-900 rounded-2xl shadow-lg border border-zinc-700 max-h-48 max-w-60 min-h-48 min-w-60">
			<CardContent className="p-6 flex flex-col justify-between gap-2 h-full">
				<div className="flex flex-wrap text-xl text-zinc-400 opacity-85 font-bold tracking-wider">
					{heading}
				</div>
				<div className="text-4xl text-white font-semibold">{data}</div>
			</CardContent>
		</Card>
	);
};

export default DetailHome;
