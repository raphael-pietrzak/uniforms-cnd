import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const [formError, setFormError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { resetPassword, error, loading, clearError } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    // Récupérer le token depuis l'URL
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
    
    // Nettoyer les erreurs précédentes
    clearError();
  }, [searchParams, clearError]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    // Validation
    if (!password || !confirmPassword) {
      setFormError('Tous les champs sont obligatoires');
      return;
    }
    
    if (password !== confirmPassword) {
      setFormError('Les mots de passe ne correspondent pas');
      return;
    }
    
    if (password.length < 8) {
      setFormError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }
    
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password)) {
      setFormError('Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial');
      return;
    }
    
    if (!token) {
      setFormError('Token de réinitialisation manquant');
      return;
    }
    
    try {
      await resetPassword(token, password);
      setIsSuccess(true);
      
      // Redirection vers la page de connexion après quelques secondes
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      // L'erreur est déjà gérée dans le contexte
    }
  };
  
  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-green-600">Mot de passe réinitialisé!</h1>
          <p className="mb-4">Votre mot de passe a été réinitialisé avec succès.</p>
          <p>Vous allez être redirigé vers la page de connexion...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Réinitialiser votre mot de passe</h1>
      
      {!token && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-700 rounded">
          Lien de réinitialisation invalide. Veuillez demander un nouveau lien.
        </div>
      )}
      
      {(formError || error) && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {formError || error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2 text-sm font-medium">
            Nouveau mot de passe
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={!token || loading}
          />
          <p className="mt-1 text-xs text-gray-500">
            Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.
          </p>
        </div>
        
        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium">
            Confirmer le mot de passe
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={!token || loading}
          />
        </div>
        
        <button
          type="submit"
          disabled={!token || loading}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Chargement...' : 'Réinitialiser le mot de passe'}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;