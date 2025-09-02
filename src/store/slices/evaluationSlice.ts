import { evalutaionDetailDTO } from "@/models/evaluation/EvaluationDTOs";
import evaluationService from "@/services/evaluationServices";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface LoadEvaluationArgs {
	tenant_id: string;
	companyId: string;
	evaluationId: string;
}

export const loadEvaluationData = createAsyncThunk(
	"evaluation/getEvaluationByDetails",
	async ({ tenant_id, companyId, evaluationId }: LoadEvaluationArgs) => {
		return await evaluationService.evaluationService.getEvaluationByDetails(
			tenant_id,
			companyId,
			evaluationId
		);
	}
);

const evaluationSlice = createSlice({
	name: "evaluation",
	initialState: {
		//if object is null or undefined or (companyId or evalId) is different in the component than in the store, then it will be reloaded
		data: {
			status: "",
			data: {
				Status: "",
				UserId: "",
				TenantId: "",
				CompanyId: "",
				PolicyId: [],
				EvaluationId: "",
				updateTimestamp: 0,
				frameworkId: "",
				EvaluationResponse: {
					DomainResponseList: [],
					Response: {
						Score: 0,
					},
				},
			},
		} as evalutaionDetailDTO,
		status: "idle",
		error: null,
		questionMap: {} as Record<string, any>, // Map of questionId to questionResponse
	},
	reducers: {
		updateQuestionInStore: (state, action) => {
			const { questionId, observation, score } = action.payload;
			const question = state.questionMap[questionId];
			console.log("slice question "+question);
			if (question) {
				question.Response.Observation = observation;
				question.Response.Score = score.toString();
			}
		},
		buildQuestionMap: (state) => {
			const map = {};

			state.data.data.EvaluationResponse.DomainResponseList.forEach(
				(domain) => {
					domain.ControlResponseList.forEach((control) => {
						control.QuestionResponseList.forEach((question) => {
							map[question.q_id] = question;
						});
					});
				}
			);

			state.questionMap = map;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(loadEvaluationData.pending, (state) => {
				state.status = "loading";
			})
			.addCase(loadEvaluationData.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.data = action.payload;
			})
			.addCase(loadEvaluationData.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message ?? null;
			});
	},
});
export const { updateQuestionInStore, buildQuestionMap } =
	evaluationSlice.actions;
export default evaluationSlice.reducer;
