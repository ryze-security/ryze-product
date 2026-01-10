import axios from "axios";
import {
	AssessmentBulkSubmission,
	AssessmentResultResponse,
	GuestSessionResponse,
	GuestStartRequest,
	QuestionListResponse,
	SavedProgressResponse,
} from "../models/selfAssessment/selfAssessmentDTOs";

const BASE_URL = String(import.meta.env.VITE_RYZR_API_URL);

const guestAxios = axios.create({
	baseURL: BASE_URL + "/api/v1/self-assessment", // Set the base path here
});

const getGuestToken = () => {
	const params = new URLSearchParams(window.location.search);
	return params.get("token");
};

// Helper to get headers
const getAuthHeaders = () => {
	const token = getGuestToken();
	return token ? { Authorization: `Bearer ${token}` } : {};
};

const selfAssessmentService = {
	/**
	 * Step 1: Start Session (Public)
	 * Saves the received token to localStorage automatically.
	 */
	startSession: async (
		data: GuestStartRequest
	): Promise<GuestSessionResponse> => {
		const response = await guestAxios.post<GuestSessionResponse>(
			`/start`,
			data
		);

		return response.data;
	},

	/**
	 * Step 2: Fetch Questions (Protected)
	 */
	getQuestions: async (): Promise<QuestionListResponse> => {
		const response = await guestAxios.get<QuestionListResponse>(
			`/questions`,
			{ headers: getAuthHeaders() }
		);
		return response.data;
	},

	/**
	 * Step 3: Fetch Saved Progress (Protected)
	 * Used for "Resume" functionality on page reload.
	 */
	getProgress: async (): Promise<SavedProgressResponse> => {
		const response = await guestAxios.get<SavedProgressResponse>(
			`/progress`,
			{ headers: getAuthHeaders() }
		);
		return response.data;
	},

	/**
	 * Step 4: Submit Answers (Protected)
	 * Handles "Auto-save".
	 */
	submitAnswers: async (data: AssessmentBulkSubmission): Promise<any> => {
		const response = await guestAxios.post(`/submit-answers`, data, {
			headers: getAuthHeaders(),
		});
		return response.data;
	},

	/**
	 * Step 5: Complete & Calculate (Protected)
	 * Returns the final report data.
	 */
	completeAssessment: async (): Promise<AssessmentResultResponse> => {
		const response = await guestAxios.post<AssessmentResultResponse>(
			`/complete`,
			{}, // Empty body
			{ headers: getAuthHeaders() }
		);
		return response.data;
	},

	/**
	 * Utility: Check if a session exists locally
	 */
	hasActiveSession: (): boolean => {
		return !!getGuestToken();
	},
};

export default selfAssessmentService;
