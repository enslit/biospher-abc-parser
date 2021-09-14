import { AppState } from '../types/AppState';
import { Action } from '../types/Action';
import { ActionType } from '../types/ActionType';

export const appReducer = (state: AppState, action: Action): AppState => {
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
        resultParse: {},
        workBook: null,
        totals: null,
      };
    }
    default:
      return state;
  }
};
