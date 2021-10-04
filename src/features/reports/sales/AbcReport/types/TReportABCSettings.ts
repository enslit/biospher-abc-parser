import { TReportType } from './TReportType';
import { TReportPeriodType } from './TReportPeriodType';
import { TABCWeights } from './TABCWeights';
import { TSlicePeriod } from './TSlicePeriod';

export type TReportABCSettings = {
  type: TReportType;
  periodType: TReportPeriodType;
  slicePeriodType: TSlicePeriod;
  countSlicePeriods: number;
  weights: TABCWeights;
  start: Date | null;
  end: Date | null;
};
