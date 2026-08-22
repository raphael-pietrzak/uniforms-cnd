import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');

  const { register, error, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validation
    if (!username || !email || !password || !confirmPassword) {
      setFormError('Tous les champs sont obligatoires');
      return;
    }

    if (username.length < 3 || username.length > 30) {
      setFormError('Le nom d\'utilisateur doit contenir entre 3 et 30 caractères');
      return;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      setFormError('Le nom d\'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores');
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

    try {
      await register(username, email, password);
      navigate('/'); // Redirection vers la page d'accueil après inscription
    } catch (err) {
      // L'erreur est déjà gérée dans le contexte
    }
  };

  const getPasswordStrength = () => {
    if (!password) return { score: 0, text: '', textClass: '', barClass: '' };

    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[@$!%*?&]/.test(password)) score += 1;

    const strengthMap: Record<number, { text: string; textClass: string; barClass: string }> = {
      0: { text: 'Très faible', textClass: 'text-red-600', barClass: 'bg-red-600' },
      1: { text: 'Faible', textClass: 'text-red-600', barClass: 'bg-red-600' },
      2: { text: 'Moyen', textClass: 'text-amber-600', barClass: 'bg-amber-600' },
      3: { text: 'Bon', textClass: 'text-amber-600', barClass: 'bg-amber-600' },
      4: { text: 'Fort', textClass: 'text-emerald-600', barClass: 'bg-emerald-600' },
      5: { text: 'Excellent', textClass: 'text-emerald-600', barClass: 'bg-emerald-600' }
    };

    return {
      score,
      ...strengthMap[score],
    };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="mx-auto my-12 max-w-md rounded-xl border border-line bg-surface p-8">
      <h1 className="mb-6 text-center text-2xl font-bold text-ink">Créer un compte</h1>

      {(formError || error) && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {formError || error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="mb-2 block text-sm font-medium text-ink">
            Nom d'utilisateur
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg border border-line px-3 py-2.5 text-ink focus:outline-none focus:ring-2 focus:ring-accent/25"
            required
          />
          <p className="mt-1 text-xs text-ink-muted">
            Entre 3 et 30 caractères, lettres, chiffres, tirets et underscores uniquement.
          </p>
        </div>

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
          {password && (
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <div className="text-sm text-ink-muted">Force du mot de passe:</div>
                <div className={`text-sm font-medium ${passwordStrength.textClass}`}>
                  {passwordStrength.text}
                </div>
              </div>
              <div className="mt-1 h-1.5 w-full rounded-full bg-canvas">
                <div
                  className={`h-full rounded-full ${passwordStrength.barClass}`}
                  style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                ></div>
              </div>
              <ul className="mt-2 list-disc pl-4 text-xs text-ink-muted">
                <li className={password.length >= 8 ? "text-emerald-600" : ""}>
                  Au moins 8 caractères
                </li>
                <li className={/[A-Z]/.test(password) ? "text-emerald-600" : ""}>
                  Au moins une lettre majuscule
                </li>
                <li className={/[a-z]/.test(password) ? "text-emerald-600" : ""}>
                  Au moins une lettre minuscule
                </li>
                <li className={/[0-9]/.test(password) ? "text-emerald-600" : ""}>
                  Au moins un chiffre
                </li>
                <li className={/[@$!%*?&]/.test(password) ? "text-emerald-600" : ""}>
                  Au moins un caractère spécial (@$!%*?&)
                </li>
              </ul>
            </div>
          )}
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
            className="w-full rounded-lg border border-line px-3 py-2.5 text-ink focus:outline-none focus:ring-2 focus:ring-accent/25"
            required
          />
          {confirmPassword && password !== confirmPassword && (
            <p className="mt-1 text-xs text-red-600">
              Les mots de passe ne correspondent pas
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent/40 disabled:opacity-50"
        >
          {loading ? 'Inscription en cours...' : 'S\'inscrire'}
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-ink-muted">
        <p>
          Déjà un compte ?{' '}
          <Link to="/login" className="text-accent hover:text-accent-hover">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
