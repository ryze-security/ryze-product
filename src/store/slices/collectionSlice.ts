import { collectionDataDTO } from "@/models/collection/collectionDTOs";
import collectionService from "@/services/collectionServices";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const loadCollections = createAsyncThunk(
	"collection/loadCollections",
	async (tenantId: string) => {
		return await collectionService.getCollections(tenantId);
	}
);

const collectionSlice = createSlice({
	name: "collections",
	initialState: {
		collection: {
			tenant_id: "",
			collections: [],
			total_available: 0,
			total_initiated: 0,
		} as collectionDataDTO,
		status: "idle",
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(loadCollections.pending, (state) => {
				state.status = "loading";
			})
			.addCase(loadCollections.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.collection = action.payload;
			})
			.addCase(loadCollections.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message ?? null;
			});
	},
});

export default collectionSlice.reducer;
