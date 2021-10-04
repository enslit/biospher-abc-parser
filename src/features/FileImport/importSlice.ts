import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

interface ImportState {
  inProgress: boolean;
}

const initialState: ImportState = {
  inProgress: false,
};

export const importSlice = createSlice({
  name: 'import',
  initialState,
  reducers: {
    setInProgress: (state, action: PayloadAction<boolean>) => {
      state.inProgress = action.payload;
    },
  },
});

export const { setInProgress } = importSlice.actions;

export const selectProgressState = (state: RootState): boolean =>
  state.import.inProgress;

export default importSlice.reducer;
