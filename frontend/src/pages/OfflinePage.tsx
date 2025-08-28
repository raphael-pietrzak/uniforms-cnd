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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 p-4 rounded-full">
            <WifiOff size={48} className="text-red-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-4"> Hors Connexion</h1>
        
        <p className="text-gray-600 mb-6">
          Vous êtes actuellement hors ligne. 
        </p>
        
        <p className="text-gray-600 mb-6">
          Veuillez vérifier votre connexion internet et réessayer.
        </p>
        
        <div className="space-y-4">
          <Button 
            onClick={() => window.location.reload()} 
            className="w-full"
          >
            Réessayer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OfflinePage;