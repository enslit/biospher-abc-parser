import { ClientWithABC } from '../../../../../types/reports/sales/ClientWithABC';

export type ComparativeReportResult = Record<
  string,
  { left: ClientWithABC | null; right: ClientWithABC | null }
>;
