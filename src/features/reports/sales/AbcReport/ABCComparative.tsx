import React, { FC, useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { selectOrdersData, selectSettings } from './abcSlice';
import {
  getComparativeReport,
  getManagersResultsComparative,
} from './abcReportFunctions';
import { setError } from '../../../../app/appReducer';
import Loader from '../../../../components/Loader';
import { ComparativeReportResult } from './types/ComparativeReportResult';
import { ManagersResultsComparative } from './types/ManagersResultsComparative';
import TableManagersComparative from './View/comparative/TableManagersComparative';
import { ClientWithABC } from '../../../../types/reports/sales/ClientWithABC';
import TableClientsComparative from './View/comparative/TableClientsComparative';

const AbcComparative: FC = () => {
  const orders = useAppSelector(selectOrdersData);
  const settings = useAppSelector(selectSettings);
  const dispatch = useAppDispatch();

  const [resultReport, setResultReport] = useState<ComparativeReportResult>({});
  const [managersResults, setManagersResults] =
    useState<ManagersResultsComparative>({});
  const [selectedManager, setSelectedManager] = useState<string | null>(null);
  const [managerClients, setManagerClients] = useState<ComparativeReportResult>(
    {}
  );
  const [inProgress, setInProgress] = useState<boolean>(false);

  const onSelectManager = useCallback((manager: string) => {
    console.log(manager);
    setSelectedManager(manager);
  }, []);

  useEffect(() => {
    setInProgress(true);

    const period: {
      periodLeft: { start: Date; end: Date };
      periodRight: { start: Date; end: Date };
    } = {
      periodLeft: {
        start: settings.comparative.periodLeft.start || new Date(),
        end: settings.comparative.periodLeft.end || new Date(),
      },
      periodRight: {
        start: settings.comparative.periodRight.start || new Date(),
        end: settings.comparative.periodRight.end || new Date(),
      },
    };

    getComparativeReport(orders, period, settings.weights)
      .then((res) => {
        setResultReport(res);
        setManagersResults(getManagersResultsComparative(res));
      })
      .catch((error) => dispatch(setError(error.message)))
      .finally(() => setInProgress(false));
  }, [
    dispatch,
    orders,
    settings.comparative.periodLeft.end,
    settings.comparative.periodLeft.start,
    settings.comparative.periodRight.end,
    settings.comparative.periodRight.start,
    settings.weights,
  ]);

  useEffect(() => {
    if (selectedManager) {
      const clients: ComparativeReportResult = Object.fromEntries(
        Object.entries(resultReport).reduce(
          (
            acc: [
              string,
              { left: ClientWithABC | null; right: ClientWithABC | null }
            ][],
            [clientName, clientData]
          ) => {
            const manager =
              clientData.left?.manager || clientData.right?.manager;

            if (manager === selectedManager) {
              acc.push([clientName, clientData]);
            }

            return acc;
          },
          []
        )
      );

      setManagerClients(clients);
    } else {
      setManagerClients({});
    }
  }, [resultReport, selectedManager]);

  useEffect(() => {
    console.log('selectedManager', selectedManager);
  }, [selectedManager]);

  useEffect(() => {
    console.log('managerClients', managerClients);
  }, [managerClients]);

  useEffect(() => {
    console.log('resultReport', resultReport);
  }, [resultReport]);

  if (inProgress) {
    return <Loader />;
  }

  return selectedManager ? (
    <TableClientsComparative
      manager={selectedManager}
      clients={managerClients}
      onGoBack={() => setSelectedManager('')}
    />
  ) : (
    <TableManagersComparative
      managers={managersResults}
      onRowClick={onSelectManager}
    />
  );
};

export default AbcComparative;
