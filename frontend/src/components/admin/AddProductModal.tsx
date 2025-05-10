import React from 'react';
import { X } from 'lucide-react';
import { Product } from '../../types';
import ProductForm from './ProductForm';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: Product) => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onAdd }) => {
  if (!isOpen) return null;

  const handleSubmit = async (productData: Omit<Product, 'id'>) => {
    try {
      // Dans une application réelle, nous enverrions les données au serveur
      // et recevrions le nouveau produit avec un ID
      const newProduct = { ...productData, id: Date.now().toString() } as Product;
      onAdd(newProduct);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la création du produit:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Ajouter un nouveau produit</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6">
          <ProductForm
            onSubmit={handleSubmit}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
