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
  Typography,
  Grid,
} from '@mui/material';
import { TSaleTableRowWithoutClient } from '../abcReportFunctions';
import { percentFormatter, sumFormatter } from '../../../../../utils/utils';
import { ArrowBack } from '@mui/icons-material';

type Props = {
  client: string;
  orders: TSaleTableRowWithoutClient[];
  onGoBack: () => void;
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const TableTitleWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(3),
}));

const TableOrders: FC<Props> = (props) => {
  const tableRef = useRef<HTMLTableElement>(null);

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
              {props.client}
            </Typography>
          </TableTitleWrapper>
        </Grid>
        <Grid item xs={12}>
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
          </TableContainer>
        </Grid>
      </Grid>
    </StyledPaper>
  );
};

export default TableOrders;
