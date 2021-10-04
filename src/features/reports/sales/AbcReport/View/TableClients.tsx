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
import { ClientWithABC } from '../../../../../types/reports/sales/ClientWithABC';
import { divideNumberDigits } from '../../../../../utils/utils';

type Props = {
  onRowClick: (client: string) => void;
  onGoBack: () => void;
  data: Record<string, ClientWithABC>;
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const TableClients: FC<Props> = (props) => {
  const tableRef = useRef<HTMLTableElement>(null);

  const handleRowClick = (client: string) => () => {
    props.onRowClick(client);
  };

  return (
    <StyledPaper>
      <Button variant={'text'} color={'primary'} onClick={props.onGoBack}>
        Назад
      </Button>
      <TableContainer component={Paper}>
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
                  {divideNumberDigits(clientData.amount.toFixed(2))}
                </TableCell>
                <TableCell align="right">
                  {divideNumberDigits(
                    (clientData.amount / clientData.orders.length).toFixed(2)
                  )}
                </TableCell>
                <TableCell align="right">
                  {clientData.abc.part.toFixed(2)}%
                </TableCell>
                <TableCell align="right">{clientData.abc.category}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </StyledPaper>
  );
};

export default TableClients;
