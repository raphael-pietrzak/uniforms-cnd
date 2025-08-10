import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // S'assurer que l'image existe, sinon utiliser un placeholder
  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0] 
    : 'https://placehold.co/600x400?text=Image+placeholder';
    
  return (
    <Card className="h-full transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <Link to={`/product/${product.id}`}>
        <div className="relative h-64 overflow-hidden">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.condition === 'used' && (
            <div className="absolute top-2 left-2">
              <Badge variant="warning">Occasion</Badge>
            </div>
          )}
          {!product.inventory || product.inventory.length === 0 || !product.inventory.some(item => item.quantity > 0) ? (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                Indisponible
              </span>
            </div>
          ) : (
            <div className="absolute top-2 right-2">
              <Badge variant="success">En Stock</Badge>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">{product.name}</h3>
          <p className="text-gray-500 text-sm mb-2">{product.brand}</p>
          <div className="flex justify-between items-center">
            <span className="text-blue-900 font-bold">{Number(product.price).toFixed(2)}&nbsp;€</span>
            <div className="flex space-x-1">
              {product.sizes.map((size) => (
                <span key={size} className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {size}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default ProductCard;