import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const getIdToken = async (getState: () => any) => {
  const state = getState();
  const firebaseUser = state.auth.firebaseUser;
  return await firebaseUser.getIdToken();
};

export const seshSlice = createSlice({
  name: "sesh",
  initialState: {
    seshes: [],
    status: "idle" as "idle" | "pending" | "succeeded" | "failed",
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSeshes.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(fetchSeshes.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Add any fetched posts to the array
        state.seshes = action.payload;
      })
      .addCase(fetchSeshes.rejected, (state, action) => {
        state.status = "failed";
        // if rejectWithValue was used to pass a specific error message
        if (action.payload) {
          state.error = action.payload as string;
        } else {
          state.error = action.error.message ?? "Unknown Error";
        }
      });
  },
});

export const fetchSeshes = createAsyncThunk(
  "seshes/fetchSeshes",
  async (data: { userId: number }, { rejectWithValue, getState }) => {
    try {
      const idToken = await getIdToken(getState);
      const res = await fetch(`/api/sesh?userId=${data.userId}`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      const seshes = await res.json();
      return seshes;
    } catch (err) {
      console.error(err);
      return rejectWithValue(err);
    }
  }
);

export const createSesh = createAsyncThunk(
  "seshes/createSesh",
  async (data: { newSesh: any }, { rejectWithValue, getState }) => {
    try {
      const idToken = await getIdToken(getState);
      await fetch("/api/sesh", {
        method: "POST",
        body: JSON.stringify({ ...data.newSesh }),
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
    } catch (err) {
      console.error(err);
      return rejectWithValue(err);
    }
  }
);

export const updateSesh = createAsyncThunk(
  "seshes/updateSesh",
  async (
    data: { id: number; updatedSesh: any },
    { rejectWithValue, getState }
  ) => {
    try {
      const idToken = await getIdToken(getState);
      await fetch(`/api/sesh/${data.id}`, {
        method: "PUT",
        body: JSON.stringify({ ...data.updatedSesh }),
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
    } catch (err) {
      console.error(err);
      return rejectWithValue(err);
    }
  }
);

export const deleteSesh = createAsyncThunk(
  "seshes/deleteSesh",
  async (data: { id: number }, { rejectWithValue, getState }) => {
    try {
      const idToken = await getIdToken(getState);
      await fetch(`/api/sesh/${data.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
    } catch (err) {
      console.error(err);
      return rejectWithValue(err);
    }
  }
);

// export const { setSeshes } = seshSlice.actions;

export default seshSlice.reducer;
