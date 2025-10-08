import {
    contactUsBodyDTO,
    contactUsResponseDTO,
    customFormResponseDTO,
    requestCreditsBodyDTO,
    requestFrameworkBodyDTO,
} from "@/models/landing_page/contact_usDTOs";
import { handleAxiosError } from "@/utils/handleAxiosError";
import axiosInstance from "./axiosInstance";
import { CustomFormListResponseDTO } from "@/models/forms/FormsResponseDTO";

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

    async getFormsList(options?: {
        tenant_id?: string | null;
        form_type?: "request_framework" | "request_credits" | null;
        skip?: number;
        limit?: number;
    }): Promise<CustomFormListResponseDTO> {
        try {
            const params: Record<string, any> = {};
            if (options?.tenant_id) params.tenant_id = options.tenant_id;
            if (options?.form_type) params.form_type = options.form_type;
            if (typeof options?.skip === "number") params.skip = options.skip;
            if (typeof options?.limit === "number")
                params.limit = options.limit;

            const response = await axiosInstance.get<CustomFormListResponseDTO>(
                `/api/v1/forms`,
                { params }
            );

            if (response.status !== 200) {
                throw response;
            }
            return response.data;
        } catch (error) {
            const errorInfo = handleAxiosError(error);
            console.error("Error fetching forms list:", errorInfo.message);
            throw errorInfo;
        }
    }
}

const customFormsService = new CustomFormsService();
export default customFormsService;
