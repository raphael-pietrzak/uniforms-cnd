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
    
  // Obtenir les tailles disponibles
  const availableSizes = product.inventory
    .filter(item => item.quantity > 0)
    .map(item => item.size);

  // Si aucune taille n'est disponible, afficher toutes les tailles
  const sizesToDisplay = availableSizes.length > 0 
    ? availableSizes 
    : product.inventory.map(item => item.size);
    
  return (
    <Card className="h-full rounded-2xl transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#133b63]/10">
      <Link to={`/product/${product.id}`}>
        <div className="relative h-64 overflow-hidden rounded-t-2xl">
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
          {product.condition === 'used' && (
            <div className="absolute top-2 left-2">
              <Badge variant="warning">Occasion</Badge>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="mb-1 truncate text-lg font-semibold text-slate-800">{product.name}</h3>
          <p className="mb-2 text-sm text-slate-500">{product.brand}</p>
          <div className="flex justify-between items-center">
            <span className="font-bold text-[#133b63]">{Number(product.price).toFixed(2)}&nbsp;€</span>
            <div className="flex flex-wrap gap-1 justify-end">
              {sizesToDisplay.slice(0, 3).map((size) => (
                <span key={size} className={`rounded-full px-2 py-1 text-xs font-semibold ${
                  availableSizes.includes(size) ? 'bg-[#1d7a72]/12 text-[#16645d]' : 'bg-slate-100 text-slate-700'
                }`}>
                  {size}
                </span>
              ))}
              {sizesToDisplay.length > 3 && (
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                  +{sizesToDisplay.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default ProductCard;