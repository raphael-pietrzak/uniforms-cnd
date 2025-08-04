import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading, user } = useAuth();
  const location = useLocation();

  // Si l'authentification est en cours de chargement, on affiche rien (ou un spinner)
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas authentifié, on le redirige vers la page de login
  // en préservant l'URL qu'il essayait d'atteindre pour le rediriger après connexion
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si la route nécessite des droits admin et que l'utilisateur n'est pas admin
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Si tout est bon, on affiche le contenu de la route
  return <Outlet />;
};

export default ProtectedRoute;