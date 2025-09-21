import {
	cancelEvaluationResponseDTO,
	createEvaluationDTO,
	createEvaluationResponseDTO,
	deleteEvaluationResponseDTO,
	evaluationStatusDTO,
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


			//  --------------------
			// todo: Remove this code once the backend returns `overall_score = 0` instead of `null` while processing_status is either running or failed.
			response.data.evaluations.forEach((evaluation) => {
				if (evaluation.overall_score === null) {
					evaluation.overall_score = 0;
				}
			});
			//  --------------------


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
			console.error(
				"Error fetching evaluations by company ID:",
				errorInfo.message
			);

			//rethrowing for conditional rendering
			throw errorInfo;
		}
	}

	async getEvaluationStatus(
		tenant_id: string,
		company_id: string,
		eval_id: string,
		etag: string
	): Promise<evaluationStatusDTO | any> {
		try {
			const response = await axiosInstance.get(
				`/api/v1/evaluations/${tenant_id}/${company_id}/${eval_id}/status`,
				{
					headers: {
						Accept: "application/json",
						"If-None-Match": etag ? etag : "",
					},
					validateStatus: function (status) {
						// Allow all 2xx codes AND the 304 status
						return (
							(status >= 200 && status < 300) || status === 304
						);
					},
				}
			);

			if (response.status === 304) {
				return null;
			}

			if (response.status !== 304 && response.status !== 200) {
				throw response;
			}

			return response.data;
		} catch (error) {
			const errorInfo = handleAxiosError(error);
			console.error(
				"Error fetching evaluation status:",
				errorInfo.message
			);

			//rethrowing for conditional rendering
			throw errorInfo;
		}
	}

	async cancelEvaluation(
		tenantId: string,
		companyId: string,
		evalId: string
	): Promise<cancelEvaluationResponseDTO | any> {
		try {
			const response = await axiosInstance.post(
				`/api/v1/evaluations/${tenantId}/${companyId}/${evalId}/cancel`
			);
			if (response.status !== 200) {
				throw response;
			}
			return response.data;
		} catch (error) {
			const errorInfo = handleAxiosError(error);
			console.error("Error cancelling evaluation:", errorInfo.message);

			//rethrowing for conditional rendering
			throw errorInfo;
		}
	}
}

export class EvaluationStatusService {
	private etags: Map<string, string> = new Map();

	async getStatus(
		tenant_id: string,
		company_id: string,
		eval_id: string
	): Promise<evaluationStatusDTO | null> {
		try {
			const cachedETag = this.etags.get(eval_id);
			const response = await evaluationService.getEvaluationStatus(
				tenant_id,
				company_id,
				eval_id,
				cachedETag
			);
			if (response === null) return null;
			if (response.etag) {
				this.etags.set(eval_id, response.etag);
			}
			return response;
		} catch (error) {
			const errorInfo = handleAxiosError(error);
			console.error(
				"Error fetching evaluation status:",
				errorInfo.message
			);

			//rethrowing for conditional rendering
			throw errorInfo;
		}
	}
}

export class AdaptivePolling {
	private intervalId: number | null = null;
	private startTimeId: number | null = null;
	private currentInterval: number = 5000;
	private pollFn: () => Promise<void> | undefined;

	startPolling(
		fetchStatus: () => Promise<evaluationStatusDTO | null>,
		onUpdate: (status: evaluationStatusDTO) => void,
		onComplete: () => void
	) {
		this.pollFn = async () => {
			try {
				const status = await fetchStatus();
				if (status) {
					onUpdate(status);

					// Check for completion first
					if (
						[
							"completed",
							"completed_with_errors",
							"failed",
						].includes(status.status)
					) {
						this.stopPolling();
						onComplete();
						return; // Exit the function
					}

					// Adjust interval for next poll
					this.adjustInterval(status.status, this.pollFn);
				}
			} catch (error) {
				this.stopPolling();
				onComplete();
			}
		};

		const initialDelay = Math.random() * 1000;

		this.startTimeId = window.setTimeout(() => {
			this.startTimeId = null;
			if (this.pollFn) {
				this.pollFn();
				this.intervalId = window.setInterval(
					this.pollFn,
					this.currentInterval
				);
			}
		}, initialDelay);
	}

	private adjustInterval(status: string, pollFn: () => void) {
		const intervals = {
			pending: 20000,
			in_progress: 10000,
			processing_missing_elements: 10000,
		};
		const newInterval = intervals[status] || this.currentInterval;

		if (newInterval !== this.currentInterval) {
			this.stopPolling(); // Stop the old timer
			this.currentInterval = newInterval;
			this.intervalId = window.setInterval(pollFn, this.currentInterval); // Start a new timer
		}
	}

	stopPolling(): void {
		if (this.startTimeId) {
			clearTimeout(this.startTimeId);
			this.startTimeId = null;
		}

		if (this.intervalId) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}
	}
}

const evaluationService = new EvaluationService();
const evaluationStatusService = new EvaluationStatusService();
const adaptivePolling = new AdaptivePolling();
export default { evaluationStatusService, evaluationService, adaptivePolling };
