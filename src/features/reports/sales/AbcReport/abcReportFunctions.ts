import { TSalesTableRow } from '../../../../types/reports/sales/TSalesTableRow';
import { ClientWithABC } from '../../../../types/reports/sales/ClientWithABC';
import { TABCWeights } from './types/TABCWeights';
import { omit } from 'lodash';
import { ABC } from '../../../../types/reports/sales/ABC';
import { TManagerResults } from './types/TManagerResults';
import { TReportABCSettings } from './types/TReportABCSettings';

type TFilterOrdersByPeriod = (
  orders: TSalesTableRow[],
  period: { start: Date; end: Date }
) => TSalesTableRow[];

export type TSaleTableRowWithoutClient = Omit<TSalesTableRow, 'client'>;

type TGroupedOrdersByClient = Record<string, TSaleTableRowWithoutClient[]>;

type PrepareOrders = (data: TSalesTableRow[]) => TGroupedOrdersByClient;

type CalculateSimpleAbc = (
  data: TSalesTableRow[],
  period: { start: Date; end: Date },
  weights: TABCWeights
) => Promise<Record<string, ClientWithABC>>;

type TClientAmountSales = Map<keyof TGroupedOrdersByClient, number>;

type CalculateClientAmount = (
  clients: TGroupedOrdersByClient
) => TClientAmountSales;

const filterOrdersByPeriod: TFilterOrdersByPeriod = (orders, period) => {
  return orders.filter((document) => {
    return (
      document?.order?.date &&
      document.order.date <= period.end &&
      document.order.date >= period.start
    );
  });
};

const groupOrdersByClient: PrepareOrders = (orders) => {
  return orders.reduce((acc: TGroupedOrdersByClient, row) => {
    if (!acc[row.client]) {
      acc[row.client] = [];
    }

    const newRow = omit(row, ['client']);
    acc[row.client].push(newRow);

    return acc;
  }, {});
};

const getClientsAmount: CalculateClientAmount = (clients) => {
  const map = new Map<keyof typeof clients, number>();

  Object.keys(clients).reduce((list, clientName) => {
    const total = clients[clientName].reduce((acc, order) => {
      return acc + order.amount;
    }, 0);

    list.set(clientName, total);

    return list;
  }, map);

  return map;
};

const getTotalOrdersAmount = (orders: TSalesTableRow[]): number =>
  orders.reduce((total, order) => total + order.amount, 0);

const calculateSimpleAbc: CalculateSimpleAbc = async (
  data,
  period,
  weights
) => {
  const filteredData = filterOrdersByPeriod(data, period);
  const groupedOrders = groupOrdersByClient(filteredData);
  const amounts = getClientsAmount(groupedOrders);
  const totalAmountInPeriod = getTotalOrdersAmount(filteredData);

  const clientEntries = Object.entries(groupedOrders);

  clientEntries.sort((a, b) => {
    const amountClientA = amounts.get(a[0]);
    const amountClientB = amounts.get(b[0]);

    if (!amountClientA && !amountClientB) return 0;
    if (!amountClientA) return -1;
    if (!amountClientB) return 1;

    return amountClientB - amountClientA;
  });

  let cumulativePercent = 0;

  const resultEntries = clientEntries.map(
    ([clientName, clientData]): [string, ClientWithABC] => {
      const clientAmount = amounts.get(clientName) || 0;
      const part: number = (clientAmount / totalAmountInPeriod) * 100;
      cumulativePercent += part;
      const category: ABC =
        cumulativePercent < weights.A
          ? ABC.A
          : cumulativePercent < weights.A + weights.B
          ? ABC.B
          : ABC.C;

      return [
        clientName,
        {
          manager: clientData[0].manager,
          orders: clientData,
          amount: clientAmount,
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

type GetManagersResults = (
  clients: Record<string, ClientWithABC>
) => Record<string, TManagerResults>;

const getManagersResults: GetManagersResults = (clients) => {
  const managers: Record<string, TManagerResults> = {};

  for (const clientName in clients) {
    const { manager, amount, orders, abc } = clients[clientName];

    if (!managers[manager]) {
      managers[manager] = {
        total: amount,
        ordersCount: orders.length,
        clientsOnABC: {
          a: abc.category === 'A' ? 1 : 0,
          b: abc.category === 'B' ? 1 : 0,
          c: abc.category === 'C' ? 1 : 0,
        },
        average: 0,
        part: 0,
      };
    } else {
      managers[manager].total += amount;
      managers[manager].ordersCount += orders.length;

      const cat = abc.category === 'A' ? 'a' : abc.category === 'B' ? 'b' : 'c';
      managers[manager].clientsOnABC[cat] += 1;
    }
  }

  const totalAmount = Object.values(managers).reduce(
    (acc, manager) => acc + manager.total,
    0
  );

  for (const manager in managers) {
    const { total, ordersCount } = managers[manager];

    managers[manager].average = total / ordersCount;
    managers[manager].part = total / totalAmount;
  }

  return managers;
};

const getPeriod = (
  settings: TReportABCSettings
): { start: Date; end: Date } => {
  const quarterStartMonth = {
    1: 0,
    2: 3,
    3: 6,
    4: 9,
  };

  const startDate = new Date();
  const endDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  if (settings.type === 'simple') {
    switch (settings.periodType) {
      case 'current-month': {
        startDate.setDate(1);
        break;
      }
      case 'current-quart': {
        startDate.setMonth(quarterStartMonth[startDate.getQuarter()], 1);
        break;
      }
      case 'current-year': {
        startDate.setMonth(0, 1);
        break;
      }
      case 'last-month': {
        startDate.setMonth(startDate.getMonth() - 1, 1);
        endDate.setDate(0);
        break;
      }
      case 'last-quart': {
        const currentQuarter = startDate.getQuarter();

        if (currentQuarter === 1) {
          startDate.setFullYear(
            startDate.getFullYear() - 1,
            quarterStartMonth[4],
            1
          );
          endDate.setFullYear(startDate.getFullYear() - 1, 11, 31);
        } else {
          startDate.setMonth(
            quarterStartMonth[
              currentQuarter === 2 ? 1 : currentQuarter === 3 ? 2 : 3
            ],
            1
          );
          endDate.setMonth(quarterStartMonth[currentQuarter], 0);
        }
        break;
      }
      case 'last-year': {
        startDate.setFullYear(startDate.getFullYear() - 1, 0, 1);
        endDate.setMonth(0, 1);
        endDate.setHours(0, 0, 0, 0);
        break;
      }
      case 'custom': {
        return {
          start: settings.start || new Date(2000, 1, 1),
          end: settings.end || new Date(2050, 1, 1),
        };
      }
    }
  }

  return {
    start: startDate,
    end: endDate,
  };
};

export { calculateSimpleAbc, getManagersResults, getPeriod };

// type DistributeOrdersByPeriod = (
//   data: TSalesTableRow[],
//   period: TPeriodStep
// ) => Promise<IResultDistributeOrders>;

// export const distributeOrdersByPeriod: DistributeOrdersByPeriod = async (
//   data,
//   period = 'month'
// ) => {
//   const commissionTrading: Record<string, TSalesTableRow[]> = {};
//   const refunds: Record<string, TSalesTableRow[]> = {};
//   const result: IReportPeriod[] = [];
//
//   let prevPeriod;
//
//   // Сортировка ACS по дате заказа - документы без даты будут выше документа с датой
//   const dataSorted = [...data];
//   dataSorted.sort((a, b) => {
//     if (!a.order?.date && !b.order?.date) return 0;
//     if (!a.order?.date) return -1;
//     if (!b.order?.date) return 1;
//
//     return a.order.date.getTime() - b.order.date.getTime();
//   });
//
//   for (let i = 0, reportIdx = 0; i < dataSorted.length; i++) {
//     const { order, client, amount, manager, discount } = dataSorted[i];
//
//     // Если сумма 0 или не определена, пропустить
//     if (!amount) continue;
//
//     // Если продажи без заказа, то в комиссионные и пропустить итерацию
//     if (!order?.date) {
//       commissionTrading[client]
//         ? commissionTrading[client].push(dataSorted[i])
//         : (commissionTrading[client] = [dataSorted[i]]);
//
//       continue;
//     }
//
//     // Если сумма ниже 0 в возвраты и пропустить
//     if (amount < 0) {
//       refunds[client]
//         ? refunds[client].push(dataSorted[i])
//         : (refunds[client] = [dataSorted[i]]);
//
//       continue;
//     }
//
//     // разделить заказы на периоды по переданному шагу
//     switch (period) {
//       case 'month': {
//         if (prevPeriod && order.date.isAnotherMonth(prevPeriod)) {
//           reportIdx++;
//         }
//         break;
//       }
//       case 'quarter': {
//         if (prevPeriod && order.date.isAnotherQuarter(prevPeriod)) {
//           reportIdx++;
//         }
//         break;
//       }
//       case 'year': {
//         if (prevPeriod && order.date.isAnotherYear(prevPeriod)) {
//           reportIdx++;
//         }
//         break;
//       }
//       default: {
//         throw new Error('Не определен разделитель периода');
//       }
//     }
//
//     if (!result[reportIdx]) {
//       result.push({
//         period: order.date,
//         type: period,
//         amount,
//         data: {
//           [client]: {
//             amount,
//             manager,
//             orders: [{ ...order, amount, discount }],
//           },
//         },
//       });
//     } else {
//       result[reportIdx].amount += amount;
//
//       if (result[reportIdx].data[client]) {
//         result[reportIdx].data[client].amount += amount;
//         result[reportIdx].data[client].orders.push({
//           ...order,
//           amount,
//           discount,
//         });
//       } else {
//         result[reportIdx].data[client] = {
//           amount,
//           manager,
//           orders: [{ ...order, amount, discount }],
//         };
//       }
//     }
//
//     prevPeriod = order.date;
//   }
//
//   return { commissionTrading, refunds, result };
// };
