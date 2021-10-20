import React, { FC, useCallback, useMemo } from 'react';
import {
  diffFormatter,
  percentFormatter,
  sumFormatter,
} from '../../../../../../utils/utils';
import { TableCell, TableRow } from '@mui/material';
import ComparativeTableCell from './ComparativeTableCell';
import { ComparativeManagerSide } from '../../types/ComparativeManagerSide';
import { ComparativeManagerTableData } from '../../types/ComparativeManagerTableData';
import { styled } from '@mui/styles';

type RenderData = Record<
  keyof ComparativeManagerSide,
  { left: string | number; right: string | number; diff: string | number }
>;

type RowProps = {
  row: ComparativeManagerTableData;
  onRowClick: (manager: string) => void;
};

const StyledTableRow = styled(TableRow)({
  cursor: 'pointer',
});

const ComparativeTableManagerRow: FC<RowProps> = (props) => {
  const { row, onRowClick } = props;

  const onClick = useCallback(() => {
    onRowClick(row.manager);
  }, [row, onRowClick]);

  const getChange = useCallback(
    (field: keyof ComparativeManagerSide): 'up' | 'down' | 'flat' => {
      const fieldDataLeft = row.left && row.left[field];
      const fieldDataRight = row.right && row.right[field];

      if (fieldDataLeft && !fieldDataRight) return 'down';
      if (!fieldDataLeft && fieldDataRight) return 'up';

      if (fieldDataLeft && fieldDataRight) {
        if (fieldDataLeft < fieldDataRight) return 'up';
        if (fieldDataLeft > fieldDataRight) return 'down';
      }

      return 'flat';
    },
    [row]
  );

  const content = useMemo((): RenderData => {
    const defaultSide: ComparativeManagerSide = {
      ordersCount: 0,
      total: 0,
      average: 0,
      part: 0,
      a: 0,
      b: 0,
      c: 0,
    };

    const left = row.left || defaultSide;
    const right = row.right || defaultSide;

    const {
      ordersCount: countLeft,
      total: totalLeft,
      average: averageLeft,
      part: partLeft,
      a: aLeft,
      b: bLeft,
      c: cLeft,
    } = left;
    const {
      ordersCount: countRight,
      total: totalRight,
      average: averageRight,
      part: partRight,
      a: aRight,
      b: bRight,
      c: cRight,
    } = right;

    return {
      ordersCount: {
        left: countLeft,
        right: countRight,
        diff: diffFormatter(countRight - countLeft),
      },
      total: {
        left: sumFormatter(totalLeft),
        right: sumFormatter(totalRight),
        diff: diffFormatter(totalRight - totalLeft),
      },
      average: {
        left: sumFormatter(averageLeft),
        right: sumFormatter(averageRight),
        diff: diffFormatter(averageRight - averageLeft),
      },
      part: {
        left: percentFormatter(partLeft),
        right: percentFormatter(partRight),
        diff: diffFormatter(partRight - partLeft),
      },
      a: {
        left: aLeft,
        right: aRight,
        diff: diffFormatter(aRight - aLeft),
      },
      b: {
        left: bLeft,
        right: bRight,
        diff: diffFormatter(bRight - bLeft),
      },
      c: {
        left: cLeft,
        right: cRight,
        diff: diffFormatter(cRight - cLeft),
      },
    };
  }, [row]);

  return (
    <StyledTableRow key={row.manager} onClick={onClick} hover tabIndex={-1}>
      <TableCell component="th" scope="row">
        {row.manager}
      </TableCell>
      {Object.entries(content).map(([key, value]) => (
        <ComparativeTableCell
          key={key}
          contentLeft={value.left}
          contentRight={value.right}
          diff={value.diff}
          change={getChange(key as keyof ComparativeManagerSide)}
        />
      ))}
    </StyledTableRow>
  );
};

export default ComparativeTableManagerRow;
