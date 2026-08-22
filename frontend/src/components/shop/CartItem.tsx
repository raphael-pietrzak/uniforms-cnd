import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '../../types';
import { useShop } from '../../context/ShopContext';
import { getFullImageUrl } from '../../services/api';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useShop();
  const { product, quantity, selectedSize } = item;

  // S'assurer que l'image existe, sinon utiliser un placeholder
  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0] 
    : 'https://placehold.co/600x400?text=Image+placeholder';

  const handleIncrease = () => {
    updateQuantity(product.id, selectedSize, quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      updateQuantity(product.id, selectedSize, quantity - 1);
    }
  };

  const handleRemove = () => {
    removeFromCart(product.id, selectedSize);
  };

  return (
    <div className="flex flex-col items-start border-b border-line py-4 sm:flex-row sm:items-center">
      <div className="mb-4 mr-0 h-24 w-full flex-shrink-0 overflow-hidden rounded-lg bg-canvas sm:mb-0 sm:mr-4 sm:w-24">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1">
        <h3 className="text-base font-medium text-ink">{product.name}</h3>
        <p className="text-sm text-ink-muted">Taille: {selectedSize}</p>
        <p className="text-sm text-ink-muted">
          Condition: <span className={product.condition === 'new' ? 'text-emerald-600' : 'text-amber-600'}>
            {product.condition === 'new' ? 'Neuf' : 'Occasion'}
          </span>
        </p>
      </div>

      <div className="mt-4 flex items-center sm:mt-0">
        <div className="mr-4 flex items-center rounded-lg border border-line">
          <button
            onClick={handleDecrease}
            className="p-2 text-ink-muted hover:text-ink"
            disabled={quantity <= 1}
          >
            <Minus size={16} />
          </button>
          <span className="px-2 py-1 text-ink">{quantity}</span>
          <button
            onClick={handleIncrease}
            className="p-2 text-ink-muted hover:text-ink"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="mr-4 text-base font-semibold text-ink">
          {(Number(product.price) * Number(quantity)).toFixed(2)}&nbsp;€
        </div>

        <button
          onClick={handleRemove}
          className="p-2 text-ink-muted hover:text-red-600"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;