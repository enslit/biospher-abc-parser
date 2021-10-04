import React from 'react';
import {
  Box,
  Collapse,
  IconButton,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import { ManagerTableData } from '../../../../types/reports/sales/ManagerTableData';
import { makeStyles } from '@mui/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import TableClients from './TableClients';
import { divideNumberDigits, roundDecimal } from '../../../../utils/utils';

type RowProps = {
  row: ManagerTableData;
};

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

const ManagerABCRow = (props: RowProps): JSX.Element => {
  const [open, setOpen] = React.useState(false);
  const { row } = props;
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
          {row.manager}
        </TableCell>
        <TableCell align="right">{row.count}</TableCell>
        <TableCell align="right">
          {divideNumberDigits(roundDecimal(row.total))}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Клиенты
              </Typography>
              <TableClients clients={row.clients} />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default ManagerABCRow;
