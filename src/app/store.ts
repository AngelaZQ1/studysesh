import { configureStore } from "@reduxjs/toolkit";
import seshReducer from "./seshSlice";

export default configureStore({
  reducer: {
    sesh: seshReducer,
  },
});
