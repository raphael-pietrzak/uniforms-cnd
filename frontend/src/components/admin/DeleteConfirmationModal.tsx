import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from '../ui/Button';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  isDeleting: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  isDeleting
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="mb-5 text-lg font-bold text-center text-gray-900">
            Confirmer la suppression
          </h3>
          <p className="mb-6 text-sm text-center text-gray-500">
            Êtes-vous sûr de vouloir supprimer <span className="font-medium text-gray-800">{itemName}</span> ? Cette action est irréversible.
          </p>
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isDeleting}
              className="w-full"
            >
              Annuler
            </Button>
            <Button
              variant="danger"
              onClick={onConfirm}
              disabled={isDeleting}
              className="w-full"
            >
              {isDeleting ? 'Suppression...' : 'Supprimer'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
