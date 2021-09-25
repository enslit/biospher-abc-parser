import { AppState } from '../types/state/AppState';
import { Action } from '../types/state/Action';
import { ActionType } from '../types/state/ActionType';
import { TSalesTableRow } from '../types/reports/sales/TSalesTableRow';

export const appReducer = (
  state: AppState<TSalesTableRow[]>,
  action: Action
): AppState<TSalesTableRow[]> => {
  const { type, payload = null } = action;

  switch (type) {
    case ActionType.InProgressOn:
      return {
        ...state,
        inProgress: true,
      };
    case ActionType.InProgressOff:
      return {
        ...state,
        inProgress: false,
      };
    case ActionType.SetFile:
      return {
        ...state,
        workBook: payload,
      };
    case ActionType.SetResultParse:
      return {
        ...state,
        resultParse: payload,
      };
    case ActionType.SetTotals:
      return {
        ...state,
        totals: payload,
      };
    case ActionType.ResetResultParse: {
      return {
        ...state,
        resultParse: {
          meta: payload.meta,
          data: payload.data,
        },
        workBook: null,
        totals: null,
      };
    }
    case ActionType.SetDataLoaded: {
      return {
        ...state,
        isDataLoaded: payload,
      };
    }
    case ActionType.SetFileDetails: {
      return {
        ...state,
        fileDetails: payload,
      };
    }
    default:
      return state;
  }
};
