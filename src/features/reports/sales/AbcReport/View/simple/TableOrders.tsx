import React, { FC, useRef } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { TSaleTableRowWithoutClient } from '../../abcReportFunctions';
import { percentFormatter, sumFormatter } from '../../../../../../utils/utils';
import TableGrid from '../../../../../../components/TableGrid';

type Props = {
  client: string;
  orders: TSaleTableRowWithoutClient[];
  onGoBack: () => void;
};

const TableOrders: FC<Props> = (props) => {
  const tableRef = useRef<HTMLTableElement>(null);

  return (
    <TableGrid title={props.client} onGoBack={props.onGoBack}>
      <Table aria-label={'orders table'} ref={tableRef}>
        <TableHead>
          <TableRow>
            <TableCell>Документ</TableCell>
            <TableCell>Дата</TableCell>
            <TableCell>Номер</TableCell>
            <TableCell align="right">Сумма</TableCell>
            <TableCell align="right">Скидка</TableCell>
            <TableCell align="right">% Скидки</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.orders.map((document, index) => (
            <TableRow key={index}>
              <TableCell>{document.order.type}</TableCell>
              <TableCell>
                {document.order.date?.toLocaleString('ru-RU')}
              </TableCell>
              <TableCell>{document.order.number}</TableCell>
              <TableCell align="right">
                {sumFormatter(document.amount)}
              </TableCell>
              <TableCell align="right">
                {document.discount && sumFormatter(document.discount)}
              </TableCell>
              <TableCell align="right">
                {document.discount &&
                  percentFormatter(document.discount / document.amount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableGrid>
  );
};

export default TableOrders;
