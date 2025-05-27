import React from 'react';
import { Clock, MapPin, Phone, Mail, HelpCircle, ShoppingBag } from 'lucide-react';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';

const InfoPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Informations Pratiques</h1>
      
      {/* Hero Section */}
      <div className="bg-blue-50 rounded-lg p-8 mb-12">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">
            Bienvenue à la Boutique d'Uniformes Scolaires
          </h2>
          <p className="text-lg text-blue-800 mb-6">
            Nous fournissons des uniformes de qualité pour les élèves à des prix abordables, avec des options neuves et d'occasion disponibles.
          </p>
          <Link to="/shop">
            <Button variant="primary" className="flex items-center">
              <ShoppingBag size={18} className="mr-2" />
              Visiter Notre Boutique
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Opening Hours */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-100 rounded-full mr-4">
                <Clock size={24} className="text-blue-900" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Horaires d'Ouverture</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Lundi - Vendredi</span>
                <span>8h30 - 16h30</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Samedi</span>
                <span>9h00 - 12h00</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Dimanche</span>
                <span>Fermé</span>
              </div>
              <div className="pt-4 text-sm text-gray-600">
                <p>La boutique sera fermée pendant les vacances scolaires. Veuillez consulter le calendrier scolaire pour les dates spécifiques.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-100 rounded-full mr-4">
                <Phone size={24} className="text-blue-900" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Nous Contacter</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <Phone size={18} className="text-blue-800 mr-3 mt-1" />
                <div>
                  <p className="font-medium">Téléphone</p>
                  <p className="text-gray-600">+33 9 51 34 26 76</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail size={18} className="text-blue-800 mr-3 mt-1" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-gray-600">cours.notre.dame@icrsp.org</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin size={18} className="text-blue-800 mr-3 mt-1" />
                <div>
                  <p className="font-medium">Adresse</p>
                  <p className="text-gray-600">334 Rue du Pioch de Boutonnet, 34090 Montpellier, France</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="mb-12">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-blue-100 rounded-full mr-4">
            <HelpCircle size={24} className="text-blue-900" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Questions Fréquentes</h2>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="divide-y divide-gray-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Comment puis-je donner des uniformes usagés ?</h3>
              <p className="text-gray-600">
                Vous pouvez apporter des uniformes propres et en bon état à la boutique pendant les heures d'ouverture. Nous acceptons les articles en bon état sans dommages visibles.
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Quels modes de paiement acceptez-vous ?</h3>
              <p className="text-gray-600">
                Nous acceptons les espèces, les cartes de crédit/débit et les paiements en ligne via notre site web.
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Puis-je échanger des articles s'ils ne conviennent pas ?</h3>
              <p className="text-gray-600">
                Oui, les articles non utilisés peuvent être échangés dans les 14 jours suivant l'achat avec preuve d'achat. Les articles doivent être dans leur état d'origine avec les étiquettes attachées.
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Proposez-vous la livraison ?</h3>
              <p className="text-gray-600">
                Non, tous les articles doivent être récupérés à la boutique de l'école pendant les heures d'ouverture.
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Comment fonctionne le système d'uniformes d'occasion ?</h3>
              <p className="text-gray-600">
                Les parents peuvent donner des uniformes devenus trop petits mais en bon état. Ceux-ci sont ensuite revendus à prix réduit, les bénéfices étant reversés au fonds de l'école ou à l'association des parents d'élèves.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Map */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Nous Trouver</h2>
          <p className="text-gray-600">Notre boutique d'uniformes est située dans le bâtiment principal de l'école, près de l'entrée principale.</p>
        </div>
        <div className="h-96 bg-gray-200 w-full">
          {/* Map would go here - for now a placeholder */}
          <div className="h-full w-full flex items-center justify-center bg-blue-50">
            <div className="text-center">
              <MapPin size={48} className="mx-auto mb-4 text-blue-900" />
              <p className="text-gray-600">Emplacement de la carte</p>
              <p className="font-medium text-gray-800 mt-2">334 Rue du Pioch de Boutonnet, 34090 Montpellier, France</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPage;