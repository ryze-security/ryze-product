import React, { useMemo } from "react";
import Navbar from "@/components/Navbar";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { mockEvaluations } from "@/mock_data/evaluation-data";
import { mapToEvaluationListDto } from "@/models/evaluation/evaluationListDto";

const Evaluations = () => {
	// Mock data for past evaluations
	// const evaluations: Evaluation[] = [
	//   {
	//     id: '1',
	//     company: 'Acme Corporation',
	//     framework: 'ISO 27001',
	//     score: 78,
	//     runBy: 'Aditya',
	//     lastUpdated: '2024-03-15'
	//   },
	//   {
	//     id: '2',
	//     company: 'TechSolutions Inc.',
	//     framework: 'NIST CSF',
	//     score: 65,
	//     runBy: 'Aditya',
	//     lastUpdated: '2024-02-28'
	//   },
	//   {
	//     id: '3',
	//     company: 'Global Financial',
	//     framework: 'PCI DSS',
	//     score: 82,
	//     runBy: 'Sarah',
	//     lastUpdated: '2024-03-10'
	//   },
	//   {
	//     id: '4',
	//     company: 'Healthcare Systems',
	//     framework: 'HIPAA',
	//     score: 91,
	//     runBy: 'Mike',
	//     lastUpdated: '2024-03-22'
	//   }
	// ];
	const evaluations = useMemo(
		() => mockEvaluations.map(mapToEvaluationListDto),
		[mockEvaluations]
	);

	const navigate = useNavigate();

	return (
		<div className="min-h-screen bg-black text-white p-6">
			<Navbar />
			<div className="container mx-auto">
				<h1 className="text-4xl font-bold my-8">Past Evaluations</h1>

				<div className="glass-card p-6 mb-8">
					<Table>
						<TableHeader className="bg-gray-800">
							<TableRow>
								<TableHead className="text-gray-300">
									Company
								</TableHead>
								<TableHead className="text-gray-300">
									Framework
								</TableHead>
								<TableHead className="text-gray-300">
									Score
								</TableHead>
								<TableHead className="text-gray-300">
									Run By
								</TableHead>
								<TableHead className="text-gray-300">
									Last Updated
								</TableHead>
								<TableHead className="text-gray-300 w-16"></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{evaluations.map((evaluation) => (
								<TableRow
									key={evaluation.evaluationId}
									onClick={() =>
										navigate(
											`/dashboard/${evaluation.evaluationId}`
										)
									}
									className="bg-gray-900 border-b border-gray-800 hover:bg-gray-800 hover:cursor-pointer transition duration-200 ease-in-out"
								>
									<TableCell className="font-medium">
										{evaluation.company}
									</TableCell>
									<TableCell>
										{evaluation.framework}
									</TableCell>
									<TableCell>
										<div className="flex items-center">
											<div className="progress-bar w-32 mr-2">
												<div
													className="progress-value bg-purple"
													style={{
														width: `${evaluation.score}%`,
													}}
												/>
											</div>
											<span>{evaluation.score}%</span>
										</div>
									</TableCell>
									<TableCell>{evaluation.runBy}</TableCell>
									<TableCell>
										{evaluation.lastUpdated}
									</TableCell>
									<TableCell>
										<ChevronRight className="h-5 w-5 text-gray-400" />
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
};

export default Evaluations;
