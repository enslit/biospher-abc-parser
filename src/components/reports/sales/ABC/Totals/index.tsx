import React, { useCallback, useContext } from 'react';
import { TTotals } from '../../../../../types/reports/sales/TTotals';
import { Button, Grid, Theme, Typography } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import { divideNumberDigits, roundDecimal } from '../../../../../utils/utils';
import CachedIcon from '@mui/icons-material/Cached';
import { makeStyles } from '@mui/styles';
import { AppDispatchContext } from '../../../../App/App';
import { ActionType } from '../../../../../types/state/ActionType';

type TotalsProps = {
  data: TTotals;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(1),
    },
  })
);

const Totals = ({ data }: TotalsProps): JSX.Element => {
  const dispatch = useContext(AppDispatchContext);
  const classes = useStyles();
  const { orders, amount, clients } = data;

  const onReset = useCallback(() => {
    dispatch({ type: ActionType.ResetResultParse });
  }, [dispatch]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={5}>
        <Typography variant="h6" gutterBottom component="div">
          Количество заказов {orders}
        </Typography>
        <Typography variant="h6" gutterBottom component="div">
          Общая сумма заказов {divideNumberDigits(roundDecimal(amount))}
        </Typography>
      </Grid>
      <Grid item xs={12} md={5}>
        <Typography variant="h6" gutterBottom component="div">
          Количество клиентов по категориям:
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Typography variant="body1" component="span">
              A: {clients.a}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body1" component="span">
              B: {clients.b}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body1" component="span">
              C: {clients.c}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={2}>
        <Button
          variant="contained"
          color="secondary"
          className={classes.button}
          onClick={onReset}
          startIcon={<CachedIcon />}
        >
          Сброс
        </Button>
        {/*<Button*/}
        {/*  variant="contained"*/}
        {/*  color="primary"*/}
        {/*  className={classes.button}*/}
        {/*  startIcon={<CloudDownloadIcon />}*/}
        {/*>*/}
        {/*  в EXCEL*/}
        {/*</Button>*/}
      </Grid>
    </Grid>
  );
};

export default Totals;
