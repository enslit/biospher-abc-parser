import { ABC } from './ABC';
import { Order } from './Order';
import { SellWithoutOrder } from './SellWithoutOrder';

export type ClientTableData = {
  client: string;
  part: number;
  category: ABC;
  abc: {
    part: number;
    category: ABC;
  };
  orders: Order[];
  totalAmount: number;
};
