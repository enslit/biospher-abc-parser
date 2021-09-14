import React from 'react';
import { ClientTableData } from '../../types/ClientTableData';
import { makeStyles } from '@material-ui/styles';
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
} from '@material-ui/core';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

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

const RowClient = (props: RowClientProps): JSX.Element => {
  const [open, setOpen] = React.useState(false);
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
          {client.totalAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
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
              <Table size="small" aria-label="Заказы">
                <TableHead>
                  <TableRow>
                    <TableCell>Тип документа</TableCell>
                    <TableCell>Дата</TableCell>
                    <TableCell>Номер</TableCell>
                    <TableCell align="right">Сумма</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {client.orders.map((order, index) => {
                    const { type, amount, date = null, number = null } = order;
                    return (
                      <TableRow key={index}>
                        <TableCell>{type}</TableCell>
                        <TableCell>
                          {(date && date.toLocaleDateString('ru-RU')) ||
                            'Без даты'}
                        </TableCell>
                        <TableCell>{number || 'Б/Н'}</TableCell>
                        <TableCell align="right">{amount}</TableCell>
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

export default RowClient;
