import React, {
  createContext,
  Dispatch,
  FC,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import './App.css';
import { appReducer } from '../../state/reducer';
import { AppState } from '../../types/state/AppState';
import { Action } from '../../types/state/Action';
import { utils } from 'xlsx';
import { ActionType } from '../../types/state/ActionType';
import { CssBaseline, Grid } from '@mui/material';
import { setDataLoaded, setParseResult } from '../../state/actions';
import ExcelParser, { ParserResponse } from '../../utils/ExcelParser';
import { getOrderParts } from '../../utils/utils';
import { TSalesTableRow } from '../../types/reports/sales/TSalesTableRow';
import FileImportPanel from '../FileImportPanel';
import Loader from '../Loader';
import ParsingResultPanel from '../ParsingResultPanel';
import MenuDrawer from '../MenuDrawer';

const initState: AppState<TSalesTableRow[]> = {
  fileDetails: null,
  workBook: null,
  inProgress: false,
  isDataLoaded: false,
  resultParse: {
    meta: {
      period: { start: null, end: null },
      rows: 0,
    },
    data: [],
  },
  abc: {},
  totals: null,
};

export const AppStateContext =
  createContext<AppState<TSalesTableRow[]>>(initState);
export const AppDispatchContext = createContext<Dispatch<Action>>(() => null);

// const useStyles = makeStyles((theme) => ({
//   root: {
//     background: theme.palette.background.default,
//     color: theme.palette.text.primary,
//     minHeight: '100vh',
//     padding: `${theme.spacing(2)}px 0`,
//   },
//   paper: {
//     padding: theme.spacing(3),
//   },
// }));

const App: FC = () => {
  const [state, dispatch] = useReducer(appReducer, initState);

  const header = useMemo(
    () => ({
      order: {
        label: 'Реализация',
        dataGetter: getOrderParts,
      },
      manager: { label: 'менеджер' },
      client: { label: 'Клиент' },
      sum: { label: 'Выручка' },
      discount: { label: 'Скидки' },
    }),
    []
  );

  useEffect(() => {
    if (state.workBook) {
      console.time('excel reader');
      const sheetName = state.workBook.SheetNames[0];
      const arr: (string | number | null)[][] = utils.sheet_to_json(
        state.workBook.Sheets[sheetName],
        {
          header: 1,
        }
      );
      console.timeEnd('excel reader');

      console.time('parser');
      new ExcelParser<TSalesTableRow>(arr, header)
        .parse()
        .then(({ meta, data }) => {
          dispatch(
            setParseResult<ParserResponse<TSalesTableRow>>({ meta, data })
          );
          dispatch(setDataLoaded(true));
        })
        .catch((error) => {
          console.error(error.message);
        })
        .finally(() => {
          dispatch({ type: ActionType.InProgressOff });
        });
      console.timeEnd('parser');
    }
  }, [state.workBook, header]);

  return (
    <div>
      <CssBaseline />
      <AppDispatchContext.Provider value={dispatch}>
        <AppStateContext.Provider value={state}>
          <MenuDrawer>
            {state.inProgress ? (
              <Loader />
            ) : (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FileImportPanel />
                </Grid>
                {state.isDataLoaded && (
                  <Grid item xs={12}>
                    <ParsingResultPanel />
                  </Grid>
                )}
              </Grid>
            )}
          </MenuDrawer>
        </AppStateContext.Provider>
      </AppDispatchContext.Provider>
    </div>
  );
};

export default App;
