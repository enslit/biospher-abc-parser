import { ABC } from '../types/ABC';
import { Order } from '../types/Order';
import { InputData } from '../types/InputData';
import { Meta } from '../types/Meta';
import { MetaHeaderField } from '../types/MetaHeaderField';
import { HeaderMeta } from '../types/HeaderMeta';
import { Parser } from '../types/Parser';
import { Client } from '../types/Client';
import { ClientWithABC } from '../types/ClientWithABC';

const getOrderParts = (str: string): Omit<Order, 'amount'> | null => {
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

const getMeta = (data: InputData): Meta => {
  let indexRow = 0;
  let metaDataArea = true;
  const meta: Meta = {
    indexHeaderRow: null,
    meta: {},
  };

  const getHeaderValue = (label: string, index: number): MetaHeaderField => ({
    label,
    index,
  });

  const setHeader = (
    field: keyof HeaderMeta,
    value: string,
    indexCol: number
  ): void => {
    meta.meta.header = {
      ...meta.meta.header,
      [field]: getHeaderValue(value, indexCol),
    };
  };

  while (indexRow < data.length && metaDataArea) {
    const row = data[indexRow];
    let indexCol = 0;
    let rowHeader = false;

    while (indexCol < row.length) {
      let value = row[indexCol];
      value = String(value);

      if (/Реализация/gi.test(value)) {
        rowHeader = true;
        setHeader('order', value, indexCol);
        indexCol++;
        continue;
      }

      if (rowHeader && value) {
        if (/менеджер/gi.test(value)) {
          setHeader('manager', value, indexCol);
        }

        if (/Клиент/gi.test(value)) {
          setHeader('client', value, indexCol);
        }

        if (/Выручка/gi.test(value)) {
          setHeader('orderSum', value, indexCol);
        }
      }

      if (rowHeader && indexCol === row.length - 1) {
        metaDataArea = false;
        meta.indexHeaderRow = indexRow;
        break;
      }

      indexCol++;
    }

    indexRow++;
  }

  return meta;
};

export const parser: Parser = (data) => {
  const { meta, indexHeaderRow }: Meta = getMeta(data);
  const result: Record<string, Client> = {};

  const clientFieldIndex = meta.header?.client?.index;
  const orderFieldIndex = meta.header?.order?.index;
  const managerFieldIndex = meta.header?.manager?.index;
  const amountFieldIndex = meta.header?.orderSum?.index;

  if (clientFieldIndex === undefined) {
    throw new Error('Не найдено поле "Клиент"');
  }
  if (orderFieldIndex === undefined) {
    throw new Error('Не найдено поле "Заказ"');
  }
  if (managerFieldIndex === undefined) {
    throw new Error('Не найдено поле "Менеджер"');
  }
  if (amountFieldIndex === undefined) {
    throw new Error('Не найдено поле "Сумма"');
  }

  if (indexHeaderRow && indexHeaderRow < data.length) {
    for (
      let contentRow = indexHeaderRow + 1;
      contentRow < data.length;
      contentRow++
    ) {
      const row = data[contentRow];

      if (!row || row.length === 0) continue;
      if (/^Итого$/gi.test(String(row[0]))) break;

      const client = row[clientFieldIndex];
      const order = row[orderFieldIndex];
      const manager = row[managerFieldIndex];
      const amount = row[amountFieldIndex];

      if (client && order && manager && amount) {
        const orderParsed = getOrderParts(String(order)) || {
          type: String(order),
        };
        const amountNormalized =
          typeof amount === 'number' ? amount : parseInt(amount, 10);

        if (!result.hasOwnProperty(client)) {
          result[client] = {
            manager: String(manager),
            totalAmount: amountNormalized,
            orders: [
              {
                ...orderParsed,
                amount: amountNormalized,
              },
            ],
          };
        } else {
          result[client].orders.push({
            ...orderParsed,
            amount: amountNormalized,
          });
          result[client].totalAmount += amountNormalized;
        }
      }
    }
  }

  return {
    meta,
    result,
  };
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
