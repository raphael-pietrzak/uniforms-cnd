import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Heart } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { products, addToCart } = useShop();
  
  const product = products.find((p) => p.id === productId);
  
  const [selectedSize, setSelectedSize] = useState<string>(product?.sizes[0] || '');
  const [selectedImage, setSelectedImage] = useState<number>(0);
  
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-xl text-gray-600">Produit non trouvé</p>
        <Button 
          onClick={() => navigate('/shop')} 
          variant="primary"
          className="mt-4"
        >
          Retour à la Boutique
        </Button>
      </div>
    );
  }
  
  const handleAddToCart = () => {
    if (selectedSize) {
      addToCart(product, selectedSize);
      // Show a toast or notification here
      navigate('/cart');
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-gray-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft size={18} className="mr-1" />
        Retour
      </button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <div className="bg-gray-100 rounded-lg overflow-hidden mb-4 h-96">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`bg-gray-100 rounded-lg overflow-hidden h-24 border-2 ${
                    selectedImage === index ? 'border-blue-600' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Details */}
        <div>
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center mb-4">
              <span className="text-blue-900 text-2xl font-bold mr-4">€{product.price.toFixed(2)}</span>
              <Badge variant={product.condition === 'new' ? 'primary' : 'warning'}>
                {product.condition === 'new' ? 'Neuf' : 'Occasion'}
              </Badge>
              {!product.inStock && <Badge variant="danger" className="ml-2">Rupture de Stock</Badge>}
            </div>
            <p className="text-gray-700 mb-6">{product.description}</p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Marque</h3>
            <p className="text-gray-700">{product.brand}</p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Sélectionner une Taille</h3>
            <div className="grid grid-cols-4 gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-2 px-4 border rounded-md text-center ${
                    selectedSize === size
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Button
              onClick={handleAddToCart}
              variant="primary"
              size="lg"
              fullWidth
              disabled={!product.inStock}
              className="flex items-center justify-center"
            >
              <ShoppingCart size={20} className="mr-2" />
              {product.inStock ? 'Ajouter au Panier' : 'Rupture de Stock'}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex items-center justify-center"
            >
              <Heart size={20} className="mr-2" />
              Sauvegarder
            </Button>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Détails</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li><span className="font-medium">Catégorie:</span> {product.category}</li>
              <li><span className="font-medium">Genre:</span> {product.gender}</li>
              <li><span className="font-medium">État:</span> {product.condition === 'new' ? 'Neuf' : 'Occasion'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;