import React, { FC, useMemo, useRef } from 'react';
import TableGrid from '../../../../../../components/TableGrid';
import { ComparativeReportResult } from '../../types/ComparativeReportResult';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { ComparativeClientsTableData } from '../../types/ComparativeClientsTableData';
import ComparativeTableClientRow from './ComparativeTableClientRow';
import { TSaleTableRowWithoutClient } from '../../abcReportFunctions';

type Props = {
  manager: string;
  clients: ComparativeReportResult;
  onGoBack: () => void;
};

const TableClientsComparative: FC<Props> = (props) => {
  const tableRef = useRef<HTMLTableElement>(null);

  const calcOrdersSum = (orders: TSaleTableRowWithoutClient[]): number => {
    return orders.reduce((sum, order) => sum + order.amount, 0);
  };

  const rows = useMemo(() => {
    const clients: ComparativeClientsTableData[] = [];

    Object.entries(props.clients).forEach(([clientName, clientData]) => {
      clients.push({
        client: clientName,
        left: {
          ordersCount: clientData.left?.orders.length || 0,
          ordersSum: clientData.left?.orders
            ? calcOrdersSum(clientData.left.orders)
            : 0,
          amount: clientData.left?.amount || 0,
          part: clientData.left?.abc.part || 0,
          category: clientData.left?.abc.category || null,
        },
        right: {
          ordersCount: clientData.right?.orders.length || 0,
          ordersSum: clientData.right?.orders
            ? calcOrdersSum(clientData.right.orders)
            : 0,
          amount: clientData.right?.amount || 0,
          part: clientData.right?.abc.part || 0,
          category: clientData.right?.abc.category || null,
        },
      });
    });

    return clients;
  }, [props.clients]);

  return (
    <TableGrid title={props.manager} onGoBack={props.onGoBack}>
      <Table aria-label="Сравнительная таблица ABC по клиентам" ref={tableRef}>
        <TableHead>
          <TableRow>
            <TableCell>Клиент</TableCell>
            <TableCell align="right">Количество заказов</TableCell>
            <TableCell align="right">Сумма заказов</TableCell>
            <TableCell align="right">Средний чек</TableCell>
            <TableCell align="right">Вклад в продажи</TableCell>
            <TableCell align="right">Категория</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <ComparativeTableClientRow key={row.client} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableGrid>
  );
};

export default TableClientsComparative;
