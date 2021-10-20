import { TManagerResults } from './TManagerResults';

export type ManagersResultsComparative = Record<
  string,
  { left: TManagerResults | null; right: TManagerResults | null }
>;
