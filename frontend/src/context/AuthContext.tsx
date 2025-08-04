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

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Délai avant l'expiration du token pour le rafraîchir (14 minutes)
const REFRESH_TOKEN_THRESHOLD = 14 * 60 * 1000;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<Tokens | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Vérifier l'état de l'authentification au chargement
  useEffect(() => {
    const initAuth = async () => {
      const storedTokens = localStorage.getItem('tokens');
      const storedUser = localStorage.getItem('user');
      
      if (storedTokens && storedUser) {
        try {
          const parsedTokens = JSON.parse(storedTokens);
          const parsedUser = JSON.parse(storedUser);
          
          setTokens(parsedTokens);
          setUser(parsedUser);
          
          // Configurer le rafraîchissement automatique des tokens
          setupTokenRefresh(parsedTokens.refreshToken);
        } catch (err) {
          console.error('Erreur lors de la récupération des données d\'authentification:', err);
          localStorage.removeItem('tokens');
          localStorage.removeItem('user');
        }
      }
      
      setLoading(false);
    };
    
    initAuth();
  }, []);
  
  // Configurer le rafraîchissement automatique des tokens
  const setupTokenRefresh = (refreshToken: string) => {
    // Rafraîchir le token périodiquement avant qu'il n'expire
    const refreshTimer = setInterval(async () => {
      try {
        const response = await authApi.refreshToken(refreshToken);
        setTokens(response.tokens);
        localStorage.setItem('tokens', JSON.stringify(response.tokens));
        
        // Mettre à jour le timer avec le nouveau refresh token
        clearInterval(refreshTimer);
        setupTokenRefresh(response.tokens.refreshToken);
      } catch (err) {
        console.error('Erreur lors du rafraîchissement du token:', err);
        // En cas d'échec, déconnecter l'utilisateur
        handleLogout();
        clearInterval(refreshTimer);
      }
    }, REFRESH_TOKEN_THRESHOLD);
    
    // Nettoyer le timer lors du démontage du composant
    return () => clearInterval(refreshTimer);
  };
  
  // Gérer la connexion
  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authApi.login({ email, password });
      
      setUser(response.user);
      setTokens(response.tokens);
      
      // Stocker les données dans localStorage
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('tokens', JSON.stringify(response.tokens));
      
      // Configurer le rafraîchissement automatique des tokens
      setupTokenRefresh(response.tokens.refreshToken);
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
      setTokens(response.tokens);
      
      // Stocker les données dans localStorage
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('tokens', JSON.stringify(response.tokens));
      
      // Configurer le rafraîchissement automatique des tokens
      setupTokenRefresh(response.tokens.refreshToken);
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
      if (tokens?.refreshToken) {
        await authApi.logout(tokens.refreshToken);
      }
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err);
    } finally {
      // Supprimer les données d'authentification
      setUser(null);
      setTokens(null);
      localStorage.removeItem('user');
      localStorage.removeItem('tokens');
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
