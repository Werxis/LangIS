import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { RecoilRoot } from 'recoil';
import { ThemeProvider, CssBaseline } from '@mui/material';

import DialogWrapper from './components/wrappers/DialogWrapper';

import theme from './theme';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RecoilRoot>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <DialogWrapper />
        <App />
      </ThemeProvider>
    </RecoilRoot>
  </React.StrictMode>
);
