import React, { useRef } from 'react';
import { ClientTableData } from '../../../../types/reports/sales/ClientTableData';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import ClientABCRow from './ClientABCRow';

type TableClientsProps = {
  clients: ClientTableData[];
};

const TableClients = (props: TableClientsProps): JSX.Element => {
  const tableRef = useRef<HTMLTableElement>(null);

  return (
    <Table size="small" aria-label="clients" ref={tableRef}>
      <TableHead>
        <TableRow>
          <TableCell />
          <TableCell>Клиент</TableCell>
          <TableCell>Категория</TableCell>
          <TableCell align="right">Количество заказов</TableCell>
          <TableCell align="right">Сумма заказов</TableCell>
          <TableCell align="right">Часть</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.clients.map((client) => (
          <ClientABCRow key={client.client} client={client} />
        ))}
      </TableBody>
    </Table>
  );
};

export default TableClients;
