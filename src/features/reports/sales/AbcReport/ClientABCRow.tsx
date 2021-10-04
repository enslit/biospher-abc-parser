import React, { useRef } from 'react';
import { ClientTableData } from '../../../../types/reports/sales/ClientTableData';
import { makeStyles } from '@mui/styles';
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { divideNumberDigits } from '../../../../utils/utils';

type RowClientProps = {
  client: ClientTableData;
};

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

const ClientABCRow = (props: RowClientProps): JSX.Element => {
  const [open, setOpen] = React.useState(false);
  const tableRef = useRef<HTMLTableElement>(null);
  const { client } = props;
  const classes = useRowStyles();

  return (
    <>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {client.client}
        </TableCell>
        <TableCell align="center">{client.category}</TableCell>
        <TableCell align="right">{client.orders.length}</TableCell>
        <TableCell align="right">
          {divideNumberDigits(client.totalAmount.toFixed(2))}
        </TableCell>
        <TableCell align="right">
          {Math.round((client.part + Number.EPSILON) * 100) / 100}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Заказы
              </Typography>
              <Table size="small" aria-label="Заказы" ref={tableRef}>
                <TableHead>
                  <TableRow>
                    <TableCell>Тип документа</TableCell>
                    <TableCell>Дата</TableCell>
                    <TableCell>Номер</TableCell>
                    <TableCell align="right">Сумма</TableCell>
                    <TableCell align="right">Скидка</TableCell>
                    <TableCell align="right">% Скидки</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {client.orders.map((order, index) => {
                    const {
                      type,
                      amount,
                      date = null,
                      number = null,
                      discount = '',
                    } = order;
                    return (
                      <TableRow key={index}>
                        <TableCell>{type}</TableCell>
                        <TableCell>
                          {(date && date.toLocaleDateString('ru-RU')) ||
                            'Без даты'}
                        </TableCell>
                        <TableCell>{number || 'Б/Н'}</TableCell>
                        <TableCell align="right">
                          {divideNumberDigits(amount.toFixed(2))}
                        </TableCell>
                        <TableCell align="right">
                          {discount && divideNumberDigits(discount.toFixed(2))}
                        </TableCell>
                        <TableCell align="right">
                          {discount && ((discount / amount) * 100).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default ClientABCRow;
