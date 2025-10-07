import { handleAxiosError } from "@/utils/handleAxiosError";
import axiosInstance from "./axiosInstance";
import { tenantDetailsDTO } from "@/models/tenant/TenantDTOs";

export class TenantService {
    async getTenantDetails(tenant_id: string): Promise<tenantDetailsDTO | any> {
        try {
            const response = await axiosInstance.get<tenantDetailsDTO>(`/api/v1/tenants/${tenant_id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });
            if (response.status !== 200) {
                throw response;
            }
            return response.data;
        } catch (error) {
            const errorInfo = handleAxiosError(error);
            console.error("Error fetching tenant details:", errorInfo.message);

            //rethrowing for conditional rendering
            throw errorInfo;
        }
    }

    async getTenantsList(): Promise<tenantDetailsDTO[] | any> {
        try {
            const response = await axiosInstance.get<tenantDetailsDTO[]>(`/api/v1/tenants`, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });
            if (response.status !== 200) {
                throw response;
            }
            return response.data;
        } catch (error) {
            const errorInfo = handleAxiosError(error);
            console.error("Error fetching tenants list:", errorInfo.message);

            //rethrowing for conditional rendering
            throw errorInfo;
        }
    }
}

const tenantService = new TenantService();
export default tenantService;