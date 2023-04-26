import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthWrapper from './components/wrappers/AuthWrapper';

import 'sanitize.css';

import Home from './pages/Home/Home';
import Test from './pages/Test';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import Secret from './pages/Secret';

import LoaderWholePage from './components/LoaderWholePage';
import NavBar from './components/NavBar';

import { useAuthUser, useLoader } from './hooks';

function App() {
  /* Undefined -> not loaded yet, Null -> logged out, User -> logged in */
  const { user } = useAuthUser();
  const [isLoaderWholePage] = useLoader();
  const isAuthenticated = user !== null && user !== undefined;
  console.log('user: ', user);

  return (
    <BrowserRouter>
      {user === undefined || isLoaderWholePage ? (
        <LoaderWholePage />
      ) : (
        <>
          <NavBar user={user} />
          <Routes>
            <Route path="/" element={<Home user={user} />} />
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
            <Route
              path="/profile"
              element={
                <AuthWrapper isAuthenticated={isAuthenticated}>
                  <Profile />
                </AuthWrapper>
              }
            />
          </Routes>
        </>
      )}
    </BrowserRouter>
  );
}

export default App;
