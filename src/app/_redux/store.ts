import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import seshReducer from "./seshSlice";

export const store = configureStore({
  reducer: {
    sesh: seshReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["auth/setFirebaseUser"],
        ignoredPaths: ["auth.firebaseUser"],
      },
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
