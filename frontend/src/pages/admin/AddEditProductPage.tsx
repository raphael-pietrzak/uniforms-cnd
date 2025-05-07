import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import ProductForm from '../../components/admin/ProductForm';
import { Product } from '../../types';

const AddEditProductPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { products, addProduct, updateProduct } = useShop();
  
  const isEditMode = productId !== undefined;
  const product = isEditMode 
    ? products.find(p => p.id === productId) 
    : undefined;
  
  if (isEditMode && !product) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-xl text-gray-600">Product not found</p>
        <button 
          onClick={() => navigate('/admin/products')} 
          className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={18} className="mr-1" />
          Back to Products
        </button>
      </div>
    );
  }
  
  const handleSubmit = (productData: Omit<Product, 'id'>) => {
    if (isEditMode && product) {
      updateProduct({ ...productData, id: product.id });
    } else {
      addProduct(productData);
    }
    navigate('/admin/products');
  };
  
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button 
        onClick={() => navigate('/admin/products')} 
        className="flex items-center text-gray-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft size={18} className="mr-1" />
        Back to Products
      </button>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {isEditMode ? 'Edit Product' : 'Add New Product'}
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