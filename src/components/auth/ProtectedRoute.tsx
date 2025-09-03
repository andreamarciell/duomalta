import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useIsAuthenticated } from '@/store/useUser';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  redirectTo = '/onboarding' 
}: ProtectedRouteProps) {
  const isAuthenticated = useIsAuthenticated();
  const location = useLocation();

  // Se non richiede autenticazione, mostra sempre
  if (!requireAuth) {
    return <>{children}</>;
  }

  // Se richiede autenticazione ma l'utente non è autenticato
  if (!isAuthenticated) {
    // Salva la posizione corrente per il redirect dopo il login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Utente autenticato, mostra il contenuto
  return <>{children}</>;
}

// Hook per ottenere la posizione di redirect
export function useRedirectLocation() {
  const location = useLocation();
  return location.state?.from?.pathname || '/app/dashboard';
}
