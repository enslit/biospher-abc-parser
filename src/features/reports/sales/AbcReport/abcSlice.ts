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
import { TManagerResults } from './types/TManagerResults';
import { ClientWithABC } from '../../../../types/reports/sales/ClientWithABC';

interface AbcState {
  inProgress: boolean;
  isDataLoaded: boolean;
  meta: { period: TPeriod; rows: number };
  data: TSalesTableRow[];
  calculatedAbc: Record<string, ClientWithABC>;
  renderData: {
    managers: Record<string, TManagerResults>;
  };
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
  calculatedAbc: {},
  renderData: {
    managers: {},
  },
  reportSettings: {
    type: 'simple',
    periodType: 'current-month',
    slicePeriodType: 'month',
    countSlicePeriods: 1,
    weights: { A: 80, B: 15, C: 5 },
    start: null,
    end: null,
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
    setSettingsType: (state, { payload }: PayloadAction<TReportType>) => {
      return {
        ...state,
        reportSettings: {
          ...state.reportSettings,
          type: payload,
        },
      };
    },
    setSettingsPeriodType: (
      state,
      { payload }: PayloadAction<TReportPeriodType>
    ) => {
      return {
        ...state,
        reportSettings: {
          ...state.reportSettings,
          periodType: payload,
        },
      };
    },
    setSettingsPeriodDate: (
      state,
      { payload }: PayloadAction<{ key: 'start' | 'end'; value: Date | null }>
    ) => {
      return {
        ...state,
        reportSettings: {
          ...state.reportSettings,
          [payload.key]: payload.value,
        },
      };
    },
    setSettingsSlidingPeriod: (
      state,
      { payload }: PayloadAction<TSlicePeriod>
    ) => {
      return {
        ...state,
        reportSettings: {
          ...state.reportSettings,
          slicePeriodType: payload,
        },
      };
    },
    setSettingsSlidingPeriodsCount: (
      state,
      { payload }: PayloadAction<number>
    ) => {
      return {
        ...state,
        reportSettings: {
          ...state.reportSettings,
          countSlicePeriods: payload,
        },
      };
    },
    setManagersData: (
      state,
      { payload }: PayloadAction<Record<string, TManagerResults>>
    ) => {
      return {
        ...state,
        renderData: {
          ...state.renderData,
          managers: payload,
        },
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
  setSettingsType,
  setSettingsPeriodType,
  setSettingsPeriodDate,
  setSettingsSlidingPeriod,
  setSettingsSlidingPeriodsCount,
  setManagersData,
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
export const selectRenderABCManagersData = (
  state: RootState
): Record<string, TManagerResults> => state.abc.renderData.managers;
export const selectCalculatedAbc = (
  state: RootState
): Record<string, ClientWithABC> => state.abc.calculatedAbc;

export default abcSlice.reducer;
