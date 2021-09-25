export type Order = {
  type: string;
  number?: string;
  date?: Date;
  amount: number;
  discount?: number;
};
