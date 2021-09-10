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
        file: payload,
      };
    case ActionType.SetResultParse:
      return {
        ...state,
        resultParse: payload,
      };
    default:
      return state;
  }
};
