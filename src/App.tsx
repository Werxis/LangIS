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

import { useAuthUser, useDocumentTitle, useLoader } from './hooks';
import Footer from './components/Footer';
import Courses from './pages/Courses/Courses';
import MyCourses from './pages/Courses/MyCourses';
import MyCourseDetail from './pages/Courses/CourseDetail';
import CourseChat from './pages/Courses/CourseChat';

function App() {
  /* Undefined -> not loaded yet, Null -> logged out, User -> logged in */
  const { user, userLangIs } = useAuthUser();
  const [isLoaderWholePage] = useLoader();
  useDocumentTitle('LangIS');

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
            <Route
              path="/courses/:courseUid"
              element={
                <AuthWrapper user={user} userLangIs={userLangIs}>
                  {(user, userLangIs) => (
                    <MyCourseDetail user={user} userLangIs={userLangIs} />
                  )}
                </AuthWrapper>
              }
            />
            <Route
              path="/courses/:courseUid/chat"
              element={
                <AuthWrapper user={user} userLangIs={userLangIs}>
                  {(user, userLangIs) => (
                    <CourseChat user={user} userLangIs={userLangIs} />
                  )}
                </AuthWrapper>
              }
            />
            <Route
              path="/my-courses"
              element={
                <AuthWrapper user={user} userLangIs={userLangIs}>
                  {(user, userLangIs) => (
                    <MyCourses user={user} userLangIs={userLangIs} />
                  )}
                </AuthWrapper>
              }
            />
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>

          <Footer />
        </>
      )}
    </BrowserRouter>
  );
}

export default App;
