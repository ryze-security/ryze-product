import { handleAxiosError } from "@/utils/handleAxiosError";
import axiosInstance from "./axiosInstance";
import { collectionDataDTO, frequentDeviationsDTO } from "@/models/collection/collectionDTOs";

export class CollectionService {
    async getCollections(tenantId: string): Promise<collectionDataDTO | any> {
        try{
            const response = await axiosInstance.get<collectionDataDTO>(`/api/v1/tenants/${tenantId}/collections`);
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

    async getFrequentDeviations(tenantId: string): Promise<frequentDeviationsDTO | any> {
        try{
            const response = await axiosInstance.get<frequentDeviationsDTO>(`/api/v1/tenants/${tenantId}/deviations`);
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

const collectionService = new CollectionService();
export default collectionService;