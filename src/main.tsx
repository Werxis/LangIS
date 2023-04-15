import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import 'sanitize.css';

import { RecoilRoot } from 'recoil';

import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RecoilRoot>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </RecoilRoot>
  </React.StrictMode>
);
