import React from 'react';
import { ClientTableData } from '../../types/ClientTableData';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import RowClient from './RowClient';

type TableClientsProps = {
  clients: ClientTableData[];
};

const TableClients = (props: TableClientsProps): JSX.Element => {
  return (
    <Table size="small" aria-label="clients">
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
          <RowClient key={client.client} client={client} />
        ))}
      </TableBody>
    </Table>
  );
};

export default TableClients;
