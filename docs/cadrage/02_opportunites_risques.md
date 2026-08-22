# 02 — Opportunités, menaces et risques

> Phase de cadrage BC01 — Cours Notre-Dame (Montpellier). Fait suite à `01_contexte_parties_prenantes.md`. Tous les faits proviennent de `00_scenario.md`.

## 1. SWOT du projet

Je cartographie les forces, faiblesses, opportunités et menaces de la boutique d'uniformes, à partir de l'analyse du besoin (`01` §3) et de l'audit de l'existant (§2 ci-dessous).

| **Forces (internes / positives)** | **Faiblesses (internes / négatives)** |
|---|---|
| **Socle applicatif déjà développé et fonctionnel** (front React/TS + back Express/Knex, auth, panier, commandes, stock par taille) : time-to-market court | **Bus factor de 1** : un seul développeur bénévole porteur ; aucune compétence dev interne à l'école |
| **Intégration SumUp** alignée sur l'outil **déjà utilisé** par l'école (TPE) : pas de nouveau compte marchand, encaissements centralisés | **Hébergement actuel fragile** : VM sur le **poste personnel** du développeur (Dokploy + Cloudflare) → disponibilité et pérennité incertaines |
| **Notification Telegram sur-mesure déjà opérationnelle** (message + boutons « collectée / annuler ») : exactement le besoin de la secrétaire | **Dépendances externes** : SumUp (paiement) et Telegram (notification) sont des *single points of failure* |
| **Coût quasi nul** : réalisation bénévole, seul le domaine `app-all.fr` (13 € / 3 ans) est engagé | **Dette technique résiduelle** : dépendance `stripe` non utilisée à retirer ; **seeds avec mots de passe par défaut** (`admin123`) à proscrire en production |
| **Petite échelle maîtrisée** : 31 familles, ~100 articles, faible trafic → aucun enjeu de montée en charge | **Couverture de tests et CI** à formaliser `[À CONFIRMER : état réel des tests automatisés]` |
| **Maîtrise complète de l'UI/UX et de l'accessibilité** (composants sur-mesure) ; soutien de la direction (commanditaire engagée) | **Sauvegardes** de la base à structurer (pas de stratégie documentée à ce stade) |

| **Opportunités (externes / positives)** | **Menaces (externes / négatives)** |
|---|---|
| **Réplicabilité** à d'autres écoles du réseau ICRSP ou établissements hors contrat | **Évolution des CGU / tarifs de SumUp** ou de l'API Telegram (services tiers gratuits ou à commission) |
| **Valorisation** : portfolio + certification RNCP39583 ; image positive pour l'école (service rendu aux familles) | **Échec d'adoption** : si l'outil n'est pas plus simple que le tableur, retour aux anciennes habitudes |
| **Sobriété écologique** : application légère, faible trafic, pas de datacenter 24/7 dédié | **Risque RGPD** : mauvaise gestion des données des parents (comptes, emails, commandes) → sanction / atteinte à l'image |
| **Pérennisation** : reprise possible de l'hébergement par l'école sur son infrastructure | **Dépendance au développeur tiers** du site statique pour récupérer/initier l'hébergement côté école (peu réactif) |
| **Inclusion** : un site conforme RGAA AA élargit l'accès (parents âgés, situations de handicap) | **Évolution de l'écosystème** (montées majeures Node / React / Electron) cassant des dépendances |

**Impact environnemental du projet.** La solution est **légère et locale** : une application web servant ~100 fiches produit à un public de 31 familles, sans transcodage ni traitement lourd, hébergée sur une machine déjà allumée (ou un petit VPS), exposée via Cloudflare. Le trafic est marginal (pics à la rentrée). Comparée à une plateforme SaaS mutualisée (CDN multi-régions, services toujours actifs), l'empreinte d'usage est très faible, au prix d'une élasticité dont le projet n'a pas besoin. Pistes de sobriété : images optimisées (compression, formats modernes), cache HTTP, base SQLite/PostgreSQL compacte, pas de dépendances superflues (retrait de `stripe`).

## 2. Démarche d'audit de l'existant

[C1.2.2 — ÉLIMINATOIRE]

J'ai conduit un audit de l'environnement actuel de l'école et du socle technique disponible. Objectif triple : (i) qualifier la faisabilité, (ii) révéler les contraintes non visibles à l'énoncé du besoin, (iii) confirmer que le périmètre tient dans une réalisation bénévole maintenable.

### 2.1 Méthodologie de l'audit (trois axes)

| Axe | Objet | Méthode |
|---|---|---|
| **Axe 1 — Besoin & organisation** | Processus de vente/échange actuel, rôles, attentes | Échanges informels avec la direction (Isabelle Marié, Ghyslaine de Gouttes) |
| **Axe 2 — Existant fonctionnel** | Le **tableur partagé** servant de catalogue et de petites annonces | Revue du fonctionnement, des irritants, des données saisies |
| **Axe 3 — Socle technique** | Le dépôt `CND-Uniformes` et sa chaîne de déploiement | Revue du code (front/back, migrations, routes), de l'auth, des intégrations SumUp/Telegram, du déploiement Dokploy/Cloudflare/OVH |

### 2.2 Livrables produits par l'audit

- **Synthèse des irritants** du processus tableur (base de la problématique `01` §5)
- **Inventaire du socle technique** : pile, modèle de données, routes API, intégrations, déploiement
- **Liste des contraintes** (techniques / fonctionnelles / juridiques / humaines) — base de la cartographie des risques §4

### 2.3 Constats principaux issus de l'audit

1. **Tableur désordonné** : double saisie parents + école, annonces obsolètes non retirées, pas de vue de stock **par taille**, encaissement manuel séparé.
2. **Socle technique mûr** : modèle de données propre (`products`, `product_inventory` unique par couple produit/taille, `orders`/`order_items`, `temp_orders`, `users`, `refresh_tokens`), **auth JWT** (access 15 min + refresh 7 j, cookies `httpOnly`/`secure`/`sameSite=strict`, bcrypt, rôles), **SumUp** (route + webhook) et **Telegram** (notification + boutons inline) déjà branchés.
3. **Hébergement personnel fragile** : VM Ubuntu sur le poste du développeur (Dokploy + Cloudflare), disponibilité dépendante de la machine.
4. **Points de sécurité à durcir** : seeds avec mots de passe par défaut (`admin123` / `user123`), secrets JWT avec valeurs de repli en dur dans le code, dépendance `stripe` inutilisée.
5. **Données personnelles** limitées aux **parents** (nom, email, commandes) ; aucune donnée d'enfant → périmètre RGPD restreint mais réel.
6. **Sauvegardes** de la base non formalisées.

### 2.4 Avis critique sur la faisabilité technique

Je juge la faisabilité **bonne**. **Premièrement**, le socle couvre déjà l'essentiel du périmètre cible : la mission consiste surtout à **fiabiliser, sécuriser, accessibiliser et finaliser** plutôt qu'à partir d'une page blanche. **Deuxièmement**, la **volumétrie est négligeable** (~100 articles, 31 familles, pics ponctuels) : aucun enjeu de performance ni de mise à l'échelle. **Troisièmement**, les deux intégrations sensibles (**SumUp**, **Telegram**) sont déjà fonctionnelles. **Quatrièmement**, la cible **RGAA AA** est atteignable sur une application web maîtrisée respectant ARIA dès la conception. **Aucun blocage technique éliminatoire** : les risques résiduels sont des risques de **pérennité (hébergement), de sécurité à durcir, et d'adoption**, traités en §4.

## 3. Diagnostic des infrastructures

| Composant | Existant | Limites | Préconisation |
|---|---|---|---|
| **Hébergement applicatif** | VM Ubuntu sur poste personnel du développeur, orchestrée par **Dokploy**, exposée via **Cloudflare** | Disponibilité dépendante d'une machine perso (extinction, coupure) ; pérennité non garantie | **Migrer vers un petit VPS dédié** (ex. ~5 €/mois) **ou** reprendre l'hébergement côté école ; documenter le déploiement |
| **Nom de domaine** | `app-all.fr` (OVH, 13 € / 3 ans) | Échéance à suivre ; nom générique (non lié à l'école) | Renouvellement ; envisager un sous-domaine de l'école `[À CONFIRMER]` |
| **Paiement** | Compte **SumUp** de l'école (TPE) + intégration en ligne (route + webhook) | Dépendance externe ; commissions par transaction | Sécuriser la vérification de signature du webhook ; suivre les CGU |
| **Notification** | **Telegram** (bot + smartphone de la secrétaire) | Dépendance à un service tiers ; un seul destinataire configuré | Documenter la reconfiguration du `chat_id` ; prévoir un canal de repli (email via nodemailer déjà présent) |
| **Base de données** | **SQLite** en dev, **PostgreSQL** en prod (Knex) | Sauvegardes non formalisées | **Stratégie de sauvegarde** (dump périodique chiffré, hors machine) + test de restauration |
| **Front / CDN** | React build servi (nginx) derrière Cloudflare | — | Cache statique, optimisation des images |

## 4. Cartographie des risques techniques et fonctionnels

Risques cotés en probabilité (P) et impact (I) sur une échelle 1-5 (référentiel §5). Criticité = P × I. Tableau trié par criticité décroissante.

| ID | Risque | Type | P | I | Criticité | Mitigation |
|---|---|---|---|---|---|---|
| **R02** | **Indisponibilité de l'hébergement** (VM sur poste perso éteinte, coupure, perte de la machine) | Technique | 4 | 4 | **16** | Migrer vers un VPS dédié ou l'hébergement de l'école ; supervision *uptime* ; déploiement documenté et reproductible (Docker) |
| **R08** | **Perte de données** (base non sauvegardée correctement) | Technique | 3 | 5 | **15** | Sauvegardes périodiques chiffrées hors machine ; test de restauration trimestriel ; écritures transactionnelles (déjà en place côté produits) |
| **R01** | **Échec d'adoption** : la secrétaire revient au tableur si l'outil n'est pas plus simple | Humain / fonctionnel | 3 | 4 | **12** | Back-office épuré ; formation courte ; notification Telegram qui apporte un gain immédiat ; accompagnement au démarrage |
| **R03** | **Indisponibilité du développeur bénévole** (bus factor 1) | Humain | 3 | 4 | **12** | Documentation, code lisible (lint), README de reprise ; dépôt Git remis à l'école ; choix de technos courantes |
| **R07** | **Failles de sécurité** (mots de passe par défaut, secrets en dur, OWASP) | Technique / sécurité | 3 | 4 | **12** | Suppression des comptes/seeds par défaut en prod ; secrets en variables d'environnement ; revue OWASP (cf. `05`) ; `npm audit` |
| **R11** | **Non-conformité RGAA AA** sur les parcours publics | Fonctionnel | 3 | 3 | **9** | Composants ARIA dès la conception ; audit `axe-core` ; tests clavier/lecteur d'écran avant mise en service |
| **R04** | **Non-conformité RGPD** (données parents : registre, base légale, effacement) | Juridique | 2 | 4 | **8** | Registre des traitements simplifié ; mention d'information + politique de confidentialité (déjà présente) ; droit à l'effacement ; minimisation |
| **R05** | **Indisponibilité / changement SumUp** (CGU, tarif, panne) | Technique / externe | 2 | 4 | **8** | Vérification signature webhook ; gestion des paiements en échec ; **repli encaissement TPE** sur place possible |
| **R10** | **Litige sur une commande** (article indisponible après paiement, remboursement) | Fonctionnel | 2 | 3 | **6** | Décrément de stock atomique à la commande ; statut commande clair ; procédure de remboursement SumUp ; CGV |
| **R12** | **Dépendance au développeur tiers** du site statique pour la reprise d'hébergement | Humain / externe | 3 | 2 | **6** | Solution autonome sur `app-all.fr` indépendante du site statique ; reprise école optionnelle |
| **R06** | **Indisponibilité de l'API Telegram** (notification non délivrée) | Technique / externe | 2 | 2 | **4** | Commande tout de même enregistrée ; consultation possible dans le back-office ; repli email |
| **R09** | **Dette technique / dépendances obsolètes** (`stripe` résiduel, montées de version) | Technique | 2 | 2 | **4** | Nettoyage des dépendances ; lockfile ; veille (cf. `03`) ; versions LTS |

**Bilan** : **2 risques en action immédiate** (R02 hébergement, R08 sauvegardes — criticité ≥ 13), **8 risques à surveiller** (criticité 6-12), **2 risques acceptables** (criticité ≤ 5). Les deux priorités absolues — **pérennité de l'hébergement** et **sauvegardes** — sont les vrais points durs de ce projet, davantage que le développement lui-même.

## 5. Référentiel d'évaluation des risques

Cotation alignée sur les pratiques ISO 31000, simplifiée pour rester lisible par une direction non technique.

### 5.1 Grille — Probabilité

| Niveau | Libellé | Définition |
|---|---|---|
| 1 | Très improbable | Aucun précédent, scénario théorique (<5 %) |
| 2 | Improbable | Rare dans des projets similaires (~5-20 %) |
| 3 | Possible | Déjà observé dans des projets comparables (~20-50 %) |
| 4 | Probable | Chances sérieuses (~50-80 %) |
| 5 | Quasi-certain | Se produira sauf action proactive (>80 %) |

### 5.2 Grille — Impact

| Niveau | Libellé | Définition |
|---|---|---|
| 1 | Négligeable | Gêne mineure absorbée sans action |
| 2 | Mineur | Retard de quelques jours, sans effet sur la livraison |
| 3 | Modéré | Un objectif secondaire compromis ; correction d'une à deux semaines |
| 4 | Majeur | Fonctionnalité clé amputée, données ou paiement impactés, ou contentieux léger |
| 5 | Critique | Service à l'arrêt, perte de données, ou contentieux lourd |

### 5.3 Seuils d'alerte (criticité = P × I)

| Plage | Niveau | Conduite à tenir |
|---|---|---|
| 1 – 5 | Acceptable | Tracer, aucune action active ; réévaluer périodiquement |
| 6 – 12 | À surveiller | Mitigation documentée, propriétaire désigné, revue régulière |
| 13 – 25 | Action immédiate | Mitigation prioritaire à engager sans délai, escalade à la direction |

### 5.4 Fréquence de revue

- **Phase de développement** (été 2026) : revue **hebdomadaire** du registre des risques.
- **Après mise en service** : revue **mensuelle** la première rentrée, puis trimestrielle.

### 5.5 Format de suivi

Registre tenu dans un tableau de bord simple (fichier versionné ou tableur partagé) : ID, libellé, type, P, I, criticité, propriétaire, mitigation, date d'identification, date de revue, statut (ouvert / surveillé / clos).

## 6. Indicateurs de contrôle

| Indicateur | Définition | Cible | Fréquence | Source |
|---|---|---|---|---|
| **Disponibilité (uptime)** | % de disponibilité du site sur 30 jours | ≥ 99 % | Continue (supervision) | Sonde de supervision (cf. `05`/BC04) |
| **Taux d'adoption** | % des commandes d'uniformes passées **via le site** (vs hors site) | ≥ 70 % à la 1ʳᵉ rentrée | Mensuelle | Base `orders` |
| **Délai de traitement** | Temps moyen entre commande payée et statut « collectée » | < 7 jours | Mensuelle | Statuts `orders` |
| **Taux de paiement en ligne** | % des commandes payées en ligne (SumUp) vs sur place | ≥ 60 % | Mensuelle | `orders.payment_method` |
| **Couverture de tests** | % du back-end couvert par les tests automatisés | ≥ 70 % à la livraison | À chaque commit (CI) | Rapport de couverture |
| **Anomalies par sprint** | Tickets d'anomalie ouverts par itération | ≤ 5 (dev) ; ≤ 2 / mois (run) | Par sprint puis mensuelle | Suivi des incidents |

Ces indicateurs combinent **garde-fous qualité** (uptime, tests, anomalies) et **mesure d'usage réel** (adoption, paiement en ligne, délai) pour détecter au plus tôt un éventuel abandon de l'outil.

---

*Fin du livrable 02. Suite : `03_veille_etude_technique.md`.*
