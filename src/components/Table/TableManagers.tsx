import React, { FC, useContext, useMemo } from 'react';
import { AppStateContext } from '../App/App';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import Row from './Row';
import { ClientTableData } from '../../types/ClientTableData';
import { divideNumberDigits, roundDecimal } from '../../utils/utils';
import { TTotals } from '../../types/TTotals';
import { ABC } from '../../types/ABC';

const TableManagers: FC = () => {
  const { resultParse, inProgress } = useContext(AppStateContext);

  const managers = useMemo(() => {
    const objData = Object.entries(resultParse).reduce(
      (result: Record<string, ClientTableData[]>, [name, clientData]) => {
        const clientDataRow: ClientTableData = {
          ...clientData,
          client: name,
          part: clientData.abc.part,
          category: clientData.abc.category,
        };

        if (
          clientData.manager in result &&
          Array.isArray(result[clientData.manager])
        ) {
          result[clientData.manager].push(clientDataRow);
        } else {
          result[clientData.manager] = [clientDataRow];
        }

        return result;
      },
      {}
    );

    return Object.entries(objData).map(([manager, clients]) => {
      const result = clients.reduce(
        (res, client) => {
          res.total += client.totalAmount;
          res.count += client.orders.length;
          return res;
        },
        {
          total: 0,
          count: 0,
        }
      );

      return {
        manager,
        ...result,
        clients,
      };
    });
  }, [resultParse]);

  if (inProgress) {
    return <h2>Обработка...</h2>;
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Менеджер</TableCell>
            <TableCell align="right">Количество заказов</TableCell>
            <TableCell align="right">Сумма заказов</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {managers &&
            managers.map((row) => <Row key={row.manager} row={row} />)}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableManagers;
