import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
}

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Délai avant l'expiration du token pour le rafraîchir (14 minutes)
const REFRESH_TOKEN_THRESHOLD = 14 * 60 * 1000;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTimer, setRefreshTimer] = useState<NodeJS.Timeout | null>(null);
  
  // Configurer l'écouteur d'événements pour les tokens expirés
  useEffect(() => {
    const handleTokenExpired = () => {
      console.log('Token expiré, tentative de rafraîchissement...');
      refreshAccessToken();
    };
    
    window.addEventListener('auth:tokenExpired', handleTokenExpired);
    
    // Nettoyage
    return () => {
      window.removeEventListener('auth:tokenExpired', handleTokenExpired);
    };
  }, []);
  
  // Vérifier l'état de l'authentification au chargement
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Essayer de charger l'utilisateur depuis le serveur avec le cookie actuel
        const response = await authApi.refreshToken();
        setUser(response.user);
        
        // Configurer le rafraîchissement automatique des tokens
        setupTokenRefresh();
      } catch (err) {
        console.log('Non authentifié ou erreur de rafraîchissement de session');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
    
    return () => {
      if (refreshTimer) {
        clearInterval(refreshTimer);
      }
    };
  }, []);
  
  // Configurer le rafraîchissement automatique des tokens
  const setupTokenRefresh = () => {
    // Nettoyer le timer existant s'il y en a un
    if (refreshTimer) {
      clearInterval(refreshTimer);
    }
    
    // Rafraîchir le token périodiquement avant qu'il n'expire
    const timer = setInterval(refreshAccessToken, REFRESH_TOKEN_THRESHOLD);
    setRefreshTimer(timer);
  };
  
  // Rafraîchir le token d'accès
  const refreshAccessToken = async () => {
    try {
      // Appeler l'API de rafraîchissement (elle gère la mise à jour des cookies)
      await authApi.refreshToken();
    } catch (err) {
      console.error('Erreur lors du rafraîchissement du token:', err);
      // En cas d'échec, déconnecter l'utilisateur
      setUser(null);
      if (refreshTimer) {
        clearInterval(refreshTimer);
        setRefreshTimer(null);
      }
    }
  };
  
  // Gérer la connexion
  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authApi.login({ email, password });
      setUser(response.user);
      
      // Configurer le rafraîchissement automatique des tokens
      setupTokenRefresh();
    } catch (err) {
      console.error('Erreur de connexion:', err);
      setError(err instanceof Error ? err.message : 'Erreur de connexion. Veuillez réessayer.');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Gérer l'inscription
  const handleRegister = async (username: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authApi.register({ username, email, password });
      setUser(response.user);
      
      // Configurer le rafraîchissement automatique des tokens
      setupTokenRefresh();
    } catch (err) {
      console.error('Erreur d\'inscription:', err);
      setError(err instanceof Error ? err.message : 'Erreur d\'inscription. Veuillez réessayer.');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Gérer la déconnexion
  const handleLogout = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await authApi.logout();
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err);
    } finally {
      // Nettoyer l'état local
      setUser(null);
      if (refreshTimer) {
        clearInterval(refreshTimer);
        setRefreshTimer(null);
      }
      setLoading(false);
    }
  };
  
  // Gérer la réinitialisation de mot de passe
  const handleForgotPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await authApi.forgotPassword(email);
    } catch (err) {
      console.error('Erreur lors de la demande de réinitialisation:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la demande. Veuillez réessayer.');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Gérer la réinitialisation de mot de passe
  const handleResetPassword = async (token: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await authApi.resetPassword(token, password);
    } catch (err) {
      console.error('Erreur lors de la réinitialisation du mot de passe:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la réinitialisation. Veuillez réessayer.');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Effacer les erreurs
  const clearError = () => {
    setError(null);
  };
  
  const authContextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    clearError,
    forgotPassword: handleForgotPassword,
    resetPassword: handleResetPassword
  };
  
  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};
