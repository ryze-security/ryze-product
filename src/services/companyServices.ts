import { CompanyListDto } from "@/models/company/companyListDto";
import { handleAxiosError } from "@/utils/handleAxiosError";
import axios from "axios";

export class CompanyService {
    async getCompanyByTenantId(tenant_id: string): Promise<CompanyListDto[] | any> {
        try {
            const response = await axios.get<CompanyListDto[]>(
                `https://ryzr-be-cwacd8a5c6c8d7bd.francecentral-01.azurewebsites.net/api/v1/companies/${tenant_id}`
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

const companyService = new CompanyService();
export default companyService;