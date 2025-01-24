import React, { JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/redux.hook';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
