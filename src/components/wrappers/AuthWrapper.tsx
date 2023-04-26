import { FC, PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

interface AuthWrapperProps {
  isAuthenticated: boolean;
}

const AuthWrapper: FC<PropsWithChildren<AuthWrapperProps>> = ({
  children,
  isAuthenticated,
}) => {
  if (!isAuthenticated) {
    return <Navigate to={'/'} replace />;
  }

  return <>{children}</>;
};

export default AuthWrapper;
