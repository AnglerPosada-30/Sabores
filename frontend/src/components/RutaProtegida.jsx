import React from 'react';
import { Navigate } from 'react-router-dom';

export default function RutaProtegida({ children, rolesPermitidos }) {
  const token = localStorage.getItem('access_token');
  const rolUsuario = localStorage.getItem('user_role');

  // Si no hay token, lo mandamos a login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si tiene token, pero su rol no está en la lista permitida de esa ruta
  if (rolesPermitidos && !rolesPermitidos.includes(rolUsuario)) {
    // Redirección de salvavidas dependiendo de quién es realmente
    if (rolUsuario === 'ADMIN') return <Navigate to="/admin-panel" replace />;
    if (rolUsuario === 'REPARTIDOR') return <Navigate to="/delivery" replace />;
    return <Navigate to="/menu" replace />;
  }

  // Si todo está bien, entra a la página
  return children;
}