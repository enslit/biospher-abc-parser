import { ClientTableData } from './ClientTableData';

export type ManagerTableData = {
  manager: string;
  total: number;
  count: number;
  clients: ClientTableData[];
};
