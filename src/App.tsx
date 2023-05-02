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
import Footer from './components/Footer';
import Courses from './pages/Courses/Courses';

function App() {
  /* Undefined -> not loaded yet, Null -> logged out, User -> logged in */
  const { user, userLangIs } = useAuthUser();
  const [isLoaderWholePage] = useLoader();

  return (
    <BrowserRouter>
      {user === undefined || (user && !userLangIs) || isLoaderWholePage ? (
        <LoaderWholePage />
      ) : (
        <>
          <NavBar user={user} userLangIs={userLangIs} />
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/test" element={<Test />} />
            <Route path="*" element={<NotFound />} />
            {/* Authenticated routes */}
            <Route
              path="/secret"
              element={
                <AuthWrapper user={user} userLangIs={userLangIs}>
                  <Secret />
                </AuthWrapper>
              }
            />
            <Route
              path="/profile"
              element={
                <AuthWrapper user={user} userLangIs={userLangIs}>
                  {(user, userLangIs) => (
                    <Profile user={user} userLangIs={userLangIs} />
                  )}
                </AuthWrapper>
              }
            />
            <Route
              path="/courses"
              element={
                <AuthWrapper user={user} userLangIs={userLangIs}>
                  {(user, userLangIs) => (
                    <Courses user={user} userLangIs={userLangIs} />
                  )}
                </AuthWrapper>
              }
            />
          </Routes>

          <Footer />
        </>
      )}
    </BrowserRouter>
  );
}

export default App;
