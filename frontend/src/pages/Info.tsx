import React from 'react';
import { Clock, MapPin, Mail, HelpCircle, ShoppingBag } from 'lucide-react';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';

const InfoPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold text-ink md:text-3xl">Informations Pratiques</h1>

      {/* Hero Section */}
      <div className="mb-12 rounded-xl border border-line bg-canvas p-8">
        <div className="max-w-2xl">
          <h2 className="mb-4 text-xl font-bold text-ink">
            Bienvenue au Service d'Uniformes Scolaires
          </h2>
          <p className="mb-6 text-base text-ink-muted">
            Nous proposons une collection d'uniformes principalement d'occasion pour les élèves de notre école à des prix très accessibles.
          </p>
          <Link to="/shop">
            <Button variant="primary" className="flex items-center">
              <ShoppingBag size={18} className="mr-2" />
              Voir nos Articles
            </Button>
          </Link>
        </div>
      </div>

      {/* Content Grid */}
      <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Opening Hours */}
        <div className="rounded-xl border border-line bg-surface p-6">
          <div className="mb-4 flex items-center">
            <div className="mr-4 rounded-lg bg-accent-soft p-2 text-accent">
              <Clock size={22} />
            </div>
            <h2 className="text-lg font-bold text-ink">Horaires du Secrétariat</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="font-medium text-ink">Lundi - Vendredi</span>
              <span className="text-ink-muted">8h30 - 16h30</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-ink">Samedi - Dimanche</span>
              <span className="text-ink-muted">Fermé</span>
            </div>
            <div className="pt-4 text-ink-muted">
              <p>Le secrétariat sera fermé pendant les vacances scolaires. Veuillez consulter le calendrier scolaire pour les dates spécifiques.</p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="rounded-xl border border-line bg-surface p-6">
          <div className="mb-4 flex items-center">
            <div className="mr-4 rounded-lg bg-accent-soft p-2 text-accent">
              <Mail size={22} />
            </div>
            <h2 className="text-lg font-bold text-ink">Nous Contacter</h2>
          </div>
          <div className="space-y-4 text-sm">
            <div className="flex items-start">
              <Mail size={16} className="mr-3 mt-1 text-ink-muted" />
              <div>
                <p className="font-medium text-ink">Email du Secrétariat</p>
                <p className="text-ink-muted">cnd.secretariat@icrsp.org</p>
              </div>
            </div>
            <div className="flex items-start">
              <MapPin size={16} className="mr-3 mt-1 text-ink-muted" />
              <div>
                <p className="font-medium text-ink">Adresse</p>
                <p className="text-ink-muted">334 Rue du Pioch de Boutonnet, 34090 Montpellier, France</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-12">
        <div className="mb-6 flex items-center">
          <div className="mr-4 rounded-lg bg-accent-soft p-2 text-accent">
            <HelpCircle size={22} />
          </div>
          <h2 className="text-xl font-bold text-ink">Questions Fréquentes</h2>
        </div>

        <div className="overflow-hidden rounded-xl border border-line bg-surface">
          <div className="divide-y divide-line">
            <div className="p-6">
              <h3 className="mb-2 text-base font-semibold text-ink">Comment puis-je donner des uniformes usagés ?</h3>
              <p className="text-sm text-ink-muted">
                Vous pouvez apporter des uniformes propres et en bon état au secrétariat pendant les heures d'ouverture. Nous acceptons les articles en bon état sans dommages visibles.
              </p>
            </div>
            <div className="p-6">
              <h3 className="mb-2 text-base font-semibold text-ink">Quels modes de paiement acceptez-vous ?</h3>
              <p className="text-sm text-ink-muted">
                Nous acceptons les espèces et les paiements en ligne via notre site web.
              </p>
            </div>
            <div className="p-6">
              <h3 className="mb-2 text-base font-semibold text-ink">Puis-je échanger des articles s'ils ne conviennent pas ?</h3>
              <p className="text-sm text-ink-muted">
                Oui, les articles peuvent être échangés dans un délai raisonnable s'ils n'ont pas été utilisés.
              </p>
            </div>
            <div className="p-6">
              <h3 className="mb-2 text-base font-semibold text-ink">Où puis-je récupérer les uniformes ?</h3>
              <p className="text-sm text-ink-muted">
                Tous les articles doivent être récupérés au secrétariat de l'école pendant les heures d'ouverture.
              </p>
            </div>
            <div className="p-6">
              <h3 className="mb-2 text-base font-semibold text-ink">Comment fonctionne le système d'uniformes d'occasion ?</h3>
              <p className="text-sm text-ink-muted">
                Les familles peuvent donner des uniformes devenus trop petits mais en bon état. Ceux-ci sont ensuite proposés à prix réduit, les bénéfices étant reversés au fonds de l'école.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="mb-8 overflow-hidden rounded-xl border border-line bg-surface">
        <div className="border-b border-line p-6">
          <h2 className="mb-2 text-lg font-bold text-ink">Nous Trouver</h2>
          <p className="text-sm text-ink-muted">Le secrétariat où vous pourrez récupérer les uniformes est situé au milieu de la cour à gauche.</p>
        </div>
        <div className="h-96 w-full bg-canvas">
          <div className="relative h-full w-full">
            <img src="/maps.png" alt="Map" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-center p-4">
              <div className="max-w-md rounded-lg border border-line bg-surface/90 p-4 text-center">
                <p className="text-sm text-ink-muted">Entrée de l'école</p>
                <p className="mt-2 font-medium text-ink">334 Rue du Pioch de Boutonnet, 34090 Montpellier, France</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPage;
