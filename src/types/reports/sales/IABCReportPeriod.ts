import { IReportPeriod } from '../IReportPeriod';
import { ClientWithABC } from './ClientWithABC';

export interface IABCReportPeriod extends IReportPeriod {
  data: {
    [client: string]: ClientWithABC;
  };
}
