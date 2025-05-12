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
			}
		} as evalutaionDetailDTO,
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
