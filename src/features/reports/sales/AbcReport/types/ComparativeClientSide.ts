import { ABC } from '../../../../../types/reports/sales/ABC';

// export type ComparativeClientSide = Omit<ClientWithABC, 'manager'> | null;
export type ComparativeClientSide = {
  ordersCount: number;
  ordersSum: number;
  amount: number;
  part: number;
  category: ABC | null;
};
