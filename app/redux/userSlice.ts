// /redux/userSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Holiday, SpecialWorkingDay, UserData } from "@/app/utils/hybrid";

interface UserState {
	userData: UserData | null;
	error: string | null;
	errorStatusCode: number | null;
	holidays: Holiday[];
	messages: string[];
	messagesReceived: boolean;
	specialWorkingDays: SpecialWorkingDay[];
	fetchInProgress: boolean;
}

const initialState: UserState = {
	userData: null,
	error: null,
	errorStatusCode: null,
	fetchInProgress: false,
	holidays: [],
	messages: [],
	messagesReceived: false,
	specialWorkingDays: [],
};

export const scrape = createAsyncThunk(
	"scrape",
	async (
		{
			regNo,
			password,
			dKey,
			refetch,
		}: {
			regNo: string | null;
			password: string | null;
			dKey: string | null;
			refetch: boolean;
		},
		{ rejectWithValue }
	) => {
		try {
			const response = await axios.post(
				"/api/scrape",
				{ regNo, password, dKey, refetch },
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


export const getMessages = createAsyncThunk(
	"getMessages",
	async (_, { rejectWithValue }) => {
		try {
			const response = await axios.get("/api/admin/messages");
			return { ...response.data, status: response.status };
		} catch (error: any) {
			return rejectWithValue({
				error: error.response.data.error,
				status: error.response.status,
			});
		}
	}
);

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		clearLocalStorageData: () => {
			localStorage.removeItem("TYASRMAPUDATA");
			localStorage.removeItem("TYASRMAPREGNO");
			localStorage.removeItem("TYASRMAPDKEY");
			localStorage.removeItem("TYASRMAPHDATA");
			localStorage.removeItem("TYASRMAPSWDATA");
		},
		exit: (state) => {
			state.userData = null;
			state.error = null;
		},
		setError: (state, action) => {
			state.error = action.payload;
			state.errorStatusCode = 401;
		},
		clearError: (state) => {
			state.error = null;
			state.errorStatusCode = null;
		},
		setData: (state, action) => {
			state.userData = action.payload.userData;
			state.holidays = action.payload.holidays;
			state.specialWorkingDays = action.payload.specialWorkingDays;
		},
		setFetchInProgress: (state, action) => {
			state.fetchInProgress = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(scrape.fulfilled, (state, action) => {
				state.fetchInProgress = false;
				if (action.payload.error) {
					state.error = action.payload.error;
					state.errorStatusCode = action.payload.status;
				} else {
					state.userData = action.payload.userData;
					state.holidays = action.payload.holidays;
					state.specialWorkingDays = action.payload.specialWorkingDays;
					localStorage.setItem("TYASRMAPUDATA", JSON.stringify(action.payload.userData));
					localStorage.setItem("TYASRMAPHDATA", JSON.stringify(action.payload.holidays));
					localStorage.setItem("TYASRMAPSWDATA", JSON.stringify(action.payload.specialWorkingDays));
					localStorage.setItem("TYASRMAPDKEY", action.payload.dKey);
					localStorage.setItem("TYASRMAPREGNO", action.payload.regNo);
					state.error = null;
					state.errorStatusCode = null;
				} 
			})
			.addCase(scrape.rejected, (state, action) => {
				state.fetchInProgress = false;
				state.error = (action.payload as { error: string }).error;
				state.errorStatusCode = (
					action.payload as { status: number }
				).status;
			})
			.addCase(getMessages.fulfilled, (state, action) => {
				console.log(action.payload);
				state.messages = action.payload.messages;
				state.messagesReceived = true;
				localStorage.setItem("TYASRMAPANNO", JSON.stringify(action.payload.messages));
			})
			.addCase(getMessages.pending, (state) => {
				state.messages = [];
			})
			.addCase(getMessages.rejected, (state, action) => {
				state.error = (action.payload as { error: string }).error;
				state.errorStatusCode = (action.payload as { status: number }).status;
			});
	},
});

export const {
	exit,
	clearLocalStorageData,
	setData,
	setFetchInProgress,
	clearError,
	setError,
} = userSlice.actions;
export default userSlice.reducer;
