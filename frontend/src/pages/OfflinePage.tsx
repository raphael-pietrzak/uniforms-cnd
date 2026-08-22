import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { WifiOff } from 'lucide-react';
import Button from '../components/ui/Button';

const OfflinePage: React.FC = () => {
  const { isOnline } = useAuth();
  const navigate = useNavigate();

  // Si l'utilisateur est de nouveau en ligne, le rediriger vers la page d'accueil
  React.useEffect(() => {
    if (isOnline) {
      navigate('/');
    }
  }, [isOnline, navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-md rounded-xl border border-line bg-surface p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-50 p-4">
            <WifiOff size={40} className="text-red-600" />
          </div>
        </div>

        <h1 className="mb-4 text-2xl font-bold text-ink">Hors Connexion</h1>

        <p className="mb-2 text-ink-muted">
          Vous êtes actuellement hors ligne.
        </p>

        <p className="mb-6 text-ink-muted">
          Veuillez vérifier votre connexion internet et réessayer.
        </p>

        <Button
          onClick={() => window.location.reload()}
          fullWidth
        >
          Réessayer
        </Button>
      </div>
    </div>
  );
};

export default OfflinePage;