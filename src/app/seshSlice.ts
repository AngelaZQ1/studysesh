import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const seshSlice = createSlice({
  name: "sesh",
  initialState: {
    seshes: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllSeshes.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(fetchAllSeshes.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Add any fetched posts to the array
        state.seshes = action.payload;
      })
      .addCase(fetchAllSeshes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Unknown Error";
      });
  },
});

export const fetchAllSeshes = createAsyncThunk(
  "seshes/fetchAllSeshes",
  async (idToken: string) => {
    console.log("FETCH ALL SESHES");
    try {
      const res = await fetch(`/api/sesh`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      const seshes = await res.json();
      return seshes;
    } catch (err) {
      console.error(err);
    }
  }
);

// export const { setSeshes } = seshSlice.actions;

export default seshSlice.reducer;
