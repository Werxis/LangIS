import { RecoilRoot } from 'recoil';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import AuthWrapper from './components/wrappers/AuthWrapper';
import DialogWrapper from './components/wrappers/DialogWrapper';

import 'sanitize.css';
import theme from './theme';

import Home from './pages/Home';
import Test from './pages/Test';
import NotFound from './pages/NotFound';
import Secret from './pages/Secret';

import LoaderWholePage from './components/LoaderWholePage';

import { useAuthUser } from './hooks';

function App() {
  /* Undefined -> not loaded yet, Null -> logged out, User -> logged in */
  const user = useAuthUser();
  const isAuthenticated = user !== null && user !== undefined;
  console.log('user: ', user);

  return (
    <RecoilRoot>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <DialogWrapper />
        <BrowserRouter>
          {user === undefined ? (
            <LoaderWholePage />
          ) : (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/test" element={<Test />} />
              <Route path="*" element={<NotFound />} />
              {/* Authenticated routes */}
              <Route
                path="/secret"
                element={
                  <AuthWrapper isAuthenticated={isAuthenticated}>
                    <Secret />
                  </AuthWrapper>
                }
              />
            </Routes>
          )}
        </BrowserRouter>
      </ThemeProvider>
    </RecoilRoot>
  );
}

export default App;
