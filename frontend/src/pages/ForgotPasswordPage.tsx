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
      <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-green-600">Email envoyé!</h1>
          <p className="mb-4">
            Si un compte existe avec cette adresse email, vous recevrez un lien pour réinitialiser votre mot de passe.
          </p>
          <p className="mb-4">
            Veuillez vérifier votre boîte de réception et suivre les instructions.
          </p>
          <Link to="/login" className="text-blue-600 hover:underline">
            Retour à la page de connexion
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Mot de passe oublié</h1>
      
      <p className="mb-4 text-gray-600">
        Entrez votre adresse email ci-dessous et nous vous enverrons un lien pour réinitialiser votre mot de passe.
      </p>
      
      {(formError || error) && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {formError || error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="email" className="block mb-2 text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <Link to="/login" className="text-blue-600 hover:underline">
          Retour à la page de connexion
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;