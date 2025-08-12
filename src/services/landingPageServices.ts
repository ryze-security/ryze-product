import {
	contactUsBodyDTO,
	contactUsResponseDTO,
} from "@/models/landing_page/contact_usDTOs";
import { handleAxiosError } from "@/utils/handleAxiosError";
import axiosInstance from "./axiosInstance";

export class LandingPageServices {
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
}

const landingPageService = new LandingPageServices();
export default landingPageService;
