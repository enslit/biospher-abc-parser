import React, { FC, useEffect, useMemo, useState } from 'react';
import Loader from '../../../../components/Loader';
import FileImport from '../../../FileImport';
import { getOrderParts } from '../../../../utils/utils';
import { utils, WorkBook } from 'xlsx';
import {
  selectCalculatedAbc,
  selectIsDataReady,
  selectOrdersData,
  selectProgressState,
  selectRenderABCManagersData,
  selectSettings,
  setCalculatedAbc,
  setInProgress,
  setManagersData,
  setResultParse,
} from './abcSlice';
import ExcelParser from '../../../../utils/ExcelParser';
import { TSalesTableRow } from '../../../../types/reports/sales/TSalesTableRow';
import { setError, setWarning } from '../../../../app/appReducer';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import ReportSettings from './View/ReportSettings';
import {
  calculateSimpleAbc,
  getManagersResults,
  getPeriod,
  TSaleTableRowWithoutClient,
} from './abcReportFunctions';
import TableManagers from './View/TableManagers';
import { Grid, Typography } from '@mui/material';
import { ClientWithABC } from '../../../../types/reports/sales/ClientWithABC';
import TableClients from './View/TableClients';
import TableOrders from './View/TableOrders';

const AbcReport: FC = () => {
  const isInProgress = useAppSelector(selectProgressState);
  const isDataReady = useAppSelector(selectIsDataReady);
  const orders = useAppSelector(selectOrdersData);
  const settings = useAppSelector(selectSettings);
  const managersRenderData = useAppSelector(selectRenderABCManagersData);
  const abc = useAppSelector(selectCalculatedAbc);
  const dispatch = useAppDispatch();

  const [managerClients, setManagerClients] = useState<Record<
    string,
    ClientWithABC
  > | null>(null);
  const [clientOrders, setClientOrders] = useState<
    TSaleTableRowWithoutClient[] | null
  >(null);
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

  const onApply = () => {
    setTableMessage('');

    const period = getPeriod(settings);
    calculateSimpleAbc(orders, period, settings.weights).then((res) => {
      dispatch(setCalculatedAbc(res));
      dispatch(setManagersData(getManagersResults(res)));
      setIsBuilt(true);
    });
  };

  const onExport = () => {
    dispatch(setWarning('Данный функционал пока не реализован'));
  };

  const onSettingsChange = () => {
    if (!tableMessage && isBuilt) {
      setTableMessage('Настройки были изменены, сформируйте новый отчет');
    }
  };

  const handleSelectManager = (manager: string) => {
    const clients = Object.fromEntries(
      Object.entries(abc).filter(([, data]) => {
        return data.manager === manager;
      })
    );

    setManagerClients(clients);
  };

  const handleSelectClient = (client: string) => {
    if (managerClients) {
      setClientOrders(managerClients[client].orders);
    }
  };

  const handleGoBackToRoot = () => {
    setManagerClients(null);
  };

  const handleGoBackToClients = () => {
    setClientOrders(null);
  };

  useEffect(() => {
    if (isBuilt && Object.keys(managersRenderData).length === 0) {
      setTableMessage('Не найдены заказы в выбранном диапазоне');
    }
  }, [managersRenderData, isBuilt]);

  useEffect(() => {
    setTableMessage('');
    setIsBuilt(false);
    setClientOrders(null);
    setManagerClients(null);
  }, [abc]);

  return isInProgress ? (
    <Loader />
  ) : (
    <Grid container spacing={3}>
      <Grid item xs={12} height={'100%'}>
        {isDataReady ? (
          <ReportSettings
            onApply={onApply}
            onExport={onExport}
            onChange={onSettingsChange}
          />
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
        {isBuilt &&
          (managerClients ? (
            clientOrders ? (
              <TableOrders
                orders={clientOrders}
                onGoBack={handleGoBackToClients}
              />
            ) : (
              <TableClients
                onRowClick={handleSelectClient}
                onGoBack={handleGoBackToRoot}
                data={managerClients}
              />
            )
          ) : (
            <TableManagers onRowClick={handleSelectManager} />
          ))}
      </Grid>
    </Grid>
  );
};

export default AbcReport;
