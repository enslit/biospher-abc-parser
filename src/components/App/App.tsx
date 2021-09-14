import React, {
  ChangeEventHandler,
  createContext,
  Dispatch,
  FC,
  useCallback,
  useEffect,
  useReducer,
  useRef,
} from 'react';
import './App.css';
import { appReducer } from '../../state/reducer';
import { AppState } from '../../types/AppState';
import { Action } from '../../types/Action';
import { read, utils, WorkBook } from 'xlsx';
import { calculateAbc, parser } from '../../utils/parser';
import { ActionType } from '../../types/ActionType';
import TableManagers from '../Table/TableManagers';
import {
  Container,
  Grid,
  Input,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core';
import { importWorkBook } from '../../state/actions';
import Totals from '../Totals';
import { ABC } from '../../types/ABC';
import { TTotals } from '../../types/TTotals';
import { ClientWithABC } from '../../types/ClientWithABC';

const initState: AppState = {
  workBook: null,
  inProgress: false,
  resultParse: {},
  totals: null,
};

export const AppStateContext = createContext<AppState>(initState);
export const AppDispatchContext = createContext<Dispatch<Action>>(() => null);

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.background.default,
    color: theme.palette.text.primary,
    minHeight: '100vh',
    padding: `${theme.spacing(2)}px 0`,
  },
  paper: {
    padding: theme.spacing(3),
  },
}));

const App: FC = () => {
  const [state, dispatch] = useReducer(appReducer, initState);
  const inputRef = useRef<HTMLInputElement>(null);

  const styles = useStyles();

  const handlerImportFile: ChangeEventHandler<HTMLInputElement> = (e) => {
    // accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    if (e.target && e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (evt) => {
        if (evt.target && evt.target.result) {
          const data = new Uint8Array(evt.target.result as ArrayBuffer);
          const wb: WorkBook = read(data, { type: 'array' });
          dispatch(importWorkBook(wb));
        }
      };
    }
  };

  const calculateTotals = useCallback(
    (data: Record<string, ClientWithABC>): TTotals => {
      const totalsInit: TTotals = {
        orders: 0,
        amount: 0,
        clients: {
          a: 0,
          b: 0,
          c: 0,
        },
      };

      return Object.values(data).reduce((acc: TTotals, clientData) => {
        acc.orders += clientData.orders.length;
        acc.amount += clientData.totalAmount;

        switch (clientData.abc.category) {
          case ABC.A: {
            acc.clients.a += 1;
            break;
          }
          case ABC.B: {
            acc.clients.b += 1;
            break;
          }
          case ABC.C: {
            acc.clients.c += 1;
            break;
          }
          default:
            console.log('unknown ABC type:', clientData.abc.category);
        }

        return acc;
      }, totalsInit);
    },
    []
  );

  useEffect(() => {
    if (state.workBook) {
      dispatch({ type: ActionType.InProgressOn });
      const sheetName = state.workBook.SheetNames[0];
      const arr: (string | number | null)[][] = utils.sheet_to_json(
        state.workBook.Sheets[sheetName],
        {
          header: 1,
        }
      );

      const { meta, result } = parser(arr);
      console.log(meta);
      const abcResult = calculateAbc(result);
      const totals: TTotals = calculateTotals(abcResult);

      dispatch({ type: ActionType.SetResultParse, payload: abcResult });
      dispatch({ type: ActionType.SetTotals, payload: totals });
      dispatch({ type: ActionType.InProgressOff });
    }
  }, [state.workBook, calculateTotals]);

  return (
    <div className={styles.root}>
      <AppDispatchContext.Provider value={dispatch}>
        <AppStateContext.Provider value={state}>
          <Container>
            {state.inProgress ? (
              <Typography variant="h6" gutterBottom component="div">
                Обработка...
              </Typography>
            ) : (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper className={styles.paper}>
                    {state.totals ? (
                      <Totals data={state.totals} />
                    ) : (
                      <Input
                        type="file"
                        color="primary"
                        inputRef={inputRef}
                        onChange={handlerImportFile}
                      />
                    )}
                  </Paper>
                </Grid>
                {state.totals && (
                  <Grid item xs={12}>
                    <TableManagers />
                  </Grid>
                )}
              </Grid>
            )}
          </Container>
        </AppStateContext.Provider>
      </AppDispatchContext.Provider>
    </div>
  );
};

export default App;
