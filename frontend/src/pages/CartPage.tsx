import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, ArrowRight, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import CartItem from '../components/shop/CartItem';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const CartPage: React.FC = () => {
  const { cart, checkout } = useShop();
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'inperson'>('online');
  const [customerInfo, setCustomerInfo] = useState({
    name: 'Jean Dupont',
    email: 'jean.dupont@example.com',
  });
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'confirmation'>('cart');
  const navigate = useNavigate();
  
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo({
      ...customerInfo,
      [name]: value,
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await checkout(paymentMethod, customerInfo);
      
      if (result.redirect) {
        // Rediriger vers la page de paiement Stripe
        window.location.href = result.redirect;
        return;
      }
      
      // Sinon, c'est un paiement en personne, montrer la confirmation
      setCheckoutStep('confirmation');
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
    }
  };
  
  if (checkoutStep === 'confirmation') {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Commande Confirmée !</h2>
          <p className="text-gray-600 mb-6">
            {paymentMethod === 'online' 
              ? 'Votre paiement a été effectué avec succès et votre commande a été passée.' 
              : 'Votre commande a été passée et sera prête à être retirée. Le paiement sera effectué sur place.'}
          </p>
          <p className="text-gray-600 mb-6">
            Un email de confirmation a été envoyé à <span className="font-medium">{customerInfo.email}</span>
          </p>
          <Link to="/shop">
            <Button
              variant="primary"
              className="inline-flex items-center"
            >
              <ShoppingBag size={18} className="mr-2" />
              Continuer vos Achats
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="inline-block p-6 bg-gray-100 rounded-full mb-6">
          <ShoppingBag size={40} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Votre panier est vide</h2>
        <p className="text-gray-600 mb-8">Il semble que vous n'ayez pas encore ajouté d'articles à votre panier.</p>
        <Link to="/shop">
          <Button variant="outline" className="inline-flex items-center">
            <ShoppingBag size={18} className="mr-2" />
            Parcourir les Produits
          </Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {checkoutStep === 'cart' ? 'Votre Panier' : 'Paiement'}
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {checkoutStep === 'cart' ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Articles du Panier ({cart.length})</h2>
                <div className="divide-y divide-gray-200">
                  {cart.map((item, index) => (
                    <CartItem key={`${item.product.id}-${item.selectedSize}-${index}`} item={item} />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Informations de Contact</h2>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <Input
                      label="Nom Complet"
                      name="name"
                      value={customerInfo.name}
                      onChange={handleInputChange}
                      required
                      fullWidth
                    />
                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={handleInputChange}
                      required
                      fullWidth
                    />
                    
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Méthode de Paiement</h3>
                      <div className="space-y-2">
                        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="payment"
                            value="online"
                            checked={paymentMethod === 'online'}
                            onChange={() => setPaymentMethod('online')}
                            className="h-4 w-4 text-blue-600"
                          />
                          <div className="ml-3">
                            <span className="block text-sm font-medium text-gray-700">
                              Payer en Ligne (Carte de Crédit)
                            </span>
                            <span className="block text-xs text-gray-500">
                              Traitement sécurisé des paiements via Stripe
                            </span>
                          </div>
                          <CreditCard size={20} className="ml-auto text-gray-400" />
                        </label>
                        
                        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="payment"
                            value="inperson"
                            checked={paymentMethod === 'inperson'}
                            onChange={() => setPaymentMethod('inperson')}
                            className="h-4 w-4 text-blue-600"
                          />
                          <div className="ml-3">
                            <span className="block text-sm font-medium text-gray-700">
                              Payer au Retrait
                            </span>
                            <span className="block text-xs text-gray-500">
                              Paiement en espèces ou par carte lors du retrait de votre commande
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>
                    
                    <div className="pt-6">
                      <Button type="submit" variant="primary" fullWidth>
                        {paymentMethod === 'online' 
                          ? 'Payer avec Stripe' 
                          : 'Finaliser la Commande'
                        }
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-20">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Récapitulatif de la Commande</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="text-gray-800">{subtotal.toFixed(2)}&nbsp;€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Livraison</span>
                  <span className="text-green-600">Gratuite</span>
                </div>
                <div className="border-t pt-4 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-blue-900">{total.toFixed(2)}&nbsp;€</span>
                </div>
              </div>
            </div>
            <div className="p-6">
              {checkoutStep === 'cart' ? (
                <Button
                  onClick={() => setCheckoutStep('checkout')}
                  variant="primary"
                  fullWidth
                  className="flex items-center justify-center"
                >
                  Procéder au Paiement <ArrowRight size={18} className="ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={() => setCheckoutStep('cart')}
                  variant="outline"
                  fullWidth
                >
                  Retour au Panier
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;