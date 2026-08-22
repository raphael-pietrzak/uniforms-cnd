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
    <Card className="h-full transition-colors hover:border-ink/20">
      <Link to={`/product/${product.id}`}>
        <div className="relative h-56 overflow-hidden bg-canvas">
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
          {product.condition === 'used' && (
            <div className="absolute left-2 top-2">
              <Badge variant="warning">Occasion</Badge>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="mb-1 truncate text-sm font-semibold text-ink">{product.name}</h3>
          <p className="mb-3 text-sm text-ink-muted">{product.brand}</p>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-ink">{Number(product.price).toFixed(2)}&nbsp;€</span>
            <div className="flex flex-wrap justify-end gap-1">
              {sizesToDisplay.slice(0, 3).map((size) => (
                <span key={size} className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                  availableSizes.includes(size) ? 'bg-canvas text-ink-muted' : 'bg-canvas text-ink-faint'
                }`}>
                  {size}
                </span>
              ))}
              {sizesToDisplay.length > 3 && (
                <span className="rounded-md bg-canvas px-2 py-0.5 text-xs font-medium text-ink-muted">
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
