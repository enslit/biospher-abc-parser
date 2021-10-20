import React, { FC, useMemo } from 'react';
import { ComparativeClientsTableData } from '../../types/ComparativeClientsTableData';
import { TableCell, TableRow } from '@mui/material';
import {
  diffFormatter,
  percentFormatter,
  sumFormatter,
} from '../../../../../../utils/utils';
import { ABC } from '../../../../../../types/reports/sales/ABC';
import ComparativeTableCell from './ComparativeTableCell';
import { getChange } from '../../abcReportFunctions';
import { ComparativeClientSide } from '../../types/ComparativeClientSide';

type Props = {
  row: ComparativeClientsTableData;
};

type RenderData = {
  ordersCount: {
    left: number;
    right: number;
    diff: string;
  };
  ordersSum: {
    left: string;
    right: string;
    diff: string;
  };
  amount: {
    left: string;
    right: string;
    diff: string;
  };
  part: {
    left: string;
    right: string;
    diff: string;
  };
  category: {
    left: ABC | null;
    right: ABC | null;
    diff: undefined;
  };
};

const ComparativeTableClientRow: FC<Props> = (props) => {
  const { row } = props;

  const content = useMemo((): RenderData => {
    return {
      ordersCount: {
        left: row.left.ordersCount,
        right: row.right.ordersCount,
        diff: diffFormatter(row.right.ordersCount - row.left.ordersCount),
      },
      ordersSum: {
        left: sumFormatter(row.left.ordersSum),
        right: sumFormatter(row.right.ordersSum),
        diff: diffFormatter(row.right.ordersSum - row.left.ordersSum),
      },
      amount: {
        left: sumFormatter(row.left.amount),
        right: sumFormatter(row.right.amount),
        diff: diffFormatter(row.right.amount - row.left.amount),
      },
      part: {
        left: percentFormatter(row.left.part),
        right: percentFormatter(row.right.part),
        diff: diffFormatter(row.right.part - row.left.part),
      },
      category: {
        left: row.left.category,
        right: row.right.category,
        diff: undefined,
      },
    };
  }, [row]);

  return (
    <TableRow key={row.client} tabIndex={-1}>
      <TableCell component="th" scope="row">
        {row.client}
      </TableCell>
      {Object.entries(content).map(([key, value]) => (
        <ComparativeTableCell
          key={key}
          change={getChange(
            row.left[key as keyof ComparativeClientSide],
            row.right[key as keyof ComparativeClientSide]
          )}
          contentLeft={value.left || '-'}
          contentRight={value.right || '-'}
          diff={value.diff}
        />
      ))}
    </TableRow>
  );
};

export default ComparativeTableClientRow;
