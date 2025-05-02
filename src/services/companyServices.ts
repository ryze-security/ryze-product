import { CompanyCreateDto, CompanyListDto } from "@/models/company/companyDTOs";
import { handleAxiosError } from "@/utils/handleAxiosError";
import axios from "axios";
import config from "./config";

export class CompanyService {
	async getCompanyByTenantId(
		tenant_id: string
	): Promise<CompanyListDto[] | any> {
		try {
			const response = await axios.get<CompanyListDto[]>(
				`${config.ryzrApiURL}/api/v1/companies/${tenant_id}`
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

	async getCompanyByCompanyId(tenantId: string, companyId: string): Promise<CompanyListDto | any> {
		try {
			const response = await axios.get<CompanyListDto>(
				`${config.ryzrApiURL}/api/v1/companies/${tenantId}/${companyId}`
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

	async createCompany(
		companyData: CompanyCreateDto
	): Promise<CompanyListDto | any> {
		try {
			const response = await axios.post<CompanyListDto>(
				`${config.ryzrApiURL}/api/v1/companies`,
				companyData,
				{
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
				}
			);
			if (response.status !== 200) {
				throw response;
			}
			return response.data;
		} catch (error) {
			const errorInfo = handleAxiosError(error);
			console.error("Error creating company:", errorInfo.message);

			//rethrowing for conditional rendering
			throw errorInfo;
		}
	}
}

const companyService = new CompanyService();
export default companyService;
