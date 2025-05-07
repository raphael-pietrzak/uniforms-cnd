import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Info Entreprise */}
          <div>
            <h3 className="text-lg font-semibold mb-4">UniformeScolaire</h3>
            <p className="text-gray-300 mb-4">
              Des uniformes scolaires de qualité à des prix abordables.
            </p>
            <div className="flex items-center mb-2">
              <Phone size={16} className="mr-2" />
              <span className="text-gray-300">+33 123 456 789</span>
            </div>
            <div className="flex items-center mb-2">
              <Mail size={16} className="mr-2" />
              <span className="text-gray-300">contact@uniformescolaire.com</span>
            </div>
            <div className="flex items-start">
              <MapPin size={16} className="mr-2 mt-1 flex-shrink-0" />
              <span className="text-gray-300">123 Rue de l'École, 75001 Paris, France</span>
            </div>
          </div>
          
          {/* Liens Rapides */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-300 hover:text-white transition-colors">
                  Boutique
                </Link>
              </li>
              <li>
                <Link to="/info" className="text-gray-300 hover:text-white transition-colors">
                  Informations Pratiques
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-300 hover:text-white transition-colors">
                  Panier
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Horaires d'Ouverture */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Horaires d'Ouverture</h3>
            <div className="text-gray-300">
              <p className="mb-2">
                <span className="font-medium">Lundi - Vendredi:</span>
                <br />8h30 - 16h30
              </p>
              <p>
                <span className="font-medium">Samedi:</span>
                <br />9h00 - 12h00
              </p>
              <p className="mt-4 text-sm">
                Fermé les dimanches et pendant les vacances scolaires
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} UniformeScolaire. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;