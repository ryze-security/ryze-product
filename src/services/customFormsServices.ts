import {
	contactUsBodyDTO,
	contactUsResponseDTO,
	customFormResponseDTO,
	requestCreditsBodyDTO,
	requestFrameworkBodyDTO,
} from "@/models/landing_page/contact_usDTOs";
import { handleAxiosError } from "@/utils/handleAxiosError";
import axiosInstance from "./axiosInstance";

export class CustomFormsService {
	async contactUs(
		body: contactUsBodyDTO
	): Promise<contactUsResponseDTO | any> {
		try {
			const response = await axiosInstance.post<contactUsResponseDTO>(
				`/api/v1/contact`,
				body,
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			if (response.status !== 201) {
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

	async customForm(
		userId: string,
		tenantId: string,
		type: "request_framwork" | "request_credits",
		blob: requestFrameworkBodyDTO | requestCreditsBodyDTO
	): Promise<customFormResponseDTO | any> {
		try {
			const response = await axiosInstance.post<customFormResponseDTO>(
				`/api/v1/forms`,
				{
					user_id: userId,
					tenant_id: tenantId,
					form_type: type,
					blob: JSON.stringify(blob),
				},
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			if (response.status !== 201) {
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

const customFormsService = new CustomFormsService();
export default customFormsService;
