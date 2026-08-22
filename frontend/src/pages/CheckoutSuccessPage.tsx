import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowLeft, ShoppingBag, Loader } from 'lucide-react';
import Button from '../components/ui/Button';
import { useShop } from '../context/ShopContext';
import { sumupApi } from '../services/api';

const CheckoutSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const { clearCart, lastOrder } = useShop();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [checkoutStatus, setCheckoutStatus] = useState<'success' | 'pending' | 'failed'>('pending');
  
  useEffect(() => {
    const checkCheckoutStatus = async () => {
      // Vérifier si nous avons un checkout_id depuis SumUp
      const checkoutId = searchParams.get('checkout_id');
      
      if (checkoutId) {
        try {
          // Vérifier le statut du checkout SumUp
          const checkout = await sumupApi.getCheckout(checkoutId);
          
          if (checkout.status === 'PAID') {
            setCheckoutStatus('success');
          } else if (checkout.status === 'PENDING') {
            setCheckoutStatus('pending');
            // Optionnel : Réessayer après un délai
            setTimeout(() => checkCheckoutStatus(), 3000);
            return;
          } else {
            setCheckoutStatus('failed');
          }
        } catch (error) {
          console.error('Erreur lors de la vérification du statut:', error);
          setCheckoutStatus('failed');
        }
      } else {
        // Si pas de checkout_id, c'est probablement un paiement en personne
        setCheckoutStatus('success');
      }
      
      setLoading(false);
    };

    checkCheckoutStatus();
    clearCart();
  }, [clearCart, searchParams]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-line bg-surface p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft">
            <Loader className="h-10 w-10 animate-spin text-accent" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-ink">Vérification du paiement...</h1>
          <p className="mt-4 text-ink-muted">
            Nous vérifions le statut de votre paiement. Veuillez patienter.
          </p>
        </div>
      </div>
    );
  }

  if (checkoutStatus === 'failed') {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-line bg-surface p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="mt-6 text-2xl font-bold text-ink">Paiement Échoué</h1>
          <p className="mt-4 text-ink-muted">
            Il y a eu un problème avec votre paiement. Veuillez réessayer.
          </p>
          <div className="mt-8">
            <Link to="/cart">
              <Button variant="primary">Retour au Panier</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (checkoutStatus === 'pending') {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-line bg-surface p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
            <Loader className="h-10 w-10 animate-spin text-amber-600" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-ink">Paiement en Cours</h1>
          <p className="mt-4 text-ink-muted">
            Votre paiement est en cours de traitement. Nous mettons à jour le statut automatiquement.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-xl border border-line bg-surface p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle className="h-10 w-10 text-emerald-600" />
        </div>

        <h1 className="mt-6 text-2xl font-bold text-ink">Réservation Réussie !</h1>

        <p className="mt-4 text-ink-muted">
          Merci pour votre commande. Votre réservation d'uniformes a été enregistrée avec succès.
        </p>

        {lastOrder && (
          <div className="mt-8 border-t border-line pt-8 text-left">
            <h2 className="mb-4 text-lg font-semibold text-ink">Détails de la Réservation</h2>

            <div className="mb-6 rounded-lg bg-canvas p-4">
              <p className="text-sm text-ink-muted">
                <span className="font-medium text-ink">Numéro de réservation :</span> {lastOrder.id}
              </p>
              <p className="mt-2 text-sm text-ink-muted">
                <span className="font-medium text-ink">Date :</span> {new Date(lastOrder.created_at).toLocaleDateString('fr-FR')}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="mb-2 text-base font-medium text-ink">Articles réservés</h3>
              <div className="border-t border-line">
                {lastOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between border-b border-line py-4">
                    <div className="flex">
                      <div>
                        <p className="text-sm font-medium text-ink">{item.product.name}</p>
                        <p className="text-sm text-ink-muted">Taille: {item.selectedSize}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-sm font-medium text-ink">{item.quantity} x {item.product.price.toFixed(2)} €</p>
                      <p className="text-sm text-ink-muted">{(item.quantity * item.product.price).toFixed(2)} €</p>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between py-4">
                  <p className="text-base font-medium text-ink">Total</p>
                  <p className="text-base font-medium text-ink">{lastOrder.total.toFixed(2)} €</p>
                </div>
              </div>
            </div>

            <div className="mb-6 rounded-lg bg-accent-soft p-4">
              <h3 className="mb-2 text-base font-medium text-accent">Instructions pour la récupération</h3>
              <p className="text-sm text-ink">
                Veuillez vous présenter au secrétariat de l'école pendant les heures d'ouverture (lundi au vendredi, 8h30-16h30) pour récupérer vos articles.
                Merci de mentionner votre numéro de réservation ({lastOrder.id}).
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <Link to="/">
            <Button variant="outline" className="w-full sm:w-auto flex items-center justify-center">
              <ArrowLeft size={16} className="mr-2" />
              Retour à l'Accueil
            </Button>
          </Link>
          
          <Link to="/shop">
            <Button variant="primary" className="w-full sm:w-auto flex items-center justify-center">
              <ShoppingBag size={16} className="mr-2" />
              Continuer à Parcourir
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
