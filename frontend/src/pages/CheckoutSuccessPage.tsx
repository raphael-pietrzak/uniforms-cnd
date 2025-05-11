import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import Button from '../components/ui/Button';
import { stripeApi } from '../services/api';
import { useShop } from '../context/ShopContext';

const CheckoutSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'no-session'>('loading');
  const [sessionDetails, setSessionDetails] = useState<any>(null);
  const { clearCart } = useShop();

  useEffect(() => {
    const fetchSession = async () => {
      if (!sessionId) {
        setStatus('no-session');
        return;
      }

      try {
        const session = await stripeApi.getCheckoutSession(sessionId);
        console.log("Session details:", session); // Pour débogage
        
        // Vérifier si la session est complétée avec succès
        if (session && session.payment_status === 'paid') {
          setSessionDetails(session);
          setStatus('success');
          
          // Vider le panier après un paiement réussi
          clearCart();
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de la session:', error);
        setStatus('error');
      }
    };

    fetchSession();
  }, [sessionId, clearCart]);

  if (status === 'loading') {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Vérification de votre paiement...</p>
      </div>
    );
  }

  if (status === 'no-session') {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Session de paiement introuvable</h2>
          <p className="text-gray-600 mb-6">
            Aucune information de paiement n'a été trouvée. Si vous venez de finaliser un achat, vérifiez votre email pour la confirmation.
          </p>
          <Button
            as={Link}
            to="/shop"
            variant="primary"
            className="inline-flex items-center"
          >
            <ShoppingBag size={18} className="mr-2" />
            Continuer vos Achats
          </Button>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Une erreur est survenue</h2>
          <p className="text-gray-600 mb-6">
            Impossible de vérifier votre paiement. Si vous pensez qu'il s'agit d'une erreur, veuillez contacter notre service client.
          </p>
          <Button
            as={Link}
            to="/cart"
            variant="primary"
          >
            Retourner au panier
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Paiement Réussi!</h2>
        <p className="text-gray-600 mb-4">
          Votre commande a bien été enregistrée et le paiement a été effectué avec succès.
        </p>
        {sessionDetails?.customer_email && (
          <p className="text-gray-600 mb-6">
            Un email de confirmation a été envoyé à <span className="font-medium">{sessionDetails.customer_email}</span>
          </p>
        )}
        <Button
          as={Link}
          to="/shop"
          variant="primary"
          className="inline-flex items-center"
        >
          <ShoppingBag size={18} className="mr-2" />
          Continuer vos Achats
        </Button>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
