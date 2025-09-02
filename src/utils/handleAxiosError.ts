import axios, { AxiosError } from "axios";

export interface AxiosErrorInfo {
	statusCode: number;
	message: string;
	isAxiosError: boolean;
}

export function handleAxiosError(error: unknown): AxiosErrorInfo {
	if (axios.isAxiosError(error)) {		
		const axiosError = error as AxiosError<any>;
		const statusCode = axiosError.status ?? 500;
		const message =
			axiosError.response?.data?.message ||
			axiosError.message ||
			"Something went wrong";

		return {
			statusCode,
			message,
			isAxiosError: true,
		};
	}

	// Non-Axios error (e.g., coding bugs)
	return {
		statusCode: 500,
		message: (error as Error)?.message || "Unknown error occurred",
		isAxiosError: false,
	};
}
