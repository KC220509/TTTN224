// src/routes/PrivateRoute.tsx
import React, { JSX } from 'react';
import { Navigate } from 'react-router-dom';

interface Props {
  children: JSX.Element;
  allowedRoles?: string[]; // để sau này giới hạn theo role nếu muốn
}

const PrivateRoute: React.FC<Props> = ({ children, allowedRoles }) => {
  const role_id = localStorage.getItem('role_id');

  if (!role_id) {
    return <Navigate to="/" replace />;
  }
  // Nếu có giới hạn quyền mà người dùng không nằm trong danh sách
  if (allowedRoles && !allowedRoles.includes(role_id)) {
    // window.location.href = '/?error=unauthorized';
    return <Navigate to="/?error=unauthorized" replace />;
  }

  return children;
};

export default PrivateRoute;
