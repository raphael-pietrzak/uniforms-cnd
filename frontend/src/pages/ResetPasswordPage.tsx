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
      <div className="mx-auto my-12 max-w-md rounded-xl border border-line bg-surface p-8">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-emerald-600">Mot de passe réinitialisé!</h1>
          <p className="mb-4 text-ink-muted">Votre mot de passe a été réinitialisé avec succès.</p>
          <p className="text-ink-muted">Vous allez être redirigé vers la page de connexion...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto my-12 max-w-md rounded-xl border border-line bg-surface p-8">
      <h1 className="mb-6 text-center text-2xl font-bold text-ink">Réinitialiser votre mot de passe</h1>

      {!token && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
          Lien de réinitialisation invalide. Veuillez demander un nouveau lien.
        </div>
      )}

      {(formError || error) && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {formError || error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-ink">
            Nouveau mot de passe
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-line px-3 py-2.5 text-ink focus:outline-none focus:ring-2 focus:ring-accent/25 disabled:opacity-50"
            required
            disabled={!token || loading}
          />
          <p className="mt-1 text-xs text-ink-muted">
            Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.
          </p>
        </div>

        <div className="mb-6">
          <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-ink">
            Confirmer le mot de passe
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-lg border border-line px-3 py-2.5 text-ink focus:outline-none focus:ring-2 focus:ring-accent/25 disabled:opacity-50"
            required
            disabled={!token || loading}
          />
        </div>

        <button
          type="submit"
          disabled={!token || loading}
          className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent/40 disabled:opacity-50"
        >
          {loading ? 'Chargement...' : 'Réinitialiser le mot de passe'}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
