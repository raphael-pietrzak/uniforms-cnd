import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-20 bg-[#10253a] text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Info Entreprise */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Cours Notre Dame</h3>
            <p className="text-slate-300 mb-4 leading-relaxed">
              Des uniformes scolaires de qualité à des prix abordables.
            </p>
            <div className="flex items-center mb-3 rounded-lg bg-white/5 px-3 py-2">
              <Mail size={16} className="mr-2 text-[#94dfd6]" />
              <span className="text-slate-200 text-sm">cnd.secretariat@icrsp.org</span>
            </div>
            <div className="flex items-start rounded-lg bg-white/5 px-3 py-2">
              <MapPin size={16} className="mr-2 mt-1 flex-shrink-0 text-[#94dfd6]" />
              <span className="text-slate-200 text-sm">334 Rue du Pioch de Boutonnet, 34090 Montpellier, France</span>
            </div>
          </div>
          
          {/* Liens Rapides */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-slate-300 hover:text-[#94dfd6] transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-slate-300 hover:text-[#94dfd6] transition-colors">
                  Boutique
                </Link>
              </li>
              <li>
                <Link to="/info" className="text-slate-300 hover:text-[#94dfd6] transition-colors">
                  Informations Pratiques
                </Link>
              </li>
              <li>
                <Link to="/cgv" className="text-slate-300 hover:text-[#94dfd6] transition-colors">
                  CGV
                </Link>
              </li>
              <li>
                <Link to="/politique-confidentialite" className="text-slate-300 hover:text-[#94dfd6] transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-slate-300 hover:text-[#94dfd6] transition-colors">
                  Panier
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-slate-300 hover:text-[#94dfd6] transition-colors">
                  Connexion
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Horaires d'Ouverture */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Horaires d'Ouverture</h3>
            <div className="rounded-xl bg-white/5 p-4 text-slate-200">
              <p className="mb-2">
                <span className="font-medium">Lundi - Vendredi:</span>
                <br />8h30 - 16h30
              </p>
              <p className="mt-4 text-sm text-slate-300">
                Fermé le week-end et pendant les vacances scolaires.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-white/10 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} Cours Notre Dame - ICRSP - Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;