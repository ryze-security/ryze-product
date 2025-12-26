import { handleAxiosError } from "@/utils/handleAxiosError";
import axiosInstance from "./axiosInstance";
import {
    collectionDataDTO,
    createCustomFrameworkRequest,
    createCustomFrameworkResponse,
    customFrameworkResponse,
    frequentDeviationsDTO,
} from "@/models/collection/collectionDTOs";

export class CollectionService {
    async getCollections(tenantId: string): Promise<collectionDataDTO | any> {
        try {
            const response = await axiosInstance.get<collectionDataDTO>(
                `/api/v1/tenants/${tenantId}/collections`
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

    async getFrequentDeviations(
        tenantId: string
    ): Promise<frequentDeviationsDTO | any> {
        try {
            const response = await axiosInstance.get<frequentDeviationsDTO>(
                `/api/v1/tenants/${tenantId}/deviations`
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

    // For listing all domains and controls for creating a custom framework for user.
    async getCustomFrameworkDomains(): Promise<customFrameworkResponse | any> {
        try {
            const response = await axiosInstance.get<customFrameworkResponse>(
                "/api/v1/global-framework/summary"
            );

            if (response.status !== 200) {
                throw response;
            }

            // Sort the entire summary object by control_display_index
            const sortedSummary: customFrameworkResponse["summary"] = {};

            // Create an array of all controls with their category names
            const allControls: Array<{
                categoryName: string;
                control: {
                    control_display_index: string;
                    control_display_name: string;
                };
            }> = [];

            // Extract all controls from all categories
            Object.entries(response.data.summary).forEach(
                ([categoryName, controls]) => {
                    controls.forEach((control) => {
                        allControls.push({
                            categoryName,
                            control,
                        });
                    });
                }
            );

            // Sort all controls by their index numerically
            allControls.sort((a, b) => {
                const aIndex = parseInt(a.control.control_display_index);
                const bIndex = parseInt(b.control.control_display_index);
                return aIndex - bIndex;
            });

            // Rebuild the summary object with controls in sorted order
            allControls.forEach(({ categoryName, control }) => {
                if (!sortedSummary[categoryName]) {
                    sortedSummary[categoryName] = [];
                }
                sortedSummary[categoryName].push(control);
            });

            return {
                ...response.data,
                summary: sortedSummary,
            };
        } catch (error) {
            const errorInfo = handleAxiosError(error);
            console.error(
                "Error fetching custom framework:",
                errorInfo.message
            );

            // rethrowing for conditional rendering
            throw errorInfo;
        }
    }

    // Create custom framework from selected controls
    async createCustomFramework(
        requestData: createCustomFrameworkRequest
    ): Promise<createCustomFrameworkResponse | any> {
        try {
            const response =
                await axiosInstance.post<createCustomFrameworkResponse>(
                    `/api/v1/global-framework/create-collection`,
                    requestData,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                        },
                    }
                );

            if (response.status !== 200 && response.status !== 201) {
                throw response;
            }
            return response.data;
        } catch (error) {
            const errorInfo = handleAxiosError(error);
            console.error(
                "Error creating custom framework:",
                errorInfo.message
            );

            // rethrowing for conditional rendering
            throw errorInfo;
        }
    }
}

const collectionService = new CollectionService();
export default collectionService;
