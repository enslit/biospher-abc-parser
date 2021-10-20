import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../../app/store';
import { TSalesTableRow } from '../../../../types/reports/sales/TSalesTableRow';
import { TPeriod } from '../../../../types/parser/TPeriod';
import { ParserResponse } from '../../../../utils/ExcelParser';
import { TReportABCSettings } from './types/TReportABCSettings';
import { TReportType } from './types/TReportType';
import { TReportPeriodType } from './types/TReportPeriodType';
import { TSlicePeriod } from './types/TSlicePeriod';
import { TMeta } from '../../../../types/parser/TMeta';
import { ClientWithABC } from '../../../../types/reports/sales/ClientWithABC';

interface AbcState {
  inProgress: boolean;
  isDataLoaded: boolean;
  meta: { period: TPeriod; rows: number };
  data: TSalesTableRow[];
  reportSettings: TReportABCSettings;
}

const initialState: AbcState = {
  inProgress: false,
  isDataLoaded: false,
  meta: {
    period: { start: undefined, end: undefined },
    rows: 0,
  },
  data: [],
  reportSettings: {
    type: 'simple',
    weights: { A: 80, B: 15, C: 5 },
    simple: {
      periodType: 'current-month',
      slicePeriodType: 'month',
      countSlicePeriods: 1,
      start: null,
      end: null,
    },
    comparative: {
      periodLeft: { start: undefined, end: undefined },
      periodRight: { start: undefined, end: undefined },
    },
  },
};

export const abcSlice = createSlice({
  name: 'abc',
  initialState,
  reducers: {
    setInProgress: (state, { payload }: PayloadAction<boolean>) => ({
      ...state,
      inProgress: payload,
    }),
    setResultParse: (
      state,
      { payload }: PayloadAction<ParserResponse<TSalesTableRow>>
    ) => ({
      ...state,
      data: payload.data,
      meta: payload.meta,
      isDataLoaded: true,
    }),
    setSettings: (state, { payload }: PayloadAction<TReportABCSettings>) => {
      return {
        ...state,
        reportSettings: payload,
      };
    },
    setCalculatedAbc: (
      state,
      { payload }: PayloadAction<Record<string, ClientWithABC>>
    ) => {
      return {
        ...state,
        calculatedAbc: payload,
      };
    },
    reset: (state) => {
      return {
        ...state,
        isDataLoaded: false,
        meta: {
          period: { start: undefined, end: undefined },
          rows: 0,
        },
        data: [],
        calculatedAbc: {},
        renderData: {
          managers: {},
        },
      };
    },
  },
});

export const {
  setInProgress,
  setResultParse,
  reset,
  setSettings,
  setCalculatedAbc,
} = abcSlice.actions;

export const selectProgressState = (state: RootState): boolean =>
  state.abc.inProgress;
export const selectIsDataReady = (state: RootState): boolean =>
  state.abc.isDataLoaded;
export const selectReportMeta = (state: RootState): TMeta => state.abc.meta;
export const selectOrdersData = (state: RootState): TSalesTableRow[] =>
  state.abc.data;
export const selectSettings = (state: RootState): TReportABCSettings =>
  state.abc.reportSettings;

export default abcSlice.reducer;
