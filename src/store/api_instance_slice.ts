import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type InstanceState = {
  id: string | null;
  apiToken: string | null;
};

const initialState: InstanceState = {
  id: null,
  apiToken: null,
};

export const InstanceSlice = createSlice({
  name: 'apiInstance',
  initialState,
  reducers: {
    init: (state, action: PayloadAction<InstanceState>) => {
      const { id, apiToken } = action.payload;
      if (id && apiToken) return action.payload;
      else return state;
    },
    clear: (state) => {
      state = { id: null, apiToken: null };
    },
  },
});

export const { init, clear } = InstanceSlice.actions;

export default InstanceSlice.reducer;
