import { handleAxiosError } from "@/utils/handleAxiosError";
import axiosInstance from "./axiosInstance";
import { CreditsDataDTO } from "@/models/credits/creditsDTOs";

export class CreditsClass {
	async getCreditsByTenantId(
		tenant_id: string
	): Promise<CreditsDataDTO | any> {
		try {
			const response = await axiosInstance.get<CreditsDataDTO>(
				`/api/v1/credits/tenants/${tenant_id}/credits`
			);

			if (response.status !== 200) {
				throw response;
			}
			return response.data;
		} catch (error) {
			const errorInfo = handleAxiosError(error);
			console.error("Error fetching credits:", errorInfo.message);

			// Rethrowing for conditional rendering
			throw errorInfo;
		}
	}
}

const creditsService = new CreditsClass();
export default creditsService;
