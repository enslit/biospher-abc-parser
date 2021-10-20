import React, { FC, useMemo, useRef } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import StyledPaper from '../../../../../../components/StyledPaper';
import { ManagersResultsComparative } from '../../types/ManagersResultsComparative';
import ComparativeTableManagerRow from './ComparativeTableManagerRow';
import { ComparativeManagerTableData } from '../../types/ComparativeManagerTableData';
import { ComparativeManagerSide } from '../../types/ComparativeManagerSide';

type Props = {
  managers: ManagersResultsComparative;
  onRowClick: (manager: string) => void;
};

const TableManagersComparative: FC<Props> = (props) => {
  const tableRef = useRef<HTMLTableElement>(null);

  const rows: ComparativeManagerTableData[] = useMemo(() => {
    return Object.entries(props.managers).map(([manager, managerData]) => {
      let leftSideData: ComparativeManagerSide | null = null;
      let rightSideData: ComparativeManagerSide | null = null;

      if (managerData.left) {
        const { part, average, ordersCount, total, clientsOnABC } =
          managerData.left;
        const { a, b, c } = clientsOnABC;

        leftSideData = { part, average, ordersCount, total, a, b, c };
      }

      if (managerData.right) {
        const { part, average, ordersCount, total, clientsOnABC } =
          managerData.right;
        const { a, b, c } = clientsOnABC;

        rightSideData = { part, average, ordersCount, total, a, b, c };
      }

      return {
        manager,
        left: leftSideData,
        right: rightSideData,
      };
    });
  }, [props.managers]);

  return (
    <StyledPaper>
      <TableContainer component={Paper}>
        <Table aria-label="table" ref={tableRef}>
          <TableHead>
            <TableRow>
              <TableCell>Менеджер</TableCell>
              <TableCell align="right">Количество заказов</TableCell>
              <TableCell align="right">Сумма заказов</TableCell>
              <TableCell align="right">Средний чек</TableCell>
              <TableCell align="right">Доля продаж</TableCell>
              <TableCell align="right">A</TableCell>
              <TableCell align="right">B</TableCell>
              <TableCell align="right">C</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <ComparativeTableManagerRow
                key={row.manager}
                row={row}
                onRowClick={props.onRowClick}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </StyledPaper>
  );
};

export default TableManagersComparative;
