import { JSX } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem('token'); 
  
  console.log('ProtectedRoute - Token encontrado:', !!token);
  console.log('ProtectedRoute - Token value:', token);

  if (!token) {
    console.log('ProtectedRoute - No hay token, redirigiendo a /');
    return <Navigate to="/" replace />;
  }

  console.log('ProtectedRoute - Token válido, permitiendo acceso');
  return children;
}