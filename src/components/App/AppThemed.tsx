import React from 'react';
import { Themes } from '../../app/theme';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import App from './App';
import { useAppSelector } from '../../app/hooks';
import { selectCurrentTheme } from '../../app/appReducer';

const AppThemed = (): JSX.Element => {
  const currentTheme = useAppSelector(selectCurrentTheme);

  return (
    <ThemeProvider theme={Themes[currentTheme]}>
      <StyledEngineProvider injectFirst>
        <App />
      </StyledEngineProvider>
    </ThemeProvider>
  );
};

export default AppThemed;
