// /redux/adminSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Holiday, SpecialWorkingDay } from '@/app/utils/hybrid';
import { AdminData } from '@/app/utils/hybrid';

axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post['Accept'] = 'application/json';

interface AdminState {
    adminError: string | null;
    adminErrorStatusCode: number | null;
    navigateToAdminControl: boolean;
    adminData: AdminData | null;
}

const initialState: AdminState = {
    adminError: null,
    adminErrorStatusCode: null,
    navigateToAdminControl: false,
    adminData: null,
}

export const verifyAdmin = createAsyncThunk(
    'admin/verifyAdmin',
    async ({ adminPass }: { adminPass: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/admin/pass-verify', { adminPass }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return { ...response.data, status: response.status };
        } catch (error: any) {
            return rejectWithValue({ error: error.response.data.error, status: error.response.status });
        }
    }
);

export const addOrRemoveHoliday = createAsyncThunk(
    'admin/addOrRemoveHoliday',
    async ({ add, date, name }: { add: boolean, date: string, name: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/admin/holidays', { add, date, name });
            return { ...response.data, status: response.status, holidays: response.data.holidays as Holiday[] };
        } catch (error: any) {
            return rejectWithValue({ error: error.response.data.error, status: error.response.status });
        }
    }
);


export const addOrRemoveSpecialWorkingDay = createAsyncThunk(
    'admin/addOrRemoveSpecialWorkingDay',
    async ({ add, date, replacementDay }: { add: boolean, date: string, replacementDay: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/admin/swdays', { add, date, replacementDay });
            return { ...response.data, status: response.status, holidays: response.data.holidays as SpecialWorkingDay[] };
        } catch (error: any) {
            return rejectWithValue({ error: error.response.data.error, status: error.response.status });
        }
    }
);

export const fetchAdminData = createAsyncThunk(
    'admin/fetchAdminData',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/api/admin/data');
            return { ...response.data, status: response.status };
        } catch (error: any) {
            return rejectWithValue({ error: error.response.data.error, status: error.response.status });
        }
    }
);

export const setProperties = createAsyncThunk(
    'admin/setProperties',
    async ({ semStartDate, semEndDate, inMaintenance }: { semStartDate: string, semEndDate: string, inMaintenance: boolean }, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/admin/properties', { semStartDate, semEndDate, inMaintenance });
            return { ...response.data, status: response.status };
        } catch (error: any) {
            return rejectWithValue({ error: error.response.data.error, status: error.response.status });
        }
    }
);

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        clearAdminError: (state) => {
            state.adminError = null;
            state.adminErrorStatusCode = null;
        },
        clearAdminData: (state) => {
            state.adminData = null;
        },
        setNavigateToAdminControl: (state, action) => {
            state.navigateToAdminControl = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(verifyAdmin.fulfilled, (state) => {
            state.navigateToAdminControl = true;
        });
        builder.addCase(verifyAdmin.rejected, (state, action) => {
            state.adminError = (action.payload as { error: string }).error;
            state.adminErrorStatusCode = (action.payload as { status: number }).status;
        });
        builder.addCase(addOrRemoveHoliday.fulfilled, (state, action) => {
            if (state.adminData) state.adminData.holidays = action.payload.holidays;
        });
        builder.addCase(addOrRemoveHoliday.rejected, (state, action) => {
            state.adminError = (action.payload as { error: string }).error;
            state.adminErrorStatusCode = (action.payload as { status: number }).status;
        });
        builder.addCase(addOrRemoveSpecialWorkingDay.fulfilled, (state, action) => {
            if (state.adminData) state.adminData.specialWorkingDays = action.payload.specialWorkingDays;
        });
        builder.addCase(addOrRemoveSpecialWorkingDay.rejected, (state, action) => {
            state.adminError = (action.payload as { error: string }).error;
            state.adminErrorStatusCode = (action.payload as { status: number }).status;
        });
        builder.addCase(setProperties.rejected, (state, action) => {
            state.adminError = (action.payload as { error: string }).error;
            state.adminErrorStatusCode = (action.payload as { status: number }).status;
        });
        builder.addCase(fetchAdminData.fulfilled, (state, action) => {
            state.adminData = action.payload.adminData as AdminData;
        });
        builder.addCase(fetchAdminData.rejected, (state, action) => {
            state.adminError = (action.payload as { error: string }).error;
            state.adminErrorStatusCode = (action.payload as { status: number }).status;
        });
    },
});

export default adminSlice.reducer;
export const { clearAdminError, clearAdminData, setNavigateToAdminControl } = adminSlice.actions;
