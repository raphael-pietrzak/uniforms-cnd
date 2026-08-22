import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Interface pour le state de location
interface LocationState {
  from?: {
    pathname: string;
  };
}

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  const { login, error, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Récupérer l'URL de redirection depuis le state
  const from = (location.state as LocationState)?.from?.pathname || '/admin';

  // Rediriger l'utilisateur s'il est déjà connecté
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from);
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validation simple
    if (!email || !password) {
      setFormError('Tous les champs sont obligatoires');
      return;
    }

    try {
      await login(email, password);
      // La redirection se fera automatiquement via l'effet useEffect ci-dessus
    } catch (err) {
      // L'erreur est déjà gérée dans le contexte
    }
  };

  return (
    <div className="mx-auto my-12 max-w-md rounded-xl border border-line bg-surface p-8">
      <h1 className="mb-6 text-center text-2xl font-bold text-ink">Connexion</h1>

      {(formError || error) && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {formError || error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-ink">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-line px-3 py-2.5 text-ink focus:outline-none focus:ring-2 focus:ring-accent/25"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-ink">
            Mot de passe
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-line px-3 py-2.5 text-ink focus:outline-none focus:ring-2 focus:ring-accent/25"
            required
          />
          <div className="mt-1 text-right">
            <Link to="/forgot-password" className="text-sm text-accent hover:text-accent-hover">
              Mot de passe oublié?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent/40 disabled:opacity-50"
        >
          {loading ? 'Connexion en cours...' : 'Se connecter'}
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-ink-muted">
        <p>
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-accent hover:text-accent-hover">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
