import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type PhoneState = {
  number: string | null;
};

const initialState: PhoneState = {
  number: null,
};

export const PhoneSlice = createSlice({
  name: 'phone',
  initialState,
  reducers: {
    init: (state, action: PayloadAction<PhoneState>) => {
      const phone = action.payload.number;
      if (!phone) return state;
      state.number = phone;
    },
    clear: (state) => {
      state.number = null;
    },
  },
});

export const { init, clear } = PhoneSlice.actions;

export default PhoneSlice.reducer;
