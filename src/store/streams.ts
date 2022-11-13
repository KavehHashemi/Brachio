import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { connect } from "nats.ws";
import { JetStreamClientImpl } from "nats.ws/lib/nats-base-client/jsclient";
import {
  JetStreamManager,
  Consumer,
  StreamInfo,
} from "nats.ws/lib/nats-base-client/types";

interface IinitialState {
  jsm: JetStreamClientImpl | undefined;
  jetstreamManager: JetStreamManager | null;
  jetstreams: StreamInfo[];
  searchResults: StreamInfo[];
  consumers: Consumer[];
  errorMessage: string | null;
}
const initialState: IinitialState = {
  jsm: undefined,
  jetstreamManager: null,
  jetstreams: [],
  searchResults: [],
  consumers: [],
  errorMessage: null,
};
export const setUpConnection = createAsyncThunk(
  "streams/setUpConnection",
  async (serverUrl: string, thunkAPI) => {
    const natsConnection = await connect({ servers: [serverUrl] });
    const jetstreamManager = await natsConnection.jetstreamManager();
    return jetstreamManager;
  }
);
export const listJetstreams = createAsyncThunk(
  "streams/listJetstreams",
  async (jetstreamManager: JetStreamManager, thunkAPI) => {
    const response = await jetstreamManager?.streams.list().next();
    return response;
  }
);
export const addNewJetstream = createAsyncThunk(
  "streams/addNewStream",
  async (config: any, thunkAPI) => {
    const StreamConfig = {
      name: config.name,
      subjects: config.subjects,
      storage: config.storage,
      num_replicas: config.replication,
      retention: config.retentionPolicy,
      discard: config.discardPolicy,
      max_msgs: config.messagesLimit,
      max_msgs_per_subject: config.perSubjectMessagesLimit,
      max_bytes: config.totalStreamsize,
      max_age: config.messageTTL * 1000000000, //seconds to NANOseconds
      max_msg_size: config.maxMessageSize,
      duplicate_window: config.duplicateTrackingTimeWindow * 1000000000, //seconds to NANOseconds
      allow_rollup_hdrs: config.allowMessageRollUps,
      deny_delete: config.allowMessageDeletion,
      deny_purge: config.allowPurge,
    };
    const response = await config.jetstreamManager.streams.add(StreamConfig);
    return response;
  }
);

export const listConsumers = createAsyncThunk(
  "streams/listConsumers",
  async (config: any, thunkAPI) => {
    const response = await config.jetstreamManager.consumers
      .list(config.stream)
      .next();
    return response;
  }
);

export const purgeStream = createAsyncThunk(
  "streams/purgeStream",
  async (config: any, thunkAPI) => {
    const response = await config.jetstreamManager.streams.purge(config.stream);
    return response;
  }
);

export const editStream = createAsyncThunk(
  "streams/editStream",
  async (config: any, thunkAPI) => {
    const response = await config.jetstreamManager.streams.update(
      config.stream,
      { subjects: config.subjects }
    );
    return response;
  }
);
export const streamsSlice = createSlice({
  name: "streams",
  initialState,
  reducers: {
    removeJetstream: (state, action) => {
      if (state.jetstreamManager !== undefined) {
        state.jetstreamManager?.streams.delete(action.payload);
      }
      state.searchResults = state.jetstreams;
    },
    searchJetstreams: (state, action) => {
      state.searchResults = state.jetstreams.filter((js: StreamInfo) => {
        return js.config.name
          .toLowerCase()
          .includes(action.payload.toLowerCase());
      });
    },
    clearErrorMessage: (state) => {
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setUpConnection.fulfilled, (state, action) => {
        state.jetstreamManager = action.payload;
      })
      .addCase(listJetstreams.fulfilled, (state, action) => {
        state.jetstreams = action.payload;
        state.searchResults = state.jetstreams;
        console.log("listed");
      })
      .addCase(addNewJetstream.fulfilled, (state, action) => {
        state.jetstreams.push(action.payload);
        state.searchResults = state.jetstreams;
      })
      .addCase(addNewJetstream.rejected, (state, action) => {
        state.errorMessage = action.error.message || null;
        // console.log(action);
      })
      .addCase(listConsumers.fulfilled, (state, action) => {
        // console.log(action.payload);
        state.consumers = action.payload;
      })
      .addCase(purgeStream.fulfilled, (state, action) => {
        console.log("stream purged");
      })
      .addCase(editStream.fulfilled, (state, action) => {
        console.log("stream edited");
      });
  },
});

export const { removeJetstream, searchJetstreams, clearErrorMessage } =
  streamsSlice.actions;

export default streamsSlice.reducer;
