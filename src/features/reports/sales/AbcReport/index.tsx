import React, { FC, useMemo, useState } from 'react';
import Loader from '../../../../components/Loader';
import FileImport from '../../../FileImport';
import { getOrderParts } from '../../../../utils/utils';
import { utils, WorkBook } from 'xlsx';
import {
  reset,
  selectIsDataReady,
  selectProgressState,
  selectSettings,
  setInProgress,
  setResultParse,
  setSettings,
} from './abcSlice';
import ExcelParser from '../../../../utils/ExcelParser';
import { TSalesTableRow } from '../../../../types/reports/sales/TSalesTableRow';
import { setError, setWarning } from '../../../../app/appReducer';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import ReportSettings from './View/ReportSettings';
import { Grid, Typography } from '@mui/material';
import { TReportABCSettings } from './types/TReportABCSettings';
import AbcSimple from './ABCSimple';
import AbcComparative from './ABCComparative';

const AbcReport: FC = () => {
  const isInProgress = useAppSelector(selectProgressState);
  const isDataReady = useAppSelector(selectIsDataReady);
  const settings = useAppSelector(selectSettings);
  const dispatch = useAppDispatch();

  const [tableMessage, setTableMessage] = useState<string>('');
  const [isBuilt, setIsBuilt] = useState<boolean>(false);

  const header = useMemo(
    () => ({
      order: {
        label: 'Реализация',
        dataGetter: getOrderParts,
      },
      manager: { label: 'менеджер' },
      client: { label: 'Клиент' },
      amount: { label: 'Выручка' },
      discount: { label: 'Скидки' },
    }),
    []
  );

  const onFileLoaded = (workBook: WorkBook): void => {
    dispatch(setInProgress(true));

    const sheetName = workBook.SheetNames[0];
    const arr: (string | number | null)[][] = utils.sheet_to_json(
      workBook.Sheets[sheetName],
      {
        header: 1,
      }
    );

    new ExcelParser<TSalesTableRow>(arr, header)
      .parse()
      .then(({ meta, data }) => {
        dispatch(setResultParse({ meta, data }));
      })
      .catch((error) => {
        console.error(error);
        dispatch(setError(error.message));
      })
      .finally(() => {
        dispatch(setInProgress(false));
      });
  };

  const onApply = (newSettings: TReportABCSettings): void => {
    dispatch(setSettings(newSettings));
    setIsBuilt(true);
    setTableMessage('');
  };

  const onExport = () => {
    dispatch(setWarning('Данный функционал пока не реализован'));
  };

  const onSettingsChange = () => {
    if (!tableMessage && isBuilt) {
      setIsBuilt(false);
      setTableMessage('Настройки были изменены, сформируйте новый отчет');
    }
  };

  const onReset = () => {
    dispatch(reset());
    setIsBuilt(false);
    setTableMessage('');
  };

  const renderReport = () => {
    switch (settings.type) {
      case 'simple':
        return <AbcSimple />;
      case 'comparative':
        return <AbcComparative />;
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} height={'100%'}>
        {isDataReady ? (
          <ReportSettings
            onApply={onApply}
            onExport={onExport}
            onChange={onSettingsChange}
            onReset={onReset}
          />
        ) : isInProgress ? (
          <Loader />
        ) : (
          <FileImport onLoad={onFileLoaded} />
        )}
      </Grid>
      <Grid item xs={12}>
        {tableMessage && (
          <Typography variant={'h5'} component={'div'}>
            {tableMessage}
          </Typography>
        )}
        {isBuilt && renderReport()}
      </Grid>
    </Grid>
  );
};

export default AbcReport;
