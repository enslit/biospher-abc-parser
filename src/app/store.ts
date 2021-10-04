import { configureStore } from '@reduxjs/toolkit';
import importSlice from '../features/FileImport/importSlice';
import appSlice from './appReducer';
import abcSlice from '../features/reports/sales/AbcReport/abcSlice';

export const store = configureStore({
  reducer: {
    app: appSlice,
    import: importSlice,
    abc: abcSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
