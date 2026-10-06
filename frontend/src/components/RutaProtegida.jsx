import React from 'react';
import { Navigate } from 'react-router-dom';

export default function RutaProtegida({ children, rolesPermitidos }) {
  const token = localStorage.getItem('access_token');
  const rolUsuario = localStorage.getItem('user_role');

  // Función matemática para abrir el token y revisar su reloj interno
  const isTokenExpired = (token) => {
    try {
      // 1. Cortamos el token y sacamos la parte del medio (Payload)
      const payloadBase64 = token.split('.')[1];
      
      // 2. Lo decodificamos de Base64 a texto normal
      const decodedJson = atob(payloadBase64);
      const decoded = JSON.parse(decodedJson);
      
      // 3. Comparamos la fecha de expiración con la fecha actual del sistema
      const currentTime = Date.now() / 1000; 
      
      return decoded.exp < currentTime;
    } catch (error) {
      // Si alguien intentó alterar el token a mano, fallará al leerse y lo marcamos como expirado
      return true; 
    }
  };

  // Validación Nivel 1: Presencia y Vigencia del Token
  if (!token || isTokenExpired(token)) {
    // Si el token caducó, destruimos la sesión envenenada para no dejar basura en el navegador
    if (token) localStorage.clear(); 
    return <Navigate to="/login" replace />;
  }

  // Validación Nivel 2: Control de Acceso por Rol (RBAC)
  if (rolesPermitidos && !rolesPermitidos.includes(rolUsuario)) {
    if (rolUsuario === 'ADMIN') return <Navigate to="/admin-panel" replace />;
    if (rolUsuario === 'REPARTIDOR') return <Navigate to="/delivery" replace />;
    return <Navigate to="/menu" replace />;
  }

  // Si pasa las dos aduanas, le mostramos la pantalla
  return children;
}