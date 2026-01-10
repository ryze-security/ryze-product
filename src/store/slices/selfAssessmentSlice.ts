import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import selfAssessmentService from "@/services/selfAssessmentServices";
import { handleAxiosError } from "@/utils/handleAxiosError";
import {
	AssessmentBulkSubmission,
	AssessmentResultResponse,
	DomainQuestion,
	GuestStartRequest,
	SavedProgressResponse,
} from "@/models/selfAssessment/selfAssessmentDTOs";

// --- STATE DEFINITION ---

interface SelfAssessmentState {
	// Session Data
	token: string | null;
	submissionId: number | null;
	status: "idle" | "loading" | "succeeded" | "failed";
	error: string | null;

	// The "Form" Data
	domains: DomainQuestion[];
	answers: Record<number, number>;

	// UX State
	isSaving: boolean; // For "Auto-saving..." indicator
	lastSavedAt: string | null;
    isSyncError: boolean;

	// Final Results
	result: AssessmentResultResponse | null;
}

const initialState: SelfAssessmentState = {
	token: new URLSearchParams(window.location.search).get("token"), // Hydrate from storage if possible
	submissionId: null,
	status: "idle",
	error: null,
	domains: [],
	answers: {},
	isSaving: false,
	lastSavedAt: null,
    isSyncError: false,
	result: null,
};

// --- ASYNC THUNKS ---

// 1. Start Session
export const startAssessmentSession = createAsyncThunk(
	"selfAssessment/start",
	async (data: GuestStartRequest, { rejectWithValue }) => {
		try {
			return await selfAssessmentService.startSession(data);
		} catch (error) {
			return rejectWithValue(handleAxiosError(error).message);
		}
	}
);

// 2. Fetch Questions (Static Content)
export const loadQuestions = createAsyncThunk(
	"selfAssessment/loadQuestions",
	async (_, { rejectWithValue }) => {
		try {
			return await selfAssessmentService.getQuestions();
		} catch (error) {
			return rejectWithValue(handleAxiosError(error).message);
		}
	}
);

// 3. Fetch Saved Progress (Resume)
export const loadProgress = createAsyncThunk(
	"selfAssessment/loadProgress",
	async (_, { rejectWithValue }) => {
		try {
			return await selfAssessmentService.getProgress();
		} catch (error) {
			return rejectWithValue(handleAxiosError(error).message);
		}
	}
);

// 4. Auto-Save Answers
export const autoSaveAnswers = createAsyncThunk(
	"selfAssessment/autoSave",
	async (payload: AssessmentBulkSubmission, { rejectWithValue }) => {
		try {
			// We don't really need the return value for state update, just confirmation it worked
			await selfAssessmentService.submitAnswers(payload);
			return new Date().toISOString();
		} catch (error) {
			// Silent fail is usually okay for auto-save, but let's track it
			return rejectWithValue(handleAxiosError(error).message);
		}
	}
);

// 5. Finalize & Get Results
export const completeAssessment = createAsyncThunk(
	"selfAssessment/complete",
	async (_, { rejectWithValue }) => {
		try {
			return await selfAssessmentService.completeAssessment();
		} catch (error) {
			return rejectWithValue(handleAxiosError(error).message);
		}
	}
);

// --- SLICE ---

const selfAssessmentSlice = createSlice({
	name: "selfAssessment",
	initialState,
	reducers: {
		// Immediate UI update (Optimistic Update)
		setAnswer: (
			state,
			action: PayloadAction<{ domainId: number; level: number }>
		) => {
			state.answers[action.payload.domainId] = action.payload.level;
		},
	},
	extraReducers: (builder) => {
		builder
			// --- Start Session ---
			.addCase(startAssessmentSession.pending, (state) => {
				state.status = "loading";
				state.error = null;
			})
			.addCase(startAssessmentSession.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.token = action.payload.access_token;
				state.submissionId = action.payload.submission_id;
			})
			.addCase(startAssessmentSession.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload as string;
			})

			// --- Load Questions ---
			.addCase(loadQuestions.fulfilled, (state, action) => {
				state.domains = action.payload.domains;
			})

			// --- Load Progress (Resume) ---
			.addCase(
				loadProgress.fulfilled,
				(state, action: PayloadAction<SavedProgressResponse>) => {
					state.submissionId = action.payload.submission_id;
					// Convert array back to Map {domainId: level}
					const answerMap: Record<number, number> = {};
					action.payload.answers.forEach((a) => {
						answerMap[a.domain_id] = a.selected_level;
					});
					state.answers = answerMap;
				}
			)

			// --- Auto Save ---
			.addCase(autoSaveAnswers.pending, (state) => {
				state.isSaving = true;
                state.isSyncError = false;
			})
			.addCase(autoSaveAnswers.fulfilled, (state, action) => {
				state.isSaving = false;
				state.lastSavedAt = action.payload;
			})
			.addCase(autoSaveAnswers.rejected, (state) => {
				state.isSaving = false;
                state.isSyncError = true;
			})

			// --- Complete ---
			.addCase(completeAssessment.pending, (state) => {
				state.status = "loading";
			})
			.addCase(completeAssessment.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.result = action.payload;
			})
			.addCase(completeAssessment.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload as string;
			});
	},
});

export const { setAnswer } = selfAssessmentSlice.actions;
export default selfAssessmentSlice.reducer;
