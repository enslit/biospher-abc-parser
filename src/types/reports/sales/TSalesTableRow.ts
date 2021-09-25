import { IDocument } from './IDocument';

export type TSalesTableRow = {
  order: IDocument;
  manager: string;
  client: string;
  amount: number;
  discount?: number;
};
