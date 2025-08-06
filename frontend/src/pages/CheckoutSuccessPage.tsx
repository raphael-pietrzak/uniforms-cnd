import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft, ShoppingBag } from 'lucide-react';
import Button from '../components/ui/Button';
import { useShop } from '../context/ShopContext';

const CheckoutSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const { clearCart, lastOrder } = useShop();
  
  useEffect(() => {
    clearCart();
  }, [clearCart]);
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        
        <h1 className="mt-6 text-3xl font-bold text-gray-900">Réservation Réussie !</h1>
        
        <p className="mt-4 text-lg text-gray-600">
          Merci pour votre commande. Votre réservation d'uniformes a été enregistrée avec succès.
        </p>
        
        {lastOrder && (
          <div className="mt-8 border-t border-gray-200 pt-8">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Détails de la Réservation</h2>
            
            <div className="rounded-md bg-gray-50 p-4 mb-6">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Numéro de réservation :</span> {lastOrder.id}
              </p>
              <p className="text-sm text-gray-700 mt-2">
                <span className="font-medium">Date :</span> {new Date(lastOrder.created_at).toLocaleDateString('fr-FR')}
              </p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Articles réservés</h3>
              <div className="border-t border-gray-200">
                {lastOrder.items.map((item, index) => (
                  <div key={index} className="py-4 flex justify-between border-b border-gray-200">
                    <div className="flex">
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">{item.product.name}</p>
                        <p className="text-sm text-gray-600">Taille: {item.size}</p>
                      </div>
                    </div>
                    <div className="flex items-end flex-col">
                      <p className="text-sm font-medium text-gray-900">{item.quantity} x {item.product.price.toFixed(2)} €</p>
                      <p className="text-sm text-gray-600">{(item.quantity * item.product.price).toFixed(2)} €</p>
                    </div>
                  </div>
                ))}
                <div className="py-4 flex justify-between">
                  <p className="text-base font-medium text-gray-900">Total</p>
                  <p className="text-base font-medium text-gray-900">{lastOrder.total.toFixed(2)} €</p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-md p-4 mb-6">
              <h3 className="text-lg font-medium text-blue-900 mb-2">Instructions pour la récupération</h3>
              <p className="text-sm text-blue-800">
                Veuillez vous présenter au secrétariat de l'école pendant les heures d'ouverture (lundi au vendredi, 8h30-16h30) pour récupérer vos articles. 
                Merci de mentionner votre numéro de réservation ({lastOrder.id}).
              </p>
            </div>
          </div>
        )}
        
        <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
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
