import { evaluationDetailData } from "@/models/evaluation/EvaluationDTOs";
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
		return await evaluationService.getEvaluationByDetails(
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
		data: {} as evaluationDetailData,
		status: "idle",
		error: null,
	},
	reducers: {},
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

export default evaluationSlice.reducer;
