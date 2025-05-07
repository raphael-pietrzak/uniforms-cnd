import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '../../types';
import { useShop } from '../../context/ShopContext';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useShop();
  const { product, quantity, selectedSize } = item;
  
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
    <div className="flex flex-col sm:flex-row items-start sm:items-center py-4 border-b border-gray-200">
      <div className="w-full sm:w-24 h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden mr-0 sm:mr-4 mb-4 sm:mb-0">
        <img 
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex-1">
        <h3 className="text-lg font-medium text-gray-800">{product.name}</h3>
        <p className="text-sm text-gray-500">Size: {selectedSize}</p>
        <p className="text-sm text-gray-500">
          Condition: <span className={product.condition === 'new' ? 'text-green-600' : 'text-yellow-600'}>
            {product.condition === 'new' ? 'New' : 'Used'}
          </span>
        </p>
      </div>
      
      <div className="flex items-center mt-4 sm:mt-0">
        <div className="flex items-center border rounded-md mr-4">
          <button 
            onClick={handleDecrease}
            className="p-2 text-gray-500 hover:text-gray-700"
            disabled={quantity <= 1}
          >
            <Minus size={16} />
          </button>
          <span className="px-2 py-1 text-gray-800">{quantity}</span>
          <button 
            onClick={handleIncrease}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <Plus size={16} />
          </button>
        </div>
        
        <div className="text-lg font-bold text-gray-800 mr-4">
          €{(product.price * quantity).toFixed(2)}
        </div>
        
        <button 
          onClick={handleRemove}
          className="p-2 text-red-500 hover:text-red-700"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;