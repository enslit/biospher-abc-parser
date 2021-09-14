import { WorkBook } from 'xlsx';
import { ActionType } from '../types/ActionType';
import { Action } from '../types/Action';
import { ClientWithABC } from '../types/ClientWithABC';

export const importWorkBook = (wbData: WorkBook): Action => ({
  type: ActionType.SetFile,
  payload: wbData,
});

export const setResultParse = (
  result: Record<string, ClientWithABC>
): Action => ({
  type: ActionType.SetResultParse,
  payload: result,
});
