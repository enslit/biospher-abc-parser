import { WorkBook } from 'xlsx';
import { ActionType } from '../types/state/ActionType';
import { Action } from '../types/state/Action';
import { TFileDetails } from '../types/parser/TFIleDetails';

export const importWorkBook = (wbData: WorkBook): Action => ({
  type: ActionType.SetFile,
  payload: wbData,
});

export const setParseResult = <T>(result: T): Action => ({
  type: ActionType.SetResultParse,
  payload: result,
});

export const setDataLoaded = (state: boolean): Action => ({
  type: ActionType.SetDataLoaded,
  payload: state,
});

export const setFileDetails = (details: TFileDetails | null): Action => ({
  type: ActionType.SetFileDetails,
  payload: details,
});
