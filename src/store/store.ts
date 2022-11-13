import { configureStore } from "@reduxjs/toolkit";
import streamsReducer from "./streams";
import consumersReducer from "./consumers";

export const store = configureStore({
  reducer: {
    streams: streamsReducer,
    consumers: consumersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
