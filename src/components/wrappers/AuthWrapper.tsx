import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { User } from 'firebase/auth';
import { LangIsUserWithId } from '../../firebase/firestore';

type AuthWrapperProps = {
  user: User | null;
  userLangIs: LangIsUserWithId | null;
  children:
    | ReactNode
    | ((user: User, userLangIs: LangIsUserWithId) => JSX.Element);
};

const AuthWrapper = ({ children, user, userLangIs }: AuthWrapperProps) => {
  if (user === null || userLangIs === null) {
    return <Navigate to={'/'} replace />;
  }

  return (
    <>{children instanceof Function ? children(user, userLangIs) : children}</>
  );
};

export default AuthWrapper;
