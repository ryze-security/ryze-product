import { AuthorizationDTO } from "@/models/auth/AuthDTOs";
import {
	createAsyncThunk,
	createSlice,
} from "@reduxjs/toolkit";
import { AxiosInstance } from "axios";

const loadInitialState = (): AuthorizationDTO => {
	if(process.env.NODE_ENV === 'development') {
		return {
			clerk_user_id: "",
			email: "",
			first_name: "Aditya",
			last_name: "",
			tenant_id: "7077beec-a9ef-44ef-a21b-83aab58872c9",
			user_id: "",
			created_at: "",
			status: "idle",
		};
	}
	try {
		const storedState = localStorage.getItem("appUser");
		if (storedState) {
			return JSON.parse(storedState) as AuthorizationDTO;
		}
	} catch (error) {
		console.error("Failed to load appUser state from localStorage:", error);
	}
	return {
		clerk_user_id: "",
		email: "",
		first_name: "",
		last_name: "",
		tenant_id: "",
		user_id: "",
		created_at: "",
		status: "idle",
	};
};

const initialState: AuthorizationDTO = loadInitialState();

export const fetchUserAppData = createAsyncThunk(
	"appUser/fetchUserAppData",
	async (axios: AxiosInstance, { rejectWithValue }) => {
		try {
			const response = await axios.get("/api/v1/users/me");
			return response.data;
		} catch (error: any) {
			return rejectWithValue(error.response?.data);
		}
	}
);

const appUserSlice = createSlice({
	name: "appUser",
	initialState,
	reducers: {
		logout: (state: AuthorizationDTO) => {
			state.clerk_user_id = "";
			state.email = "";
			state.first_name = "";
			state.last_name = "";
			state.tenant_id = "";
			state.user_id = "";
			state.created_at = "";
			state.status = "idle";
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchUserAppData.pending, (state) => {
				state.status = "loading";
			})
			.addCase(fetchUserAppData.fulfilled, (state, action) => {
				state.status = "fulfilled";
				state.clerk_user_id = action.payload.clerk_user_id;
				state.email = action.payload.email;
				state.first_name = action.payload.first_name;
				state.last_name = action.payload.last_name;
				state.tenant_id = action.payload.tenant_id;
				state.user_id = action.payload.user_id;
				state.created_at = action.payload.created_at;
			})
			.addCase(fetchUserAppData.rejected, (state) => {
				state.status = "failed";
			});
	},
});

export const { logout } = appUserSlice.actions;
export default appUserSlice.reducer;
