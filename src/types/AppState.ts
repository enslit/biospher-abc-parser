import { WorkBook } from 'xlsx';
import { ClientWithABC } from './ClientWithABC';
import { TTotals } from './TTotals';

export type AppState = {
  workBook: WorkBook | null;
  inProgress: boolean;
  resultParse: Record<string, ClientWithABC>;
  totals: TTotals | null;
};
