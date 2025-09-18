import { createSlice } from "@reduxjs/toolkit";

// Used by other reducers to fetch the Firebase User's idToken
// so the caller doesn't need to pass it every time
export const authSlice = createSlice({
  name: "auth",
  initialState: {
    firebaseUser: null,
  },
  reducers: {
    setFirebaseUser: (state, action) => {
      state.firebaseUser = action.payload;
    },
    clearFirebaseUser: (state) => {
      state.firebaseUser = null;
    },
  },
});

export const { setFirebaseUser, clearFirebaseUser } = authSlice.actions;
export default authSlice.reducer;
