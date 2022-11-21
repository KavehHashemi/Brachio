import { configureStore } from "@reduxjs/toolkit";
import streamsReducer from "./streams";

export const store = configureStore({
  reducer: {
    streams: streamsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "streams/connectToServer/fulfilled",
          "streams/setJetstreamManager/fulfilled",
          "streams/listJetstreams/fulfilled",
          "streams/editStream/fulfilled",
        ],
        ignoredPaths: [
          "streams.natsConnection",
          "streams.jetstreamManager",
          "streams.listJetstreams",
        ],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
