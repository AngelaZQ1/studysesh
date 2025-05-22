import { configureStore } from "@reduxjs/toolkit";
import seshReducer from "./seshSlice";

export default configureStore({
  reducer: {
    sesh: seshReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;