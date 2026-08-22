import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, ArrowRight, ShoppingBag, Lock } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import CartItem from '../components/shop/CartItem';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { sumupApi } from '../services/api';
import { SumUpCard } from '../types';

const CartPage: React.FC = () => {
  const { cart, checkout, createOrderAfterPayment } = useShop();
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'inperson'>('online');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
  });
  const [cardInfo, setCardInfo] = useState<SumUpCard>({
    name: '',
    number: '',
    expiry_month: '',
    expiry_year: '',
    cvv: ''
  });
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'confirmation'>('cart');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
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

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Formatage spécial pour le numéro de carte
    if (name === 'number') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) formattedValue = formattedValue.substring(0, 19);
    }
    
    // Limitation pour le CVV
    if (name === 'cvv' && value.length > 4) {
      formattedValue = value.substring(0, 4);
    }

    // Limitation pour le mois d'expiration
    if (name === 'expiry_month' && value.length > 2) {
      formattedValue = value.substring(0, 2);
    }

    // Limitation pour l'année d'expiration
    if (name === 'expiry_year' && value.length > 2) {
      formattedValue = value.substring(0, 2);
    }

    setCardInfo({
      ...cardInfo,
      [name]: formattedValue,
    });
  };
  
  const handleCheckout = async (method: 'online' | 'inperson') => {
    setIsProcessing(true);
    setError(null);
    
    try {
      if (!customerInfo.name || !customerInfo.email) {
        setError('Veuillez fournir vos informations de contact');
        setIsProcessing(false);
        return;
      }

      if (method === 'online') {
        // Validation des informations de carte
        if (!cardInfo.name || !cardInfo.number || !cardInfo.expiry_month || 
            !cardInfo.expiry_year || !cardInfo.cvv) {
          setError('Veuillez remplir toutes les informations de carte');
          setIsProcessing(false);
          return;
        }

        // Créer d'abord le checkout SumUp
        const checkoutResult = await sumupApi.createCheckout(cart, customerInfo.email);
        setCheckoutId(checkoutResult.id);

        // Puis finaliser le paiement avec les informations de carte
        const paymentResult = await sumupApi.completePayment(checkoutResult.id, {
          ...cardInfo,
          number: cardInfo.number.replace(/\s/g, '') // Enlever les espaces du numéro
        });

        console.log('Réponse de paiement SumUp:', paymentResult);
        
        // Vérifier le statut du paiement
        if (paymentResult.status !== 'PAID') {
          // Le paiement a échoué
          let errorMessage = 'Le paiement a échoué. Veuillez vérifier vos informations de carte et réessayer.';
          
          // Chercher des détails d'erreur dans les transactions
          if (paymentResult.transactions && paymentResult.transactions.length > 0) {
            const transaction = paymentResult.transactions[0];
            if (transaction.status === 'FAILED') {
              errorMessage = 'Paiement refusé. Veuillez vérifier vos informations de carte ou utiliser une autre carte.';
            }
          }
          
          setError(errorMessage);
          setIsProcessing(false);
          return;
        }
        
        // Si le paiement est réussi, créer la commande dans notre système
        await checkout(method, customerInfo);
        
        setCheckoutStep('confirmation');
      } else {
        // Paiement en personne (pas de carte nécessaire)
        const result = await checkout(method, customerInfo);
        setCheckoutStep('confirmation');
      }
    } catch (error : any) {

      let errorMessage = 'Une erreur est survenue lors du traitement de votre commande';


      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (checkoutStep === 'confirmation') {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-line bg-surface p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mb-4 text-2xl font-bold text-ink">Commande Confirmée !</h2>
          <p className="mb-6 text-ink-muted">
            {paymentMethod === 'online'
              ? 'Votre paiement a été effectué avec succès et votre commande a été passée.'
              : 'Votre commande a été passée et sera prête à être retirée. Le paiement sera effectué sur place.'}
          </p>
          <p className="mb-6 text-ink-muted">
            Un email de confirmation a été envoyé à <span className="font-medium text-ink">{customerInfo.email}</span>
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
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="mb-6 inline-block rounded-full bg-canvas p-6">
          <ShoppingBag size={40} className="text-ink-faint" />
        </div>
        <h2 className="mb-4 text-2xl font-bold text-ink">Votre panier est vide</h2>
        <p className="mb-8 text-ink-muted">Il semble que vous n'ayez pas encore ajouté d'articles à votre panier.</p>
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold text-ink md:text-3xl">
        {checkoutStep === 'cart' ? 'Votre Panier' : 'Paiement'}
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {checkoutStep === 'cart' ? (
            <div className="overflow-hidden rounded-xl border border-line bg-surface">
              <div className="border-b border-line p-6">
                <h2 className="mb-4 text-lg font-semibold text-ink">Articles du Panier ({cart.length})</h2>
                <div className="divide-y divide-line">
                  {cart.map((item, index) => (
                    <CartItem key={`${item.product.id}-${item.selectedSize}-${index}`} item={item} />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-line bg-surface">
              <div className="p-6">
                <h2 className="mb-4 text-lg font-semibold text-ink">Informations de Contact</h2>
                <form onSubmit={(e) => { e.preventDefault(); handleCheckout(paymentMethod); }}>
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
                      <h3 className="mb-4 text-lg font-semibold text-ink">Méthode de Paiement</h3>
                      <div className="space-y-2">
                        <label className="flex cursor-pointer items-center rounded-lg border border-line p-4 hover:bg-canvas">
                          <input
                            type="radio"
                            name="payment"
                            value="online"
                            checked={paymentMethod === 'online'}
                            onChange={() => setPaymentMethod('online')}
                            className="h-4 w-4 text-accent"
                          />
                          <div className="ml-3">
                            <span className="block text-sm font-medium text-ink">
                              Payer en Ligne (Carte de Crédit)
                            </span>
                            <span className="block text-xs text-ink-muted">
                              Traitement sécurisé des paiements via SumUp
                            </span>
                          </div>
                          <CreditCard size={20} className="ml-auto text-ink-faint" />
                        </label>

                        <label className="flex cursor-pointer items-center rounded-lg border border-line p-4 hover:bg-canvas">
                          <input
                            type="radio"
                            name="payment"
                            value="inperson"
                            checked={paymentMethod === 'inperson'}
                            onChange={() => setPaymentMethod('inperson')}
                            className="h-4 w-4 text-accent"
                          />
                          <div className="ml-3">
                            <span className="block text-sm font-medium text-ink">
                              Payer au Retrait
                            </span>
                            <span className="block text-xs text-ink-muted">
                              Paiement en espèces ou par carte lors du retrait de votre commande
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Formulaire de carte de crédit */}
                    {paymentMethod === 'online' && (
                      <div className="mt-6 rounded-lg border border-line bg-canvas p-6">
                        <div className="mb-4 flex items-center">
                          <h4 className="text-sm font-semibold text-ink">Informations de Carte de Crédit</h4>
                        </div>
                        <div className="space-y-4">
                          <Input
                            label="Nom sur la carte"
                            name="name"
                            value={cardInfo.name}
                            onChange={handleCardInputChange}
                            placeholder="Nom Prénom"
                            required
                            fullWidth
                          />
                          <Input
                            label="Numéro de carte"
                            name="number"
                            value={cardInfo.number}
                            onChange={handleCardInputChange}
                            placeholder="1234 5678 9012 3456"
                            required
                            fullWidth
                          />
                          <div className="grid grid-cols-3 gap-4">
                            <Input
                              label="Mois"
                              name="expiry_month"
                              value={cardInfo.expiry_month}
                              onChange={handleCardInputChange}
                              placeholder="12"
                              maxLength={2}
                              required
                            />
                            <Input
                              label="Année"
                              name="expiry_year"
                              value={cardInfo.expiry_year}
                              onChange={handleCardInputChange}
                              placeholder="25"
                              maxLength={2}
                              required
                            />
                            <Input
                              label="CVV"
                              name="cvv"
                              value={cardInfo.cvv}
                              onChange={handleCardInputChange}
                              placeholder="123"
                              maxLength={4}
                              required
                            />
                          </div>
                        </div>
                        <div className="mt-4 text-xs text-ink-muted">
                          <Lock size={12} className="inline mr-1" />
                          Vos informations de paiement sont protégées par le chiffrement SSL
                        </div>
                      </div>
                    )}

                    <div className="pt-6">
                      <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          'Traitement en cours...'
                        ) : paymentMethod === 'online' ? (
                          'Payer Maintenant'
                        ) : (
                          'Finaliser la Commande'
                        )}
                      </Button>
                    </div>

                    {error && (
                      <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                        {error}
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 overflow-hidden rounded-xl border border-line bg-surface">
            <div className="border-b border-line p-6">
              <h2 className="mb-4 text-lg font-semibold text-ink">Récapitulatif de la Commande</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-ink-muted">Sous-total</span>
                  <span className="text-ink">{Number(subtotal).toFixed(2)}&nbsp;€</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ink-muted">Livraison</span>
                  <span className="text-emerald-600">Gratuite</span>
                </div>
                <div className="flex justify-between border-t border-line pt-4 font-bold">
                  <span className="text-ink">Total</span>
                  <span className="text-ink">{Number(total).toFixed(2)}&nbsp;€</span>
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