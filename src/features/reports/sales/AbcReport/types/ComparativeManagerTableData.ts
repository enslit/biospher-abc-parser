import { ManagersResultsComparative } from './ManagersResultsComparative';
import { ComparativeManagerSide } from './ComparativeManagerSide';

export type ComparativeManagerTableData = {
  manager: keyof ManagersResultsComparative;
  left: ComparativeManagerSide | null;
  right: ComparativeManagerSide | null;
};
