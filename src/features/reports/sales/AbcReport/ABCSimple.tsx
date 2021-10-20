import React, { FC, useEffect, useState } from 'react';
import TableOrders from './View/simple/TableOrders';
import TableClients from './View/simple/TableClients';
import TableManagers from './View/simple/TableManagers';
import { TManagerResults } from './types/TManagerResults';
import { ClientWithABC } from '../../../../types/reports/sales/ClientWithABC';
import {
  calculateSimpleAbc,
  getManagersResults,
  getPeriodSimpleReport,
  TSaleTableRowWithoutClient,
} from './abcReportFunctions';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { selectOrdersData, selectSettings } from './abcSlice';
import { setError } from '../../../../app/appReducer';
import Loader from '../../../../components/Loader';

const AbcSimple: FC = () => {
  const orders = useAppSelector(selectOrdersData);
  const settings = useAppSelector(selectSettings);
  const dispatch = useAppDispatch();

  const [reportResult, setReportResult] = useState<
    Record<string, ClientWithABC>
  >({});
  const [managers, setManagers] = useState<Record<string, TManagerResults>>({});
  const [selectedManager, setSelectedManager] = useState<string>('');
  const [managerClients, setManagerClients] = useState<Record<
    string,
    ClientWithABC
  > | null>(null);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [clientOrders, setClientOrders] = useState<
    TSaleTableRowWithoutClient[] | null
  >(null);
  const [inProgress, setInProgress] = useState<boolean>(false);

  const handleSelectManager = (manager: string) => {
    setInProgress(true);
    setSelectedManager(manager);

    new Promise<Record<string, ClientWithABC>>((resolve) => {
      const clients = Object.fromEntries(
        Object.entries(reportResult).filter(([, data]) => {
          return data.manager === manager;
        })
      );

      resolve(clients);
    })
      .then((clients) => {
        setManagerClients(clients);
      })
      .catch((error) => dispatch(setError(error.message)))
      .finally(() => {
        setInProgress(false);
      });
  };

  const handleSelectClient = (client: string) => {
    setInProgress(true);

    if (managerClients) {
      setSelectedClient(client);
      setClientOrders(managerClients[client].orders);
    }

    setInProgress(false);
  };

  const handleGoBackToRoot = () => {
    setSelectedManager('');
    setManagerClients(null);
  };

  const handleGoBackToClients = () => {
    setSelectedClient('');
    setClientOrders(null);
  };

  useEffect(() => {
    setInProgress(true);

    const period = getPeriodSimpleReport(settings.simple);
    calculateSimpleAbc(orders, period, settings.weights)
      .then((res) => {
        setReportResult(res);
        setManagers(getManagersResults(res));
      })
      .catch((error) => dispatch(setError(error.message)))
      .finally(() => setInProgress(false));
  }, [dispatch, orders, settings.simple, settings.weights]);

  if (inProgress) {
    return <Loader />;
  }

  return managerClients ? (
    clientOrders ? (
      <TableOrders
        client={selectedClient}
        orders={clientOrders}
        onGoBack={handleGoBackToClients}
      />
    ) : (
      <TableClients
        manager={selectedManager}
        onRowClick={handleSelectClient}
        onGoBack={handleGoBackToRoot}
        data={managerClients}
      />
    )
  ) : (
    <TableManagers managers={managers} onRowClick={handleSelectManager} />
  );
};

export default AbcSimple;
