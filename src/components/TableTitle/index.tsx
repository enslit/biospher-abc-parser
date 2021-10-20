import { Button, Typography } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import React, { FC } from 'react';
import { styled } from '@mui/material/styles';

type Props = {
  onGoBack?: () => void;
};

const TableTitleWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(3),
}));

const TableTitle: FC<Props> = (props) => {
  return (
    <TableTitleWrapper>
      {props.onGoBack && (
        <Button
          variant={'contained'}
          color={'primary'}
          onClick={props.onGoBack}
          startIcon={<ArrowBack />}
          size={'small'}
        >
          Назад
        </Button>
      )}
      <Typography variant={'h6'} component={'div'}>
        {props.children}
      </Typography>
    </TableTitleWrapper>
  );
};

export default TableTitle;
