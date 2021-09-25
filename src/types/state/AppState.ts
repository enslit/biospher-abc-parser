import { WorkBook } from 'xlsx';
import { TTotals } from '../reports/sales/TTotals';
import { TPeriod } from '../parser/TPeriod';
import { ClientWithABC } from '../reports/sales/ClientWithABC';
import { TFileDetails } from '../parser/TFIleDetails';

export type AppState<T> = {
  fileDetails: TFileDetails | null;
  workBook: WorkBook | null;
  inProgress: boolean;
  isDataLoaded: boolean;
  resultParse: {
    meta: {
      period: TPeriod;
      rows: number;
    };
    data: T;
  };
  abc: Record<string, ClientWithABC>;
  totals: TTotals | null;
};
