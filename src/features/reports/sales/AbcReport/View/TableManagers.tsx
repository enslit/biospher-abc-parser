import React, { FC, useMemo, useRef } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import { useAppSelector } from '../../../../../app/hooks';
import { selectRenderABCManagersData } from '../abcSlice';
import { divideNumberDigits, getComparator } from '../../../../../utils/utils';
import { styled } from '@mui/material/styles';

type Props = {
  onRowClick: (manager: string) => void;
};

type TableData = {
  manager: string;
  a: number;
  b: number;
  c: number;
  ordersCount: number;
  total: number;
  average: number;
  part: number;
};

interface HeadCell {
  disablePadding: boolean;
  id: string;
  label: string;
  numeric: boolean;
}

interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
  order: OrderDirection;
  orderBy: string;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const headCells: readonly HeadCell[] = [
  {
    id: 'manager',
    numeric: false,
    disablePadding: true,
    label: 'Менеджер',
  },
  {
    id: 'ordersCount',
    numeric: true,
    disablePadding: false,
    label: 'Количество заказов',
  },
  {
    id: 'total',
    numeric: true,
    disablePadding: false,
    label: 'Сумма заказов',
  },
  {
    id: 'average',
    numeric: true,
    disablePadding: false,
    label: 'Средний чек',
  },
  {
    id: 'part',
    numeric: true,
    disablePadding: false,
    label: 'Доля продаж',
  },
  {
    id: 'a',
    numeric: true,
    disablePadding: false,
    label: 'A',
  },
  {
    id: 'b',
    numeric: true,
    disablePadding: false,
    label: 'B',
  },
  {
    id: 'c',
    numeric: true,
    disablePadding: false,
    label: 'C',
  },
];

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: string) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const TableManagers: FC<Props> = (props) => {
  const managersRenderData = useAppSelector(selectRenderABCManagersData);
  const [order, setOrder] = React.useState<OrderDirection>('asc');
  const [orderBy, setOrderBy] = React.useState<string>('manager');

  const rows: TableData[] = useMemo(() => {
    return Object.entries(managersRenderData).map(([manager, managerData]) => {
      const { part, average, ordersCount, total, clientsOnABC } = managerData;
      const { a, b, c } = clientsOnABC;
      return { manager, part, average, ordersCount, total, a, b, c };
    });
  }, [managersRenderData]);

  const tableRef = useRef<HTMLTableElement>(null);

  const handleRowClick = (manager: string) => () => {
    props.onRowClick(manager);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: string
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  return (
    <StyledPaper>
      <TableContainer component={Paper}>
        <Table aria-label="table" ref={tableRef}>
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {rows.sort(getComparator(order, orderBy)).map((row) => (
              <TableRow
                key={row.manager}
                onClick={handleRowClick(row.manager)}
                hover
                tabIndex={-1}
              >
                <TableCell component="th" scope="row" padding="none">
                  {row.manager}
                </TableCell>
                <TableCell align="right">{row.ordersCount}</TableCell>
                <TableCell align="right">
                  {divideNumberDigits(row.total.toFixed(2))}
                </TableCell>
                <TableCell align="right">
                  {divideNumberDigits(row.average.toFixed(2))}
                </TableCell>
                <TableCell align="right">
                  {(row.part * 100).toFixed(2)}%
                </TableCell>
                <TableCell align="right">{row.a}</TableCell>
                <TableCell align="right">{row.b}</TableCell>
                <TableCell align="right">{row.c}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </StyledPaper>
  );
};

export default TableManagers;
