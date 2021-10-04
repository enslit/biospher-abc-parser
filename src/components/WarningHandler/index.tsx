import React from 'react';
import { Alert, Snackbar } from '@mui/material';
import { clearWarning, selectWarningMessage } from '../../app/appReducer';
import { useAppDispatch, useAppSelector } from '../../app/hooks';

const WarningHandler = (): JSX.Element => {
  const warningMessage = useAppSelector(selectWarningMessage);
  const appDispatch = useAppDispatch();

  const handleCloseSnackbar = () => {
    appDispatch(clearWarning());
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      key={'top-center'}
      open={!!warningMessage}
      autoHideDuration={6000}
      onClose={handleCloseSnackbar}
    >
      <Alert
        onClose={handleCloseSnackbar}
        severity="warning"
        sx={{ width: '100%' }}
      >
        {warningMessage}
      </Alert>
    </Snackbar>
  );
};

export default WarningHandler;
