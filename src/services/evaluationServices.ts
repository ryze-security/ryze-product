import {
	createEvaluationDTO,
	createEvaluationResponseDTO,
	deleteEvaluationResponseDTO,
	evalutaionDetailDTO,
	listEvaluationsDTO,
	startEvaluationResponseDTO,
	updateQuestionResponseDTO,
} from "@/models/evaluation/EvaluationDTOs";
import { handleAxiosError } from "@/utils/handleAxiosError";
import axiosInstance from "./axiosInstance";

export class EvaluationService {
	async getEvaluationByDetails(
		tenant_id: string,
		companyId: string,
		evaluationId: string
	): Promise<evalutaionDetailDTO | any> {
		try {
			const response = await axiosInstance.get<evalutaionDetailDTO>(
				`/api/v1/evaluations/${tenant_id}/${companyId}/${evaluationId}/results`
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
			const response = await axiosInstance.get<listEvaluationsDTO>(
				`/api/v1/tenants/${tenant_id}/evaluations`
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
			const response = await axiosInstance.post(
				`/api/v1/evaluations`,
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
			const response =
				await axiosInstance.post<startEvaluationResponseDTO>(
					`/api/v1/start/${evalId}`,
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

	async updateQuestion(
		tenant_id: string,
		company_id: string,
		eval_id: string,
		q_id: string,
		observation: string,
		score: boolean
	): Promise<updateQuestionResponseDTO | any> {
		const payload = {
			observation: observation,
			result: score,
		};
		try {
			const response = await axiosInstance.patch(
				`/api/v1/evaluations/${tenant_id}/${company_id}/${eval_id}/questions/${q_id}`,
				payload,
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

	async deleteEvaluation(
		tenant_id: string,
		company_id: string,
		eval_id: string
	): Promise<deleteEvaluationResponseDTO | any> {
		try {
			const response = await axiosInstance.delete(
				`/api/v1/evaluations/${tenant_id}/${company_id}/${eval_id}`
			);
			if (response.status !== 200) {
				throw response;
			}
			return response.data;
		} catch (error) {
			const errorInfo = handleAxiosError(error);
			console.error("Error deleting evaluation:", errorInfo.message);

			//rethrowing for conditional rendering
			throw errorInfo;
		}
	}

	async getEvaluationsByCompanyId(
		tenant_id: string,
		companyId: string
	): Promise<listEvaluationsDTO | any> {
		try {
			const response = await axiosInstance.get<listEvaluationsDTO>(
				`/api/v1/tenants/${tenant_id}/companies/${companyId}/evaluations`
			);
			if (response.status !== 200) {
				throw response;
			}
			return response.data; // Replace with response.data when using real API
		} catch (error) {
			const errorInfo = handleAxiosError(error);
			console.error("Error fetching evaluations by company ID:", errorInfo.message);

			//rethrowing for conditional rendering
			throw errorInfo;
		}
	}
}

const evaluationService = new EvaluationService();
export default evaluationService;
