import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../utils/user';

interface Props {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<Props> = ({ children, adminOnly = false }) => {
  const user = getCurrentUser();
  const isLoggedIn = user && user.email;

  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (adminOnly && user.is_staff !== 1) return <Navigate to="/mesaje" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
