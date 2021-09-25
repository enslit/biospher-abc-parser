import { Order } from '../types/reports/sales/Order';
import { Client } from '../types/reports/sales/Client';
import { ClientWithABC } from '../types/reports/sales/ClientWithABC';
import { ABC } from '../types/reports/sales/ABC';
import { TTotals } from '../types/reports/sales/TTotals';

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

export const calculateAbc = (
  inputData: Record<string, Client>
): Record<string, ClientWithABC> => {
  const LEVEL_CATEGORY_A = 80;
  const LEVEL_CATEGORY_B = 95;

  const entriesData = Object.entries(inputData);
  entriesData.sort((a, b) => {
    const [, valuesA] = a;
    const [, valuesB] = b;

    return valuesB.totalAmount - valuesA.totalAmount;
  });

  let cumulativePercent = 0;

  const total = entriesData.reduce((acc, [, value]) => {
    acc += value.totalAmount;
    return acc;
  }, 0);

  const resultEntries = entriesData.map(
    ([clientName, clientData]): [string, ClientWithABC] => {
      const part: number = (clientData.totalAmount / total) * 100;
      cumulativePercent += part;
      const category: ABC =
        cumulativePercent < LEVEL_CATEGORY_A
          ? ABC.A
          : cumulativePercent < LEVEL_CATEGORY_B
          ? ABC.B
          : ABC.C;

      return [
        clientName,
        {
          ...clientData,
          abc: {
            part,
            category,
          },
        },
      ];
    }
  );

  return Object.fromEntries(resultEntries);
};

export const calculateTotals = (
  data: Record<string, ClientWithABC>
): TTotals => {
  const totalsInit: TTotals = {
    orders: 0,
    amount: 0,
    clients: {
      a: 0,
      b: 0,
      c: 0,
    },
  };

  return Object.values(data).reduce((acc: TTotals, clientData) => {
    acc.orders += clientData.orders.length;
    acc.amount += clientData.totalAmount;

    switch (clientData.abc.category) {
      case ABC.A: {
        acc.clients.a += 1;
        break;
      }
      case ABC.B: {
        acc.clients.b += 1;
        break;
      }
      case ABC.C: {
        acc.clients.c += 1;
        break;
      }
      default:
        console.log('unknown ABC type:', clientData.abc.category);
    }

    return acc;
  }, totalsInit);
};
