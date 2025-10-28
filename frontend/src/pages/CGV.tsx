import React from 'react';

const CGV: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Conditions Générales de Vente</h1>
          </div>
          
          <p className="text-sm text-gray-600 mb-8">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Objet</h2>
              <p>
                Les présentes conditions générales de vente (CGV) régissent les ventes d'uniformes scolaires 
                réalisées par l'association Cours Notre Dame - ICRSP (ci-après "l'Association") auprès des 
                familles des élèves scolarisés dans l'établissement (ci-après "les Clients").
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Champ d'application</h2>
              <p>
                La vente d'uniformes est réservée exclusivement aux familles des élèves inscrits au Cours Notre Dame. 
                Toute commande implique l'acceptation sans réserve des présentes CGV.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Commandes</h2>
              <p className="mb-2">
                Les commandes peuvent être passées :
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>En ligne via le site internet de l'établissement</li>
                <li>Directement auprès du secrétariat de l'établissement</li>
              </ul>
              <p className="mt-2">
                Toute commande est considérée comme définitive après validation par le Client.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Prix</h2>
              <p>
                Les prix sont indiqués en euros, toutes taxes comprises (TTC). L'Association se réserve 
                le droit de modifier ses prix à tout moment, étant entendu que le prix figurant sur le site 
                au jour de la commande sera le seul applicable au Client.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Paiement</h2>
              <p className="mb-2">
                Le paiement peut être effectué :
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Par carte bancaire en ligne (paiement sécurisé)</li>
                <li>Par chèque à l'ordre de "Cours Notre Dame - ICRSP"</li>
                <li>En espèces auprès du secrétariat</li>
              </ul>
              <p className="mt-2">
                La commande ne sera traitée qu'après réception et validation du paiement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Livraison et retrait</h2>
              <p>
                Les uniformes commandés sont à retirer directement à l'établissement scolaire aux horaires 
                d'ouverture du secrétariat (du lundi au vendredi, de 8h30 à 16h30). Les familles seront 
                informées par email lorsque leur commande sera prête.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Échanges et retours</h2>
              <p className="mb-2">
                En cas d'erreur de taille ou de défaut de fabrication, l'Association accepte les échanges 
                sous les conditions suivantes :
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Dans un délai de 14 jours suivant le retrait de la commande</li>
                <li>Les articles doivent être dans leur état d'origine, non portés et non lavés</li>
                <li>Les étiquettes doivent être présentes pour les articles neufs</li>
              </ul>
              <p className="mt-2">
                Les remboursements ne sont possibles qu'en cas de défaut de fabrication avéré.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Responsabilité</h2>
              <p>
                L'Association s'engage à fournir des uniformes de qualité conforme aux descriptions. 
                Sa responsabilité ne saurait être engagée en cas de mauvaise utilisation ou d'entretien 
                inapproprié des articles par le Client.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Données personnelles</h2>
              <p>
                Les données personnelles collectées sont utilisées uniquement pour la gestion des commandes. 
                Conformément au RGPD, les Clients disposent d'un droit d'accès, de rectification et de 
                suppression de leurs données. Pour plus d'informations, consultez notre 
                <a href="/politique-confidentialite" className="text-blue-600 hover:underline ml-1">
                  politique de confidentialité
                </a>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Réclamations</h2>
              <p>
                Pour toute réclamation, les Clients peuvent contacter l'Association :
              </p>
              <ul className="list-none pl-6 mt-2 space-y-1">
                <li>Par email : cnd.secretariat@icrsp.org</li>
                <li>Par courrier : 334 Rue du Pioch de Boutonnet, 34090 Montpellier</li>
                <li>Par téléphone auprès du secrétariat</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Droit applicable</h2>
              <p>
                Les présentes CGV sont soumises au droit français. En cas de litige, une solution amiable 
                sera recherchée avant toute action judiciaire.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CGV;
