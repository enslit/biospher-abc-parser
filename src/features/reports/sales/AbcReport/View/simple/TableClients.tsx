import React, { FC, useRef } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { ClientWithABC } from '../../../../../../types/reports/sales/ClientWithABC';
import { percentFormatter, sumFormatter } from '../../../../../../utils/utils';
import TableGrid from '../../../../../../components/TableGrid';

type Props = {
  manager: string;
  onRowClick: (client: string) => void;
  onGoBack: () => void;
  data: Record<string, ClientWithABC>;
};

const TableClients: FC<Props> = (props) => {
  const tableRef = useRef<HTMLTableElement>(null);

  const handleRowClick = (client: string) => () => {
    props.onRowClick(client);
  };

  return (
    <TableGrid onGoBack={props.onGoBack} title={props.manager}>
      <Table aria-label="table" ref={tableRef}>
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
          {Object.entries(props.data).map(([client, clientData]) => (
            <TableRow key={client} onClick={handleRowClick(client)} hover>
              <TableCell>{client}</TableCell>
              <TableCell align="right">{clientData.orders.length}</TableCell>
              <TableCell align="right">
                {sumFormatter(clientData.amount)}
              </TableCell>
              <TableCell align="right">
                {sumFormatter(clientData.amount / clientData.orders.length)}
              </TableCell>
              <TableCell align="right">
                {percentFormatter(clientData.abc.part / 100)}
              </TableCell>
              <TableCell align="right">{clientData.abc.category}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableGrid>
  );
};

export default TableClients;
