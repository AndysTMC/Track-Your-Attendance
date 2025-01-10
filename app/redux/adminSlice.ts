// /redux/adminSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Holiday, SpecialWorkingDay } from "@/app/utils/hybrid";
import { AdminData } from "@/app/utils/hybrid";

axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.post["Accept"] = "application/json";

interface AdminState {
	adminError: string | null;
	isAdminStateUpdating: boolean;
	adminErrorStatusCode: number | null;
	navigateToAdminControl: boolean;
	adminData: AdminData | null;
}

const initialState: AdminState = {
	adminError: null,
	isAdminStateUpdating: false,
	adminErrorStatusCode: null,
	navigateToAdminControl: false,
	adminData: null,
};

export const verifyAdmin = createAsyncThunk(
	"admin/verifyAdmin",
	async ({ adminPass }: { adminPass: string }, { rejectWithValue }) => {
		try {
			const response = await axios.post(
				"/api/admin/pass-verify",
				{ adminPass },
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			return { ...response.data, status: response.status };
		} catch (error: any) {
			return rejectWithValue({
				error: error.response.data.error,
				status: error.response.status,
			});
		}
	}
);

export const addOrRemoveHoliday = createAsyncThunk(
	"admin/addOrRemoveHoliday",
	async (
		{ add, date, name }: { add: boolean; date: string; name: string },
		{ rejectWithValue }
	) => {
		try {
			const response = await axios.post("/api/admin/holidays", {
				add,
				date,
				name,
			});
			return {
				...response.data,
				status: response.status,
				holidays: response.data.holidays as Holiday[],
			};
		} catch (error: any) {
			return rejectWithValue({
				error: error.response.data.error,
				status: error.response.status,
			});
		}
	}
);

export const addOrRemoveSpecialWorkingDay = createAsyncThunk(
	"admin/addOrRemoveSpecialWorkingDay",
	async (
		{
			add,
			date,
			replacementDay,
		}: { add: boolean; date: string; replacementDay: number },
		{ rejectWithValue }
	) => {
		try {
			const response = await axios.post("/api/admin/swdays", {
				add,
				date,
				replacementDay,
			});
			return {
				...response.data,
				status: response.status,
				holidays: response.data.holidays as SpecialWorkingDay[],
			};
		} catch (error: any) {
			return rejectWithValue({
				error: error.response.data.error,
				status: error.response.status,
			});
		}
	}
);

export const addOrRemoveMessage = createAsyncThunk(
	"admin/addOrRemoveMessage",
	async (
		{ add, message }: { add: boolean; message: string },
		{ rejectWithValue }
	) => {
		try {
			const response = await axios.post("/api/admin/messages", {
				add,
				message,
			});
			return { ...response.data, status: response.status };
		} catch (error: any) {
			return rejectWithValue({
				error: error.response.data.error,
				status: error.response.status,
			});
		}
	}
);

export const fetchAdminData = createAsyncThunk(
	"admin/fetchAdminData",
	async (_, { rejectWithValue }) => {
		try {
			const response = await axios.get("/api/admin/data");
			return { ...response.data, status: response.status };
		} catch (error: any) {
			return rejectWithValue({
				error: error.response.data.error,
				status: error.response.status,
			});
		}
	}
);

export const setProperties = createAsyncThunk(
	"admin/setProperties",
	async (
		{
			semStartDate,
			semEndDate,
			inMaintenance,
			isAvailable,
		}: { semStartDate: string; semEndDate: string; inMaintenance: boolean, isAvailable: boolean },
		{ rejectWithValue }
	) => {
		try {
			const response = await axios.post("/api/admin/properties", {
				semStartDate,
				semEndDate,
				inMaintenance,
				isAvailable,
			});
			return { ...response.data, status: response.status };
		} catch (error: any) {
			return rejectWithValue({
				error: error.response.data.error,
				status: error.response.status,
			});
		}
	}
);

const adminSlice = createSlice({
	name: "admin",
	initialState,
	reducers: {
		clearAdminError: (state) => {
			state.adminError = null;
			state.adminErrorStatusCode = null;
		},
		setNavigateToAdminControl: (state, action) => {
			state.navigateToAdminControl = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(verifyAdmin.pending, (state) => {
			state.navigateToAdminControl = false;
			state.isAdminStateUpdating = true;
		});
		builder.addCase(verifyAdmin.fulfilled, (state) => {
			state.navigateToAdminControl = true;
			state.isAdminStateUpdating = false;
		});
		builder.addCase(verifyAdmin.rejected, (state, action) => {
			state.adminError = (action.payload as { error: string }).error;
			state.adminErrorStatusCode = (
				action.payload as { status: number }
			).status;
			state.isAdminStateUpdating = false;
		});
		builder.addCase(addOrRemoveHoliday.pending, (state) => {
			state.isAdminStateUpdating = true;
		});
		builder.addCase(addOrRemoveHoliday.fulfilled, (state, action) => {
			if (state.adminData)
				state.adminData.holidays = action.payload.holidays;
			state.isAdminStateUpdating = false;
		});
		builder.addCase(addOrRemoveHoliday.rejected, (state, action) => {
			state.adminError = (action.payload as { error: string }).error;
			state.adminErrorStatusCode = (
				action.payload as { status: number }
			).status;
			state.isAdminStateUpdating = false;
		});
		builder.addCase(addOrRemoveSpecialWorkingDay.pending, (state) => {
			state.isAdminStateUpdating = true;
		});
		builder.addCase(
			addOrRemoveSpecialWorkingDay.fulfilled,
			(state, action) => {
				if (state.adminData)
					state.adminData.specialWorkingDays =
						action.payload.specialWorkingDays;
				state.isAdminStateUpdating = false;
			}
		);
		builder.addCase(
			addOrRemoveSpecialWorkingDay.rejected,
			(state, action) => {
				state.adminError = (action.payload as { error: string }).error;
				state.adminErrorStatusCode = (
					action.payload as { status: number }
				).status;
				state.isAdminStateUpdating = false;
			}
		);
		builder.addCase(setProperties.pending, (state) => {
			state.isAdminStateUpdating = true;
		});
		builder.addCase(setProperties.fulfilled, (state, action) => {
			if (state.adminData) {
				state.adminData.semStartDate = action.payload.semStartDate;
				state.adminData.semEndDate = action.payload.semEndDate;
				state.adminData.inMaintenance = action.payload.inMaintenance;
				state.adminData.isAvailable = action.payload.isAvailable
			}
			state.isAdminStateUpdating = false;
		});
		builder.addCase(setProperties.rejected, (state, action) => {
			state.adminError = (action.payload as { error: string }).error;
			state.adminErrorStatusCode = (
				action.payload as { status: number }
			).status;
			state.isAdminStateUpdating = false;
		});
		builder.addCase(addOrRemoveMessage.pending, (state) => {
			state.isAdminStateUpdating = true;
		});
		builder.addCase(addOrRemoveMessage.fulfilled, (state, action) => {
			if (state.adminData) {
				state.adminData.messages = action.payload.messages;
			}
			state.isAdminStateUpdating = false;
		});
		builder.addCase(addOrRemoveMessage.rejected, (state, action) => {
			state.adminError = (action.payload as { error: string }).error;
			state.adminErrorStatusCode = (
				action.payload as { status: number }
			).status;
			state.isAdminStateUpdating = false;
		});
		builder.addCase(fetchAdminData.pending, (state) => {
			state.adminData = null;
			state.isAdminStateUpdating = true;
		});
		builder.addCase(fetchAdminData.fulfilled, (state, action) => {
			state.adminData = action.payload.adminData as AdminData;
			state.isAdminStateUpdating = false;
		});
		builder.addCase(fetchAdminData.rejected, (state, action) => {
			state.adminError = (action.payload as { error: string }).error;
			state.adminErrorStatusCode = (
				action.payload as { status: number }
			).status;
			state.isAdminStateUpdating = false;
		});
	},
});

export default adminSlice.reducer;
export const { clearAdminError, setNavigateToAdminControl } =
	adminSlice.actions;
