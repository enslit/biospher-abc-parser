import { Client } from './sales/Client';
import { TPeriodStep } from './TPeriodStep';

export interface IReportPeriod {
  period: Date;
  type: TPeriodStep;
  amount: number;
  data: {
    [client: string]: Client;
  };
}
