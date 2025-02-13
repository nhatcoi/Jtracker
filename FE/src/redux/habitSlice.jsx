import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Giả sử đây là API fetch habits
export const fetchHabits = createAsyncThunk("habits/fetchHabits", async () => {
    const response = await fetch("/api/habits"); // Thay bằng API thật nếu có
    return response.json();
});

const habitSlice = createSlice({
    name: "habits",
    initialState: { list: [], status: "idle", error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchHabits.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchHabits.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.list = action.payload;
            })
            .addCase(fetchHabits.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            });
    },
});

export default habitSlice.reducer;
