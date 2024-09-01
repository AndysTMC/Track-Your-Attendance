
// /redux/adminSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import cookie from 'cookie';


interface AdminState {
    adminError: string | null;
    adminErrorStatusCode: number | null;
    navigateToAdminControl: boolean;
}

const initialState: AdminState = {
    adminError: null,
    adminErrorStatusCode: null,
    navigateToAdminControl: false,
}

export const verifyAdmin = createAsyncThunk(
    '',
    async ({ adminPass }: { adminPass: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/admin/pass-verify', { adminPass }, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });
            return { ...response.data, status: response.status };
        } catch (error: any) {
            console.log(error.response.data.error);
            return rejectWithValue({ error: error.response.data.error, status: error.response.status });
        }
    }
);

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        setNavigateToAdminControl: (state, action) => {
            state.navigateToAdminControl = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(verifyAdmin.fulfilled, (state, action) => {
            console.log(action.payload);
            state.navigateToAdminControl = true;
        });
        builder.addCase(verifyAdmin.rejected, (state, action) => {
            console.log(action.payload);
            state.adminError = (action.payload as { error: string }).error;
            state.adminErrorStatusCode = (action.payload as { status: number }).status;
        });
    },
});

export default adminSlice.reducer;
export const { setNavigateToAdminControl } = adminSlice.actions;