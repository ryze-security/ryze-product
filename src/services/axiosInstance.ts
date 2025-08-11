import axios from "axios";

const apiUrl = String(import.meta.env.VITE_RYZR_API_URL);

if (!apiUrl) {
    console.error("ERROR: API_URL is not defined! Check your .env file.");
}

const axiosInstance = axios.create({
	baseURL: apiUrl,
});

export default axiosInstance;
