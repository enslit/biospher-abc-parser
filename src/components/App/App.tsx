import React, { FC, useEffect } from 'react';
import { CssBaseline } from '@mui/material';
import Loader from '../Loader';
import MenuDrawer from '../MenuDrawer';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAppReady, setReady } from '../../app/appReducer';
import ErrorHandler from '../ErrorHandler';
import AbcReport from '../../features/reports/sales/AbcReport';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import ruLocale from 'date-fns/locale/ru';
import WarningHandler from '../WarningHandler';

const App: FC = () => {
  const appReady = useAppSelector(selectAppReady);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setReady());
  }, [dispatch]);

  return (
    <>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns} locale={ruLocale}>
        <MenuDrawer>
          {!appReady && <Loader />}
          <AbcReport />
        </MenuDrawer>
        <ErrorHandler />
        <WarningHandler />
      </LocalizationProvider>
    </>
  );
};

export default App;
