import { Order } from '../types/reports/sales/Order';
import { Quarter } from './date.extensions';

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

export const sumFormatter = (num: number | bigint): string => {
  return Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    currencyDisplay: 'symbol',
    useGrouping: true,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

export const percentFormatter = (num: number | bigint): string => {
  return Intl.NumberFormat('ru-RU', {
    style: 'percent',
    maximumSignificantDigits: 2,
  }).format(num);
};

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
