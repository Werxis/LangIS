import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { User } from 'firebase/auth';

type AuthWrapperProps = {
  user: User | null;
  children: ReactNode | ((user: User) => JSX.Element);
};

const AuthWrapper = ({ children, user }: AuthWrapperProps) => {
  if (user === null) {
    return <Navigate to={'/'} replace />;
  }

  return <>{children instanceof Function ? children(user) : children}</>;
};

export default AuthWrapper;
