// src/routes/PrivateRoute.tsx
import React, { JSX } from 'react';
import { Navigate } from 'react-router-dom';

interface Props {
  children: JSX.Element;
  allowedRoles?: string[]; // để sau này giới hạn theo role nếu muốn
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
  const user_id = localStorage.getItem('user_id');

  if (!user_id) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
