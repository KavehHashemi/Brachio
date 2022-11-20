import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Consumer } from "nats.ws/lib/nats-base-client/types";
import {} from "./streams";
interface IinitialState {
  consumers: Consumer[];
}
const initialState: IinitialState = {
  consumers: [],
};

export const getConsumersByStream = createAsyncThunk(
  "consumers/getConsumers",
  async (config: any, thunkAPI) => {
    const response = await config.jetstreamManager.consumers
      .list(config.stream)
      .next();
    return response;
  }
);

export const consumersSlice = createSlice({
  initialState: initialState,
  name: "consumers",
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getConsumersByStream.fulfilled,
      (state: IinitialState, action) => {
        state.consumers = action.payload;
      }
    );
  },
});
//export const {} = consumersSlice.actions;

export default consumersSlice.reducer;
