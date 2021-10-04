export {};

export type Quarter = 1 | 2 | 3 | 4;

declare global {
  interface Date {
    getQuarter(): Quarter;
    isAnotherMonth(date: Date): boolean;
    isAnotherQuarter(date: Date): boolean;
    isAnotherYear(date: Date): boolean;
  }
}
