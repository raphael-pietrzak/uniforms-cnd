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
    if (!password) return { score: 0, text: '', color: 'gray' };
    
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[@$!%*?&]/.test(password)) score += 1;
    
    const strengthMap: Record<number, { text: string; color: string }> = {
      0: { text: 'Très faible', color: 'red' },
      1: { text: 'Faible', color: 'red' },
      2: { text: 'Moyen', color: 'orange' },
      3: { text: 'Bon', color: 'yellow' },
      4: { text: 'Fort', color: 'green' },
      5: { text: 'Excellent', color: 'green' }
    };
    
    return { 
      score,
      text: strengthMap[score].text,
      color: strengthMap[score].color
    };
  };
  
  const passwordStrength = getPasswordStrength();
  
  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Créer un compte</h1>
      
      {(formError || error) && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {formError || error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block mb-2 text-sm font-medium">
            Nom d'utilisateur
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Entre 3 et 30 caractères, lettres, chiffres, tirets et underscores uniquement.
          </p>
        </div>
        
        <div className="mb-4">
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
        
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2 text-sm font-medium">
            Mot de passe
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {password && (
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <div className="text-sm">Force du mot de passe:</div>
                <div className={`text-sm font-medium text-${passwordStrength.color}-600`}>
                  {passwordStrength.text}
                </div>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                <div 
                  className={`h-full rounded-full bg-${passwordStrength.color}-500`}
                  style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                ></div>
              </div>
              <ul className="mt-2 text-xs text-gray-500 list-disc pl-4">
                <li className={password.length >= 8 ? "text-green-500" : ""}>
                  Au moins 8 caractères
                </li>
                <li className={/[A-Z]/.test(password) ? "text-green-500" : ""}>
                  Au moins une lettre majuscule
                </li>
                <li className={/[a-z]/.test(password) ? "text-green-500" : ""}>
                  Au moins une lettre minuscule
                </li>
                <li className={/[0-9]/.test(password) ? "text-green-500" : ""}>
                  Au moins un chiffre
                </li>
                <li className={/[@$!%*?&]/.test(password) ? "text-green-500" : ""}>
                  Au moins un caractère spécial (@$!%*?&)
                </li>
              </ul>
            </div>
          )}
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
          />
          {confirmPassword && password !== confirmPassword && (
            <p className="mt-1 text-xs text-red-500">
              Les mots de passe ne correspondent pas
            </p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Inscription en cours...' : 'S\'inscrire'}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <p>
          Déjà un compte ?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
