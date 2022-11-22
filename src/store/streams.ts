import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { connect } from "nats.ws";
import {
  JetStreamManager,
  StreamInfo,
  NatsConnection,
  ConsumerInfo,
  StreamConfig,
} from "nats.ws/lib/nats-base-client/types";

export type SingleJetstream = {
  stream: StreamInfo;
  consumers: ConsumerInfo[];
};
export type AddStreamConfig = {
  jetstreamManager: JetStreamManager | null;
  streamConfig: Partial<StreamConfig>;
};
export type PurgeStreamConfig = {
  jetstreamManager: JetStreamManager | null;
  stream: string;
};
export type EditStreamConfig = {
  jetstreamManager: JetStreamManager | null;
  stream: string;
  subjects: string[];
};

interface IinitialState {
  natsConnection: NatsConnection | undefined;
  jetstreamManager: JetStreamManager | null;
  jetstreams: SingleJetstream[];
  searchResults: SingleJetstream[];
  message: string | null;
  errorMessage: string | null;
}
const initialState: IinitialState = {
  natsConnection: undefined,
  jetstreamManager: null,
  jetstreams: [],
  searchResults: [],
  message: null,
  errorMessage: null,
};

export const connecToServer = createAsyncThunk(
  "streams/connectToServer",
  async (serverUrl: string, thunkAPI) => {
    const natsConnection = await connect({
      servers: [serverUrl],
    });
    console.log("returning natsConnection");
    return natsConnection;
  }
);

export const setJetstreamManager = createAsyncThunk(
  "streams/setJetstreamManager",
  async (natsConnection: NatsConnection, thunkAPI) => {
    const jetstreamManager = await natsConnection.jetstreamManager();
    console.log("returning jetstreamManager");
    return jetstreamManager;
  }
);
export const listJetstreams = createAsyncThunk(
  "streams/listJetstreams",
  async (jetstreamManager: JetStreamManager, thunkAPI) => {
    let singleJetstreams: SingleJetstream;
    const response = await jetstreamManager?.streams.list().next();
    let promises = response.map(async (res) => {
      let consumers = await jetstreamManager.consumers
        .list(res.config.name)
        .next();
      singleJetstreams = { stream: res, consumers: consumers };
      return singleJetstreams;
    });
    let results = await Promise.all(promises);
    return results;
  }
);

export const addNewJetstream = createAsyncThunk(
  "streams/addNewStream",
  async (config: AddStreamConfig, thunkAPI) => {
    const StreamConfig = {
      name: config.streamConfig.name,
      subjects: config.streamConfig.subjects,
      storage: config.streamConfig.storage,
      num_replicas: config.streamConfig.num_replicas,
      retention: config.streamConfig.retention,
      discard: config.streamConfig.discard,
      max_msgs: config.streamConfig.max_msgs,
      max_msgs_per_subject: config.streamConfig.max_msgs_per_subject,
      max_bytes: config.streamConfig.max_bytes,
      max_age: config.streamConfig.max_age
        ? config.streamConfig.max_age * 1000000000
        : 0, //seconds to NANOseconds
      max_msg_size: config.streamConfig.max_msg_size,
      duplicate_window: config.streamConfig.duplicate_window
        ? config.streamConfig.duplicate_window * 1000000000
        : 0, //seconds to NANOseconds
      allow_rollup_hdrs: config.streamConfig.allow_rollup_hdrs,
      deny_delete: config.streamConfig.deny_delete,
      deny_purge: config.streamConfig.deny_purge,
    };
    const response = await config.jetstreamManager?.streams.add(StreamConfig);
    return response;
  }
);

export const purgeStream = createAsyncThunk(
  "streams/purgeStream",
  async (config: PurgeStreamConfig, thunkAPI) => {
    const response = await config.jetstreamManager?.streams.purge(
      config.stream
    );
    console.log("purging stream");
    return response;
  }
);

export const editStream = createAsyncThunk(
  "streams/editStream",
  async (config: EditStreamConfig, thunkAPI) => {
    const response = await config.jetstreamManager?.streams.update(
      config.stream,
      { subjects: config.subjects }
    );
    console.log("editing stream");
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
      state.message = "Stream successfully deleted";
    },
    searchJetstreams: (state, action) => {
      state.searchResults = state.jetstreams.filter((js) => {
        return js.stream.config.name
          .toLowerCase()
          .includes(action.payload.toLowerCase());
      });
    },
    clearErrorMessage: (state) => {
      state.errorMessage = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(connecToServer.fulfilled, (state: IinitialState, action) => {
        console.log("natsConnection set ");
        state.natsConnection = action.payload;
      })
      .addCase(
        setJetstreamManager.fulfilled,
        (state: IinitialState, action) => {
          console.log("jetstreamManager set ");
          state.jetstreamManager = action.payload;
        }
      )
      .addCase(listJetstreams.fulfilled, (state: IinitialState, action) => {
        state.jetstreams = action.payload;
        state.searchResults = state.jetstreams;
        console.log("jetstreams listed");
      })
      .addCase(addNewJetstream.fulfilled, (state: IinitialState, action) => {
        if (action.payload !== undefined) {
          const added: SingleJetstream = {
            stream: action.payload,
            consumers: [],
          };
          state.jetstreams.push(added);
        }
        state.searchResults = state.jetstreams;
        state.message = "Stream successfully created";
      })
      .addCase(addNewJetstream.rejected, (state: IinitialState, action) => {
        state.errorMessage = action.error.message || null;
      })
      .addCase(purgeStream.fulfilled, (state, action) => {
        state.message = "Stream successfully purged";
        console.log("stream purged");
      })
      .addCase(purgeStream.rejected, (state, action) => {
        state.errorMessage = action.error.message || null;
      })
      .addCase(editStream.fulfilled, (state, action) => {
        state.searchResults = state.jetstreams;
        state.message = "Stream successfully edited";
        console.log("stream edited");
      })
      .addCase(editStream.rejected, (state, action) => {
        state.errorMessage = action.error.message || null;
      });
  },
});

export const {
  removeJetstream,
  searchJetstreams,
  clearErrorMessage,
  clearMessage,
} = streamsSlice.actions;

export default streamsSlice.reducer;
