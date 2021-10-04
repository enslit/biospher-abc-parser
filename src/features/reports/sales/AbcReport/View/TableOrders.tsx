import React, { FC, useRef } from 'react';
import { styled } from '@mui/material/styles';
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { TSaleTableRowWithoutClient } from '../abcReportFunctions';
import { divideNumberDigits } from '../../../../../utils/utils';

type Props = {
  orders: TSaleTableRowWithoutClient[];
  onGoBack: () => void;
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const TableOrders: FC<Props> = (props) => {
  const tableRef = useRef<HTMLTableElement>(null);

  return (
    <StyledPaper>
      <Button variant={'text'} color={'primary'} onClick={props.onGoBack}>
        Назад
      </Button>
      <TableContainer component={Paper}>
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
                  {divideNumberDigits(document.amount.toFixed(2))}
                </TableCell>
                <TableCell align="right">
                  {document.discount &&
                    divideNumberDigits(document.discount.toFixed(2))}
                </TableCell>
                <TableCell align="right">
                  {document.discount &&
                    `${((document.discount / document.amount) * 100).toFixed(
                      2
                    )}%`}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </StyledPaper>
  );
};

export default TableOrders;
