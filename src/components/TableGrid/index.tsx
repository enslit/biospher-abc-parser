import React, { FC } from 'react';
import StyledPaper from '../StyledPaper';
import { Grid, Paper, TableContainer } from '@mui/material';
import TableTitle from '../TableTitle';

type Props = {
  title: string;
  onGoBack?: () => void;
};

const TableGrid: FC<Props> = (props) => {
  return (
    <StyledPaper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TableTitle onGoBack={props.onGoBack}>{props.title}</TableTitle>
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper}>{props.children}</TableContainer>
        </Grid>
      </Grid>
    </StyledPaper>
  );
};

export default TableGrid;
