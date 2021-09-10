import React, { createContext, Dispatch, FC, useReducer } from 'react';
import './App.css';
import { appReducer } from '../../state/reducer';
import { AppState } from '../../types/AppState';
import { Action } from '../../types/Action';

const initState: AppState = {
  file: null,
  inProgress: false,
  resultParse: [],
};

export const AppStateContext = createContext<AppState>(initState);
export const AppDispatchContext = createContext<Dispatch<Action>>(() => null);

const App: FC = () => {
  const [state, dispatch] = useReducer(appReducer, initState);

  return (
    <div className="App">
      <AppDispatchContext.Provider value={dispatch}>
        <AppStateContext.Provider value={state}>
          Hello parser
        </AppStateContext.Provider>
      </AppDispatchContext.Provider>
    </div>
  );
};

export default App;
