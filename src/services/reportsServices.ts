import {
	createReportDTO,
	createStartReportResponseDTO,
	reportResultDTO,
	reportResultListDTO,
	startReportDTO,
} from "@/models/reports/ExcelDTOs";
import { handleAxiosError } from "@/utils/handleAxiosError";
import axiosInstance from "./axiosInstance";

export class ReportsService {
	async createExcelReport(
		userData: createReportDTO
	): Promise<createStartReportResponseDTO | any> {
		try {
			const response = await axiosInstance.post<createStartReportResponseDTO>(
				`/api/v1/reports/`,
				userData,
				{
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
				}
			);
			if (response.status !== 201) {
				throw response;
			}
			return response.data;
		} catch (error) {
			const errorInfo = handleAxiosError(error);
			console.error("Error creating excel report:", errorInfo.message);

			//rethrowing for conditional rendering
			throw errorInfo;
		}
	}

	async startExcelReport(
		report_id: string,
		report_body: startReportDTO
	): Promise<createStartReportResponseDTO | any> {
		try {
			const response = await axiosInstance.post<createStartReportResponseDTO>(
				`/api/v1/reports/${report_id}/start`,
				report_body,
				{
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
				}
			);
			if (response.status !== 202) {
				throw response;
			}
			return response.data;
		} catch (error) {
			const errorInfo = handleAxiosError(error);
			console.error("Error creating excel report:", errorInfo.message);

			//rethrowing for conditional rendering
			throw errorInfo;
		}
	}

	async getExcelReportResult(
		tenant_id: string,
		company_id: string,
		report_id: string
	): Promise<reportResultDTO | any> {
		try {
			const response = await axiosInstance.get<reportResultDTO>(
				`/api/v1/reports/${tenant_id}/${company_id}/${report_id}`
			);
			if (response.status !== 200) {
				throw response;
			}
			return response.data;
		} catch (error) {
			const errorInfo = handleAxiosError(error);
			console.error("Error fetching report result:", errorInfo.message);

			//rethrowing for conditional rendering
			throw errorInfo;
		}
	}

	async getReportList(
		tenant_id: string,
		company_id: string,
		eval_id: string
	): Promise<reportResultListDTO | any> {
		try {
			const response = await axiosInstance.get<reportResultListDTO>(
				`/api/v1/reports/evaluation/${tenant_id}/${company_id}/${eval_id}`
			);
			if (response.status !== 200) {
				throw response;
			}
			return response.data;
		} catch (error) {
			const errorInfo = handleAxiosError(error);
			console.error("Error fetching report list:", errorInfo.message);

			//rethrowing for conditional rendering
			throw errorInfo;
		}
	}
}

const reportsService = new ReportsService();
export default reportsService;
