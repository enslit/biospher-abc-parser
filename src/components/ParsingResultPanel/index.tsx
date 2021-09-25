import React, { FC, useContext } from 'react';
import { Paper } from '@mui/material';
import { AppStateContext } from '../App/App';

// const useStyles = makeStyles((theme) => ({
//   paper: {
//     padding: theme.spacing(3),
//   },
// }));

const ParsingResultPanel: FC = () => {
  // const styles = useStyles();

  const { resultParse } = useContext(AppStateContext);

  return <Paper>Количество строк: {resultParse.meta.rows}</Paper>;
};

export default ParsingResultPanel;
