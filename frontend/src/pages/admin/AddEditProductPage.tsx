import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import ProductForm from '../../components/admin/ProductForm';
import { Product } from '../../types';
import { productsApi } from '../../services/api';

const AddEditProductPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addProduct, updateProduct } = useShop();
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const isEditMode = productId !== undefined;
  
  useEffect(() => {
    if (isEditMode && productId) {
      setLoading(true);
      productsApi.getById(productId)
        .then(data => {
          setProduct(data);
          setError(null);
        })
        .catch(err => {
          console.error('Erreur lors de la récupération du produit:', err);
          setError('Impossible de charger les détails du produit');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [productId, isEditMode]);
  
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-xl text-gray-600">Chargement...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-xl text-red-600">{error}</p>
        <button 
          onClick={() => navigate('/admin/products')} 
          className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={18} className="mr-1" />
          Retour aux Produits
        </button>
      </div>
    );
  }
  
  if (isEditMode && !product) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-xl text-gray-600">Produit non trouvé</p>
        <button 
          onClick={() => navigate('/admin/products')} 
          className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={18} className="mr-1" />
          Retour aux Produits
        </button>
      </div>
    );
  }
  
  const handleSubmit = (productData: Omit<Product, 'id'>) => {
    if (isEditMode && product) {
      updateProduct({ ...productData, id: product.id });
    } else {
      addProduct({ ...productData, id: Date.now().toString() });
    }
    navigate('/admin/products');
  };
  
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col mb-6">
        <button 
          onClick={() => navigate('/admin/products')} 
          className="flex items-center text-gray-600 hover:text-blue-800 mb-2"
        >
          <ArrowLeft size={18} className="mr-1" />
          Retour aux Produits
        </button>
        <button 
          onClick={() => navigate('/admin')} 
          className="flex items-center text-gray-600 hover:text-blue-800"
        >
          <ArrowLeft size={18} className="mr-1" />
          Retour au Tableau de Bord
        </button>
      </div>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {isEditMode ? 'Modifier le Produit' : 'Ajouter un Nouveau Produit'}
      </h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <ProductForm
            initialValues={product}
            onSubmit={handleSubmit}
            onCancel={() => navigate('/admin/products')}
          />
        </div>
      </div>
    </div>
  );
};

export default AddEditProductPage;