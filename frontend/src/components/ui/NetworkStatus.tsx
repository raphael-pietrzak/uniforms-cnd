import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NetworkStatus: React.FC = () => {
  const { isOnline } = useAuth();

  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm ${
      isOnline 
        ? 'text-green-700 bg-green-50' 
        : 'text-red-700 bg-red-50'
    }`}>
      {isOnline ? (
        <>
          <Wifi size={16} />
          <span className="hidden sm:inline">En ligne</span>
        </>
      ) : (
        <>
          <WifiOff size={16} />
          <span className="hidden sm:inline">Hors ligne</span>
        </>
      )}
    </div>
  );
};

export default NetworkStatus;