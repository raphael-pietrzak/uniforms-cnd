# 03 — Veille et étude technique

> Phase de cadrage BC01 — Cours Notre-Dame (Montpellier). Fait suite à `01` et `02`. Instruit les 4 pistes de `01` §5 et arbitre la pile technique.

## 1. Méthodologie de veille

Veille structurée et tracée, en trois finalités : (i) **technologique** (pile React/Node, dépendances), (ii) **réglementaire** (RGAA, RGPD, paiement), (iii) **concurrentielle** (solutions e-commerce existantes, pour ne pas réinventer la roue).

### 1.1 Objectifs de veille

1. **Suivre l'API et les conditions de SumUp** (tarifs, CGU, évolutions du checkout / des webhooks) — couvre le risque R05.
2. **Suivre l'API Telegram Bot** (méthodes `sendMessage`, callbacks inline, webhooks) — couvre R06.
3. **Anticiper RGAA et RGPD** applicables à un site marchand traitant des données de parents (comptes, emails, commandes) — couvre R04 et R11.
4. **Surveiller la sécurité du paiement en ligne** (PCI-DSS, OWASP Top 10) pour un site qui encaisse — couvre R07.
5. **Suivre l'écosystème** React / Node / Express / Vite / Knex pour anticiper les ruptures de compatibilité — couvre R09.

### 1.2 Sources sélectionnées

| Source | Type | Fréquence | Outil de collecte |
|---|---|---|---|
| **SumUp Developer** (developer.sumup.com) — API & changelog | Technique | Mensuelle | Flux + alerte e-mail |
| **Telegram Bot API** (core.telegram.org/bots/api) | Technique | À chaque évolution | Page changelog |
| **GitHub Releases** — `facebook/react`, `nodejs/node`, `expressjs/express`, `vitejs/vite`, `knex/knex` | Notes de version | À chaque release | GitHub Watch « Releases only » |
| **MDN Web Docs** (ARIA, Web APIs) | Standard web | Hebdomadaire | Feedly |
| **OWASP Top 10 + Cheat Sheets** | Sécurité | Trimestrielle | Feedly + bookmark |
| **CNIL** — fiches « e-commerce » et « associations / petites structures » | Réglementaire RGPD | Mensuelle | Newsletter CNIL |
| **numerique.gouv.fr — RGAA** | Réglementaire accessibilité | Mensuelle | Newsletter DINUM |
| **GitHub Trending** (topics `ecommerce`, `react`) | Concurrentielle | Hebdomadaire | GitHub Trending |

Agrégateur unique : **Feedly** (compte gratuit), organisé en 4 dossiers thématiques. **GitHub Watch** « Releases only » sur les 5 dépôts critiques. **Alertes e-mail** sur « SumUp API pricing », « Telegram Bot API changelog », « RGAA 5 ».

### 1.3 Cadence et restitution

**1 heure par semaine** (lundi matin) pendant la réalisation. Consolidation mensuelle dans un fichier **`veille.md`** versionné à la racine du dépôt, structuré selon les 4 objectifs. Revue des décisions de montée de version au fil de l'eau.

## 2. Synthèse de la veille

Cinq trouvailles retenues pour leur impact direct.

1. **SumUp Online Payments propose un *checkout* hébergé et des webhooks**, sans abonnement mensuel (commission par transaction). → *Impact :* confirme la pertinence de SumUp **déjà utilisé par l'école**, et oriente l'architecture vers un **paiement délégué** (l'app ne manipule jamais les données de carte).

2. **PCI-DSS — périmètre réduit (SAQ-A) en déléguant le paiement.** En redirigeant vers le *checkout* SumUp (ou un SDK hébergé), **aucune donnée de carte ne transite ni n'est stockée** par l'application. → *Impact :* le risque carte est porté par SumUp ; l'effort de conformité de l'app se concentre sur l'authentification, les données parents et l'OWASP applicatif.

3. **RGAA 4.1.2 reste la version en vigueur en France (2026).** → *Impact :* cible **RGAA 4.1.2 niveau AA** sur les parcours publics (catalogue → fiche → panier → paiement → compte), vérifiée par `axe-core` + tests clavier/lecteur d'écran.

4. **CNIL — petites structures & e-commerce.** Base légale recevable : **exécution du contrat de vente** (gestion des commandes) et **intérêt légitime** (compte). Obligations proportionnées : registre simplifié, information claire, **droit à l'effacement**, minimisation. → *Impact :* registre minimal + politique de confidentialité (déjà présente dans le socle) + procédure d'effacement.

5. **Coût et maintenance des plateformes tierces.** Les SaaS (type Shopify) facturent un **abonnement mensuel** + commission ; les CMS auto-hébergés (WordPress/WooCommerce) concentrent une **part majeure des vulnérabilités web** via leurs extensions. → *Impact :* renforce l'intérêt d'une solution **sur-mesure, sobre et sans coût récurrent**, alignée sur le « coût quasi nul » exigé.

## 3. Étude comparative des solutions techniques

[C1.3.2 — ÉLIMINATOIRE]

J'instruis les 4 pistes de `01` §5 selon 8 critères pondérés sur 5, alignés sur les attentes de la direction.

### 3.1 Critères d'évaluation

| # | Critère | Pondération | Justification |
|---|---|---|---|
| 1 | **Coût récurrent** | 5 | « Coût quasi nul » exigé (réalisation bénévole) |
| 2 | **Intégration SumUp** | 5 | Paiement imposé (compte école existant) |
| 3 | **Notification Telegram sur-mesure** | 4 | Besoin opérationnel clé de la secrétaire |
| 4 | **Accessibilité RGAA AA** | 4 | Inclusion des familles ; image de l'école |
| 5 | **Adéquation petite échelle / simplicité admin** | 4 | 31 familles, ~100 articles ; back-office tenu par une non-technicienne |
| 6 | **Contrôle des données / RGPD / souveraineté** | 4 | Données des parents ; éviter l'hébergement hors UE |
| 7 | **Maintenance solo (bus factor)** | 3 | Un seul développeur bénévole |
| 8 | **Sécurité (paiement, OWASP)** | 4 | Site marchand encaissant des paiements |

**Total des pondérations** : 33 → score maximal = 33 × 5 = **165**.

### 3.2 Tableau comparatif

Note brute sur 5 par critère (pondération rappelée en tête de ligne).

| Critère (pond.) | A. SaaS clé en main (Shopify/Wix) | B. CMS auto-hébergé (WooCommerce) | C. Statu quo amélioré (Forms+Sheets) | **D. Sur-mesure React+Express (retenue)** |
|---|---|---|---|---|
| **1. Coût récurrent** (×5) | 1 — abonnement mensuel + commission | 3 — gratuit en licence, mais hébergement + maintenance | 5 — gratuit | **5 — bénévole, domaine 13 €/3 ans** |
| **2. Intégration SumUp** (×5) | 2 — non natif (pousse ses propres moyens de paiement) | 3 — extension tierce de qualité variable | 1 — pas de paiement intégré | **5 — intégration native déjà développée** |
| **3. Notification Telegram** (×4) | 2 — via app tierce / Zapier payant | 3 — plugin/webhook à bricoler | 2 — script Apps Script possible | **5 — bot + boutons inline déjà opérationnels** |
| **4. Accessibilité RGAA AA** (×4) | 3 — thèmes partiellement accessibles | 2 — thèmes inégaux | 2 — formulaires Google limités | **5 — composants ARIA maîtrisés** |
| **5. Petite échelle / simplicité** (×4) | 4 — simple mais surdimensionné | 2 — lourd pour ~100 articles | 3 — léger mais ne gère pas stock/commande | **5 — calibré exactement au besoin** |
| **6. Données / RGPD** (×4) | 2 — données chez l'éditeur (hors UE possible) | 4 — auto-hébergé | 2 — données chez Google | **5 — auto-hébergé, données maîtrisées** |
| **7. Maintenance solo** (×3) | 4 — géré par l'éditeur | 2 — MAJ sécurité plugins fréquentes | 4 — rien à maintenir | **4 — techno courante + doc (bus factor mitigé)** |
| **8. Sécurité** (×4) | 4 — PCI géré, surface large | 2 — cible massive, extensions vulnérables | 3 — pas de carte, peu de contrôle | **4 — JWT durci + PCI délégué SumUp + OWASP** |
| **Total brut (/40)** | 22 | 21 | 22 | **38** |
| **Total pondéré (/165)** | **87** | **88** | **90** | **158** |

*Détail du calcul pondéré de la solution retenue (D)* : (5×5)+(5×5)+(5×4)+(5×4)+(5×4)+(5×4)+(4×3)+(4×4) = 25+25+20+20+20+20+12+16 = **158 / 165**.

La solution **sur-mesure (D)** l'emporte largement (158 vs 87-90). Les trois alternatives échouent chacune sur un critère **rédhibitoire** : le SaaS sur le **coût récurrent** et l'intégration SumUp ; le CMS sur la **sécurité/maintenance** et le surdimensionnement ; le statu quo sur la **couverture fonctionnelle** (ni paiement, ni stock par taille, ni notification). Le statu quo obtient un total proche uniquement grâce à sa gratuité, mais ne résout **aucune** des douleurs centrales.

### 3.3 Justification du choix retenu

**Pourquoi le sur-mesure (React 18 + TypeScript / Express + Knex).** Il offre la **maîtrise complète de l'UX et de l'accessibilité** (composants ARIA testables un à un), une **intégration native de SumUp et de Telegram déjà fonctionnelle**, un **coût d'exploitation minime**, et un périmètre **exactement calibré** à une petite structure. Le **socle existe déjà** (`00` §7), ce qui réduit la charge et fiabilise le chiffrage (`04`). Les données restent **auto-hébergées** (souveraineté, RGPD).

**Volet sécurité.** Modèle de menace d'un site marchand exposé sur Internet, en défense en profondeur :
- **Paiement délégué à SumUp** → aucune donnée de carte stockée (périmètre **PCI-DSS SAQ-A**) ; **vérification de la signature du webhook** SumUp.
- **Authentification** : JWT access court (15 min) + refresh (7 j) en **cookies `httpOnly` / `secure` / `sameSite=strict`** (anti-XSS/CSRF), **bcrypt**, rôles `user`/`admin`, nettoyage des refresh tokens.
- **OWASP** : validation des entrées (`express-validator`), **limitation de débit** (`express-rate-limit`) sur l'auth, **secrets en variables d'environnement** (suppression des valeurs de repli en dur), **suppression des comptes/seeds par défaut** en production, `npm audit` en intégration continue, en-têtes de sécurité (CSP, HSTS via Cloudflare/nginx), upload d'images validé (type/taille).
- **Sauvegardes** chiffrées de la base (mitigation R08).

Ces mesures couvrent les risques R04, R05, R07, R08 de `02` §4.

## 4. Ressources matérielles et techniques requises

### 4.1 Matériel / hébergement

- **Hébergement applicatif** : actuellement VM Ubuntu (poste perso) + Dokploy + Cloudflare ; **cible recommandée : petit VPS dédié** (~5 €/mois) ou reprise par l'école (mitigation R02).
- **Nom de domaine** : `app-all.fr` (OVH, 13 € / 3 ans).
- **Côté école** : poste du secrétariat (back-office), **smartphone de la secrétaire** (notifications Telegram), compte **SumUp** existant.

### 4.2 Logiciel — pile technique retenue

- **Frontend** : React 18 + TypeScript, Vite 5, React Router 6, Tailwind 3, lucide-react.
- **Backend** : Node.js (LTS), Express 4, Knex 3 (**SQLite** dev / **PostgreSQL** prod), JWT (`jsonwebtoken`) + `bcrypt`, `multer` (upload), `nodemailer` (emails), `express-validator`, `express-rate-limit`, `axios` (SumUp/Telegram), `cookie-parser`, `cors`, `dotenv`.
- **Industrialisation** : Docker + docker-compose, nginx (prod), Cloudflare, déploiement Dokploy ; ESLint. **À mettre en place** : tests automatisés (ex. Vitest/Jest + supertest) et CI (lint + audit + tests), nettoyage de la dépendance `stripe`.

### 4.3 Services externes

- **SumUp** : compte de l'école, clés API, webhook de paiement (signature vérifiée).
- **Telegram** : bot dédié (`TELEGRAM_BOT_TOKEN`), `chat_id` de la secrétaire, webhook callback.
- **Cloudflare** (DNS/proxy/HTTPS), **OVH** (domaine).

### 4.4 Ressources humaines

- **1 développeur bénévole** (moi) : cadrage, développement, livraison, accompagnement.
- **Référente recette** : **Ghyslaine de Gouttes** (secrétaire), garante de l'usage réel (saisie, commandes, notification).
- **Validation** : **Isabelle Marié** (directrice), go/no-go et mise en service.

---

*Fin du livrable 03. Suite : `04_perimetre_chiffrage.md`.*
