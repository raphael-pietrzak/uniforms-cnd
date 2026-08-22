import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-line bg-ink text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-base font-semibold text-white">Cours Notre Dame</h3>
            <p className="mb-4 text-sm leading-relaxed text-slate-400">
              Des uniformes scolaires de qualité à des prix abordables.
            </p>
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
              <Mail size={15} />
              <span>cnd.secretariat@icrsp.org</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-slate-400">
              <MapPin size={15} className="mt-0.5 flex-shrink-0" />
              <span>334 Rue du Pioch de Boutonnet, 34090 Montpellier, France</span>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-base font-semibold text-white">Liens Rapides</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-slate-400 transition-colors hover:text-white">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-slate-400 transition-colors hover:text-white">
                  Boutique
                </Link>
              </li>
              <li>
                <Link to="/info" className="text-slate-400 transition-colors hover:text-white">
                  Informations Pratiques
                </Link>
              </li>
              <li>
                <Link to="/cgv" className="text-slate-400 transition-colors hover:text-white">
                  CGV
                </Link>
              </li>
              <li>
                <Link to="/politique-confidentialite" className="text-slate-400 transition-colors hover:text-white">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-slate-400 transition-colors hover:text-white">
                  Panier
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-slate-400 transition-colors hover:text-white">
                  Connexion
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-base font-semibold text-white">Horaires d'Ouverture</h3>
            <div className="rounded-lg border border-white/10 p-4 text-sm text-slate-300">
              <p className="mb-2">
                <span className="font-medium text-white">Lundi - Vendredi</span>
                <br />8h30 - 16h30
              </p>
              <p className="mt-4 text-slate-400">
                Fermé le week-end et pendant les vacances scolaires.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} Cours Notre Dame - ICRSP - Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
