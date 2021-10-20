import { TReportType } from './TReportType';
import { TReportPeriodType } from './TReportPeriodType';
import { TABCWeights } from './TABCWeights';
import { TSlicePeriod } from './TSlicePeriod';
import { TPeriod } from '../../../../../types/parser/TPeriod';

export type SimpleReportSettings = {
  periodType: TReportPeriodType;
  slicePeriodType: TSlicePeriod;
  countSlicePeriods: number;
  start: Date | null;
  end: Date | null;
};

export type ComparativeReportSettings = {
  periodLeft: TPeriod;
  periodRight: TPeriod;
};

export type TReportABCSettings = {
  type: TReportType;
  weights: TABCWeights;
  simple: SimpleReportSettings;
  comparative: ComparativeReportSettings;
};
