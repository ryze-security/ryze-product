import axios from "axios";
import {
	createEvaluationDTO,
	createEvaluationResponseDTO,
	evalutaionDetailDTO,
	listEvaluationsDTO,
	startEvaluationResponseDTO,
} from "@/models/evaluation/EvaluationDTOs";
import { handleAxiosError } from "@/utils/handleAxiosError";
import config from "./config";

export class EvaluationService {
	async getEvaluationByDetails(
		tenant_id: string,
		companyId: string,
		evaluationId: string
	): Promise<evalutaionDetailDTO | any> {
		try {
			const response = await axios.get<evalutaionDetailDTO>(
				`${config.ryzrApiURL}/api/v1/evaluations/${tenant_id}/${companyId}/${evaluationId}/results`
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

	async getEvaluations(tenant_id: string): Promise<listEvaluationsDTO | any> {
		try {
			const response = await axios.get<listEvaluationsDTO>(
				`${config.ryzrApiURL}/api/v1/tenants/${tenant_id}/evaluations`
			);
			if (response.status !== 200) {
				throw response;
			}
			return response.data; // Replace with response.data when using real API
		} catch (error) {
			const errorInfo = handleAxiosError(error);
			console.error("Error fetching company:", errorInfo.message);

			//rethrowing for conditional rendering
			throw errorInfo;
		}
	}

	async createEvaluation(
		evaluation: createEvaluationDTO
	): Promise<createEvaluationResponseDTO | any> {
		try {
			const response = await axios.post(
				`${config.ryzrApiURL}/api/v1/evaluations`,
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
				`${config.ryzrApiURL}/api/v1/evaluations/${evalId}/start`,
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
