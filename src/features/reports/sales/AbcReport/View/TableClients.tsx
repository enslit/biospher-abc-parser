import React, { FC, useRef } from 'react';
import { styled } from '@mui/material/styles';
import {
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { ClientWithABC } from '../../../../../types/reports/sales/ClientWithABC';
import { percentFormatter, sumFormatter } from '../../../../../utils/utils';
import { ArrowBack } from '@mui/icons-material';

type Props = {
  manager: string;
  onRowClick: (client: string) => void;
  onGoBack: () => void;
  data: Record<string, ClientWithABC>;
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const TableTitleWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(3),
}));

const TableClients: FC<Props> = (props) => {
  const tableRef = useRef<HTMLTableElement>(null);

  const handleRowClick = (client: string) => () => {
    props.onRowClick(client);
  };

  return (
    <StyledPaper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TableTitleWrapper>
            <Button
              variant={'contained'}
              color={'primary'}
              onClick={props.onGoBack}
              startIcon={<ArrowBack />}
              size={'small'}
            >
              Назад
            </Button>
            <Typography variant={'h6'} component={'div'}>
              {props.manager}
            </Typography>
          </TableTitleWrapper>
        </Grid>
        <Grid item xs={12}>
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
                    <TableCell align="right">
                      {clientData.orders.length}
                    </TableCell>
                    <TableCell align="right">
                      {sumFormatter(clientData.amount)}
                    </TableCell>
                    <TableCell align="right">
                      {sumFormatter(
                        clientData.amount / clientData.orders.length
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {percentFormatter(clientData.abc.part / 100)}
                    </TableCell>
                    <TableCell align="right">
                      {clientData.abc.category}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </StyledPaper>
  );
};

export default TableClients;
