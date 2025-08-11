import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect } from "react";

const apiUrl = import.meta.env.VITE_RYZR_API_URL;

if (!apiUrl) {
    console.error("ERROR: API_URL is not defined! Check your .env file.");
}

const axiosInstance = axios.create({
	baseURL: apiUrl,
});

export function useAuthenticatedAxios() {
	const { getToken } = useAuth();

	useEffect(() => {
		const interceptor = axiosInstance.interceptors.request.use(
			async (config) => {
				const token = await getToken();
				if (token) {
					config.headers.Authorization = `Bearer ${token}`;
				}
				return config;
			}
		);

		return () => {
			axiosInstance.interceptors.request.eject(interceptor);
		};
	}, [getToken]);

    return axiosInstance;
}
