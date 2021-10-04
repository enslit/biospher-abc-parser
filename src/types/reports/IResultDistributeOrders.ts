import { IReportPeriod } from './IReportPeriod';
import { TSalesTableRow } from './sales/TSalesTableRow';

export interface IResultDistributeOrders {
  commissionTrading: Record<string, TSalesTableRow[]>;
  refunds: Record<string, TSalesTableRow[]>;
  result: IReportPeriod[];
}
