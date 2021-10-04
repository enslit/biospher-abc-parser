import { Order } from '../types/reports/sales/Order';
import { ClientWithABC } from '../types/reports/sales/ClientWithABC';
import { ABC } from '../types/reports/sales/ABC';
import { TSalesTableRow } from '../types/reports/sales/TSalesTableRow';
import { IReportPeriod } from '../types/reports/IReportPeriod';
import { IResultDistributeOrders } from '../types/reports/IResultDistributeOrders';
import { Quarter } from './date.extensions';
import { IABCReportPeriod } from '../types/reports/sales/IABCReportPeriod';
import { TPeriodStep } from '../types/reports/TPeriodStep';
import { TReportPeriodType } from '../features/reports/sales/AbcReport/types/TReportPeriodType';
import { TReportABCSettings } from '../features/reports/sales/AbcReport/types/TReportABCSettings';

Date.prototype.getQuarter = function (): Quarter {
  const month = this.getMonth();

  switch (month) {
    case 0:
    case 1:
    case 2:
      return 1;
    case 3:
    case 4:
    case 5:
      return 2;
    case 6:
    case 7:
    case 8:
      return 3;
    default:
      return 4;
  }
};

Date.prototype.isAnotherMonth = function (date: Date): boolean {
  return date && this.getMonth() !== date.getMonth();
};

Date.prototype.isAnotherQuarter = function (date: Date): boolean {
  return date && this.getQuarter() !== date.getQuarter();
};

Date.prototype.isAnotherYear = function (date: Date): boolean {
  return date && this.getFullYear() !== date.getFullYear();
};

export const roundDecimal = (value: number): number =>
  Math.round(value * 100) / 100;

export const divideNumberDigits = (value: number | string): string =>
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

export const getOrderParts = (str: string): Omit<Order, 'amount'> | null => {
  const matches = str.match(/(заказ клиента)\s(00ЦБ-\d+)\sот\s(.*)/i);

  if (matches && matches.length === 4) {
    const parseDate = matches[3].match(
      /^(\d{1,2}).(\d{1,2}).(\d{4})\s(\d{1,2}):(\d{1,2}):(\d{1,2})$/
    );
    let date;

    if (parseDate && parseDate.length === 7) {
      const [, day, monthIndex, year, hours, minutes, seconds] = parseDate;
      date = new Date(+year, +monthIndex - 1, +day, +hours, +minutes, +seconds);
    }

    return {
      type: matches[1],
      number: matches[2],
      date: date || new Date(matches[3]),
    };
  }

  return null;
};

export function descendingComparator<T>(
  a: T,
  b: T,
  orderBy: keyof T
): -1 | 1 | 0 {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export function getComparator<Key extends keyof any>(
  order: OrderDirection,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
