import React from 'react';

const PolitiqueConfidentialite: React.FC = () => {
  return (
    <div className="min-h-screen bg-canvas py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-line bg-surface p-8">
          <h1 className="mb-6 text-2xl font-bold text-ink">Politique de Confidentialité</h1>

          <p className="mb-8 text-sm text-ink-muted">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>

          <div className="space-y-6 text-sm text-ink-muted">
            <section>
              <h2 className="mb-3 text-base font-semibold text-ink">1. Introduction</h2>
              <p>
                L'association Cours Notre Dame - ICRSP (ci-après "l'Association") s'engage à protéger 
                la vie privée des familles et des élèves. Cette politique de confidentialité explique 
                comment nous collectons, utilisons et protégeons vos données personnelles conformément 
                au Règlement Général sur la Protection des Données (RGPD).
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-semibold text-ink">2. Responsable du traitement</h2>
              <p>
                Le responsable du traitement des données est :
              </p>
              <div className="mt-2 pl-6">
                <p className="font-semibold text-ink">Cours Notre Dame - ICRSP</p>
                <p>334 Rue du Pioch de Boutonnet</p>
                <p>34090 Montpellier, France</p>
                <p>Email : cnd.secretariat@icrsp.org</p>
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-base font-semibold text-ink">3. Données collectées</h2>
              <p className="mb-2">
                Dans le cadre de la vente d'uniformes scolaires, nous collectons les données suivantes :
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Nom et prénom du parent/tuteur légal</li>
                <li>Adresse email</li>
                <li>Informations de commande (articles, tailles, quantités)</li>
                <li>Historique des achats</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-base font-semibold text-ink">4. Finalités du traitement</h2>
              <p className="mb-2">
                Les données collectées sont utilisées exclusivement pour :
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>La gestion des commandes d'uniformes</li>
                <li>La communication avec les familles concernant leurs commandes</li>
                <li>La gestion des échanges et retours</li>
                <li>L'amélioration de notre service</li>
                <li>Le respect de nos obligations légales et comptables</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-base font-semibold text-ink">5. Base légale du traitement</h2>
              <p>
                Le traitement de vos données personnelles repose sur :
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>L'exécution du contrat de vente (commande d'uniformes)</li>
                <li>Le respect d'obligations légales (comptabilité, archivage)</li>
                <li>Votre consentement pour les communications non essentielles</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-base font-semibold text-ink">6. Destinataires des données</h2>
              <p>
                Vos données personnelles sont accessibles uniquement :
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Au personnel administratif de l'établissement chargé de la gestion des commandes</li>
                <li>Aux prestataires techniques nécessaires au fonctionnement du site (hébergement)</li>
              </ul>
              <p className="mt-2">
                Nous ne vendons, ne louons et ne partageons jamais vos données avec des tiers à des fins commerciales.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-semibold text-ink">7. Durée de conservation</h2>
              <p>
                Vos données sont conservées :
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Pendant toute la durée de scolarisation de l'élève</li>
                <li>Les données comptables sont archivées conformément aux obligations légales (10 ans)</li>
                <li>Les données sont supprimées à votre demande après la fin de scolarisation, 
                    sauf obligation légale de conservation</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-base font-semibold text-ink">8. Vos droits</h2>
              <p className="mb-2">
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Droit d'accès</strong> : obtenir une copie de vos données personnelles</li>
                <li><strong>Droit de rectification</strong> : corriger des données inexactes ou incomplètes</li>
                <li><strong>Droit à l'effacement</strong> : demander la suppression de vos données</li>
                <li><strong>Droit à la limitation</strong> : limiter le traitement de vos données</li>
                <li><strong>Droit d'opposition</strong> : vous opposer au traitement de vos données</li>
                <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré</li>
              </ul>
              <p className="mt-3">
                Pour exercer ces droits, contactez-nous à : cnd.secretariat@icrsp.org
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-semibold text-ink">9. Sécurité des données</h2>
              <p>
                Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour 
                protéger vos données personnelles contre tout accès non autorisé, toute perte ou 
                toute destruction. Le site utilise un protocole HTTPS pour sécuriser les échanges 
                de données.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-semibold text-ink">10. Cookies</h2>
              <p>
                Notre site utilise des cookies strictement nécessaires au fonctionnement du site 
                (gestion du panier, authentification). Ces cookies techniques ne nécessitent pas 
                votre consentement. Nous n'utilisons pas de cookies à des fins publicitaires ou 
                de suivi.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-semibold text-ink">11. Modifications</h2>
              <p>
                Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. 
                Toute modification sera publiée sur cette page avec une nouvelle date de mise à jour.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-semibold text-ink">12. Réclamation</h2>
              <p>
                Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une 
                réclamation auprès de la Commission Nationale de l'Informatique et des Libertés (CNIL) :
              </p>
              <div className="mt-2 pl-6">
                <p>CNIL - 3 Place de Fontenoy</p>
                <p>TSA 80715 - 75334 PARIS CEDEX 07</p>
                <p>Tél : 01 53 73 22 22</p>
                <p>Site web : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent-hover hover:underline">www.cnil.fr</a></p>
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-base font-semibold text-ink">13. Contact</h2>
              <p>
                Pour toute question concernant cette politique de confidentialité ou l'exercice de vos droits, 
                vous pouvez nous contacter :
              </p>
              <div className="mt-2 pl-6">
                <p>Email : cnd.secretariat@icrsp.org</p>
                <p>Adresse : 334 Rue du Pioch de Boutonnet, 34090 Montpellier</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolitiqueConfidentialite;
