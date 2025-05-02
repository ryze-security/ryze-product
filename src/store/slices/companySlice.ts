import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import companyService from "@/services/companyServices";
import { CompanyListDto } from "@/models/company/companyDTOs";

export const loadCompanyData = createAsyncThunk(
	"company/companyDataList",
	async (tenant_id: string) => {
		return await companyService.getCompanyByTenantId(tenant_id);
	}
);

const companySlice = createSlice({
	name: "company",
	initialState: {
		data: [] as CompanyListDto[],
		status: "idle",
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(loadCompanyData.pending, (state) => {
				state.status = "loading";
			})
			.addCase(loadCompanyData.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.data = action.payload;
			})
			.addCase(loadCompanyData.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message ?? null;
			});
	},
});

export default companySlice.reducer;
