import { TSaleTableRowWithoutClient } from '../../../features/reports/sales/AbcReport/abcReportFunctions';

export interface Client {
  manager: string;
  orders: TSaleTableRowWithoutClient[];
  amount: number;
}
