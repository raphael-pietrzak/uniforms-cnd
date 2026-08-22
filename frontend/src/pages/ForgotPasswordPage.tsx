import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { forgotPassword, error, loading, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    clearError();

    // Validation
    if (!email) {
      setFormError('Veuillez entrer votre adresse email');
      return;
    }

    try {
      await forgotPassword(email);
      setIsSubmitted(true);
    } catch (err) {
      // L'erreur est déjà gérée dans le contexte
    }
  };

  if (isSubmitted) {
    return (
      <div className="mx-auto my-12 max-w-md rounded-xl border border-line bg-surface p-8">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-emerald-600">Email envoyé!</h1>
          <p className="mb-4 text-ink-muted">
            Si un compte existe avec cette adresse email, vous recevrez un lien pour réinitialiser votre mot de passe.
          </p>
          <p className="mb-4 text-ink-muted">
            Veuillez vérifier votre boîte de réception et suivre les instructions.
          </p>
          <Link to="/login" className="text-sm text-accent hover:text-accent-hover">
            Retour à la page de connexion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto my-12 max-w-md rounded-xl border border-line bg-surface p-8">
      <h1 className="mb-6 text-center text-2xl font-bold text-ink">Mot de passe oublié</h1>

      <p className="mb-4 text-ink-muted">
        Entrez votre adresse email ci-dessous et nous vous enverrons un lien pour réinitialiser votre mot de passe.
      </p>

      {(formError || error) && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {formError || error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
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

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent/40 disabled:opacity-50"
        >
          {loading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
        </button>
      </form>

      <div className="mt-4 text-center">
        <Link to="/login" className="text-sm text-accent hover:text-accent-hover">
          Retour à la page de connexion
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
