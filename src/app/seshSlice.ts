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
      .addCase(fetchSeshesForCurrentUser.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(fetchSeshesForCurrentUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Add any fetched posts to the array
        state.seshes = action.payload;
      })
      .addCase(fetchSeshesForCurrentUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Unknown Error";
      });
  },
});

export const fetchSeshesForCurrentUser = createAsyncThunk(
  "seshes/fetchAllSeshes",
  async (idToken: string) => {
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

export const createSesh = createAsyncThunk(
  "seshes/createSesh",
  async (data: { newSesh; idToken: string }) => {
    try {
      await fetch("/api/sesh", {
        method: "POST",
        body: JSON.stringify({ ...data.newSesh }),
        headers: {
          Authorization: `Bearer ${data.idToken}`,
        },
      });
    } catch (err) {
      console.error(err);
    }
  }
);

export const updateSesh = createAsyncThunk(
  "seshes/updateSesh",
  async (data: { id: number; updatedSesh; idToken: string }) => {
    try {
      await fetch(`/api/sesh/${data.id}`, {
        method: "PUT",
        body: JSON.stringify({ ...data.updatedSesh }),
        headers: {
          Authorization: `Bearer ${data.idToken}`,
        },
      });
    } catch (err) {
      console.error(err);
    }
  }
);

export const deleteSesh = createAsyncThunk(
  "seshes/deleteSesh",
  async (data: { id: number; idToken: string }) => {
    try {
      await fetch(`/api/sesh/${data.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${data.idToken}`,
        },
      });
    } catch (err) {
      console.error(err);
    }
  }
);

// export const { setSeshes } = seshSlice.actions;

export default seshSlice.reducer;
