import { Order } from './Order';
import { SellWithoutOrder } from './SellWithoutOrder';

export interface Client {
  manager: string;
  orders: Order[];
  totalAmount: number;
}
