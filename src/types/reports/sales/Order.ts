import { IDocument } from './IDocument';

export interface Order extends IDocument {
  amount: number;
  discount?: number;
}
