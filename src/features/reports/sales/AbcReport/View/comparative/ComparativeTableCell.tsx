import React, { FC } from 'react';
import { TableCell, Typography } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

type CellProps = {
  change: 'up' | 'down' | 'flat';
  contentLeft: string | number;
  contentRight: string | number;
  diff?: string | number;
};

const CompCell = styled('div')(({ theme }) => ({
  display: 'grid',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gridTemplateColumns: 'repeat(4, min-content)',
  gridGap: theme.spacing(1),
}));

const ComparativeTableCell: FC<CellProps> = ({
  contentLeft,
  contentRight,
  diff,
  change,
}) => {
  const color =
    change === 'up' ? 'green' : change === 'down' ? 'red' : 'orange';

  return (
    <TableCell align="right">
      <CompCell>
        <Typography variant={'body2'} component={'span'} textAlign={'center'}>
          {contentLeft}
        </Typography>
        <ArrowForward fontSize={'small'} />
        <Typography
          variant={'body2'}
          component={'span'}
          textAlign={'center'}
          color={color}
        >
          {contentRight}
        </Typography>
        {diff && (
          <Typography
            variant={'body2'}
            component={'span'}
            textAlign={'center'}
            color={color}
          >
            ({diff})
          </Typography>
        )}
      </CompCell>
    </TableCell>
  );
};

export default ComparativeTableCell;
