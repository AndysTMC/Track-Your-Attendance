// /redux/userSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { UserData } from "@/app/utils/hybrid";
import { generateChecksum } from "@/app/utils/hybrid";
import { clear } from "console";

interface UserState {
	inQueue: number;
	userData: UserData | null;
	error: string | null;
	errorStatusCode: number | null;
	fetchInProgress: boolean;
	requestProcessing: boolean;
}

const initialState: UserState = {
	inQueue: -1,
	userData: null,
	error: null,
	errorStatusCode: null,
	fetchInProgress: false,
	requestProcessing: false,
};

export const scrape = createAsyncThunk(
	"",
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

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		clearLocalStorageData: () => {
			localStorage.removeItem("TYASRMAPUDATA");
			localStorage.removeItem("TYASRMAPREGNO");
			localStorage.removeItem("TYASRMAPDKEY");
		},
		exit: (state) => {
			state.userData = null;
			state.inQueue = -1;
			state.error = null;
		},
		setError: (state, action) => {
			state.error = action.payload;
		},
		clearError: (state) => {
			state.error = null;
			state.errorStatusCode = null;
		},
		setUserData: (state, action) => {
			state.userData = action.payload;
		},
		setInQueueINF: (state) => {
			state.inQueue = Infinity;
		},
		setFetchInProgress: (state, action) => {
			state.fetchInProgress = action.payload;
		},
		setRequestProcessing: (state, action) => {
			state.requestProcessing = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(scrape.fulfilled, (state, action) => {
				state.requestProcessing = false;
				if (action.payload.error) {
					state.error = action.payload.error;
					state.errorStatusCode = action.payload.status;
					state.inQueue = 0;
					state.fetchInProgress = action.payload.inProgress;
				} else if (action.payload.inQueue != null) {
					state.inQueue = action.payload.inQueue;
				} else if (action.payload.userData) {
					state.fetchInProgress = false;
					state.userData = action.payload.userData;
					localStorage.setItem(
						"TYASRMAPUDATA",
						JSON.stringify(action.payload.userData)
					);
					localStorage.setItem("TYASRMAPDKEY", action.payload.dKey);
					localStorage.setItem("TYASRMAPREGNO", action.payload.regNo);
					state.error = null;
					state.errorStatusCode = null;
					state.inQueue = 0;
				} else if (action.payload.dKey) {
					localStorage.setItem("TYASRMAPDKEY", action.payload.dKey);
					localStorage.setItem("TYASRMAPREGNO", action.payload.regNo);
					state.error = null;
					state.errorStatusCode = null;
				}
			})
			.addCase(scrape.rejected, (state, action) => {
				state.requestProcessing = false;
				state.error = (action.payload as { error: string }).error;
				state.errorStatusCode = (
					action.payload as { status: number }
				).status;
				state.inQueue = 0;
			});
	},
});

export const {
	exit,
	clearLocalStorageData,
	setUserData,
	setInQueueINF,
	setFetchInProgress,
	clearError,
	setError,
	setRequestProcessing,
} = userSlice.actions;
export default userSlice.reducer;
