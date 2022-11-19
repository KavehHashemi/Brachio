import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { connect } from "nats.ws";
import {
  JetStreamManager,
  StreamInfo,
  NatsConnection,
  ConsumerInfo,
} from "nats.ws/lib/nats-base-client/types";
export type SingleJetstream = {
  stream: StreamInfo;
  consumers: ConsumerInfo[];
};

interface IinitialState {
  natsConnection: NatsConnection | undefined;
  jetstreamManager: JetStreamManager | null;
  jetstreams: SingleJetstream[];
  searchResults: SingleJetstream[];
  errorMessage: string | null;
}
const initialState: IinitialState = {
  natsConnection: undefined,
  jetstreamManager: null,
  jetstreams: [],
  searchResults: [],
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
    let singleJetstreams: SingleJetstream[] = [];
    const response = await jetstreamManager?.streams.list().next();
    response.map(async (res) => {
      let consumers: ConsumerInfo[] = await jetstreamManager.consumers
        .list(res.config.name)
        .next();
      singleJetstreams = [
        ...singleJetstreams,
        { stream: res, consumers: consumers },
      ];
      console.log(singleJetstreams);
    });
    return singleJetstreams;
  }
);

// export const listStreamConsumers = createAsyncThunk(
//   "streams/listStreamConsumers",
//   async (config: any, thunkAPI) => {
//     let consumersList: { stream: string; consumers: ConsumerInfo[] }[] = [];
//     config.streams.map(async (st: StreamInfo) => {
//       let a: ConsumerInfo[] = await config.jetstreamManager.consumers
//         .list(st.config.name)
//         .next();
//       consumersList = [
//         ...consumersList,
//         { stream: st.config.name, consumers: a },
//       ];
//     });
//     return consumersList;
//   }
// );

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

// export const listConsumers = createAsyncThunk(
//   "streams/listConsumers",
//   async (config: any, thunkAPI) => {
//     const response = await config.jetstreamManager.consumers
//       .list(config.stream.config.name)
//       .next();
//     console.log("listing consumers");
//     return response;
//   }
// );

export const purgeStream = createAsyncThunk(
  "streams/purgeStream",
  async (config: any, thunkAPI) => {
    const response = await config.jetstreamManager.streams.purge(config.stream);
    console.log("purging stream");
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
      // .addCase(listStreamConsumers.fulfilled, (state, action) => {
      //   state.streamConsumers = action.payload;
      //   console.log(state.streamConsumers);
      // })
      .addCase(addNewJetstream.fulfilled, (state: IinitialState, action) => {
        state.jetstreams.push(action.payload);
        state.searchResults = state.jetstreams;
      })
      .addCase(addNewJetstream.rejected, (state: IinitialState, action) => {
        state.errorMessage = action.error.message || null;
      })
      .addCase(purgeStream.fulfilled, (state, action) => {
        console.log("stream purged");
      })
      .addCase(editStream.fulfilled, (state, action) => {
        state.searchResults = state.jetstreams;
        console.log("stream edited");
      });
  },
});

export const { removeJetstream, searchJetstreams, clearErrorMessage } =
  streamsSlice.actions;

export default streamsSlice.reducer;
