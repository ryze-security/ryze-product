import { Evaluation } from "../models/evaluation/evaluation";
import {
	mockEvaluationData,
	mockEvaluations,
} from "../mock_data/evaluation-data";
import axios from "axios";
import {
	createEvaluationDTO,
	createEvaluationResponseDTO,
	startEvaluationResponseDTO,
} from "@/models/evaluation/EvaluationDTOs";
import { handleAxiosError } from "@/utils/handleAxiosError";

export class EvaluationService {
	async getEvaluationByID(evaluationId: string): Promise<Evaluation | null> {
		try {
			// const response = await axios.get<Evaluation>(`https://api.example.com/evaluations/${evaluationId}`);
			// if (response.status !== 200) {
			//     throw new Error(`Error fetching evaluation: ${response.statusText}`);
			// }
			// return response.data;
			return mockEvaluationData; // Replace with response.data when using real API
		} catch (error) {
			console.error("Error fetching evaluation:", error);
			return null;
		}
	}

	async getEvaluations(): Promise<Evaluation[] | null> {
		try {
			// const response = await axios.get<Evaluation[]>(`https://api.example.com/evaluations`);
			// if (response.status !== 200) {
			//     throw new Error(`Error fetching evaluations: ${response.statusText}`);
			// }
			// return response.data;
			return mockEvaluations; // Replace with response.data when using real API
		} catch (error) {
			console.error("Error fetching evaluations:", error);
			return null;
		}
	}

	async createEvaluation(
		evaluation: createEvaluationDTO
	): Promise<createEvaluationResponseDTO | any> {
		try {
			const response = await axios.post(
				`https://ryzr-be-cwacd8a5c6c8d7bd.francecentral-01.azurewebsites.net/api/v1/evaluations`,
				evaluation,
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			if (response.status !== 200) {
				throw response;
			}
			return response.data;
		} catch (error) {
			const errorInfo = handleAxiosError(error);
			console.error("Error fetching company:", errorInfo.message);

			//rethrowing for conditional rendering
			throw errorInfo;
		}
	}

	async startEvaluation(
		evalId: string
	): Promise<startEvaluationResponseDTO | any> {
		try {
			const response = await axios.post<startEvaluationResponseDTO>(
				`https://ryzr-be-cwacd8a5c6c8d7bd.francecentral-01.azurewebsites.net/api/v1/evaluations/${evalId}/start`,
				null,
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			if (response.status !== 200) {
				throw response;
			}
			return response.data;
		} catch (error) {
			const errorInfo = handleAxiosError(error);
			console.error("Error fetching company:", errorInfo.message);

			//rethrowing for conditional rendering
			throw errorInfo;
		}
	}
}

const evaluationService = new EvaluationService();
export default evaluationService;
