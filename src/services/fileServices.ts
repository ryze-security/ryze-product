import { FilesUploadResponseDTO } from "@/models/files/FilesUploadResponseDTO";
import { handleAxiosError } from "@/utils/handleAxiosError";
import axiosInstance from "./axiosInstance";

export class FileService {
	async uploadFile(
		tenant_id: string,
		company_id: string,
		file: File,
		created_by: string
	): Promise<FilesUploadResponseDTO | any> {
		const formData = new FormData();
		formData.append("tenant_id", tenant_id);
		formData.append("company_id", company_id);
		formData.append("file", file);
		formData.append("created_by", created_by);

		try {
			const response = await axiosInstance.post<FilesUploadResponseDTO>(
				`/api/v1/documents/upload`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
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

	async getAllCompanyFiles(
		tenant_id: string,
		company_id: string
	): Promise<FilesUploadResponseDTO[] | any> {
		try {
			const response = await axiosInstance.get<FilesUploadResponseDTO[]>(
				`/api/v1/companies/${tenant_id}/${company_id}/documents`
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

	async deleteFile(
		tenant_id: string,
		company_id: string,
		file_id: string,
		deleted_by: string
	): Promise<string | any> {
		try {
			const response = await axiosInstance.delete<string>(
				`/api/v1/documents/${tenant_id}/${company_id}/${file_id}?deleted_by=${deleted_by}`
			);
			if (response.status !== 200) {
				throw response;
			}
			return response.data;
		} catch (error) {
			const errorInfo = handleAxiosError(error);
			console.error("Error deleting file:", errorInfo.message);

			//rethrowing for conditional rendering
			throw errorInfo;
		}
	}
}

const fileService = new FileService();
export default fileService;
