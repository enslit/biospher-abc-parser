import { ABC } from './ABC';
import { Client } from './Client';

export interface ClientWithABC extends Client {
  abc: {
    part: number;
    category: ABC;
  };
}
