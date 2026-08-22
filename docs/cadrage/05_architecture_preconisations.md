# 05 — Architecture, sécurité et préconisations

> Phase de cadrage BC01 — Cours Notre-Dame (Montpellier). Clôt le dossier : architecture logicielle, modèle de données, sécurité (OWASP), RGPD, impact environnemental et argumentaire de décision pour la direction.

## 1. Architecture logicielle

[C1.5]

**Choix de modélisation.** Architecture **client-serveur en 3 tiers** : une **SPA React** (présentation), une **API REST Express** (logique métier), une **base relationnelle** (persistance), avec des **services externes** pour le paiement, la notification et l'email. Formalisme : schéma de composants + flux (légende ci-dessous). Ce style est retenu pour sa **séparation des responsabilités**, sa **maintenabilité** (chaque tier évolue indépendamment) et sa **sécurité** (le navigateur ne parle jamais directement à la base ni aux secrets).

### 1.1 Schéma d'architecture

```text
   [Parent: navigateur web]            [Secrétaire: smartphone Telegram]
            │  HTTPS                                  │
            ▼                                         │
   ┌───────────────────┐                              │
   │   CLOUDFLARE       │  (DNS app-all.fr, TLS, proxy/CDN, cache statique)
   └───────────────────┘                              │
            │                                         │
            ▼                                         │
   ┌───────────────────────────────────────┐         │
   │  HÉBERGEMENT (Docker / Dokploy)        │         │
   │  ┌─────────────┐   ┌────────────────┐  │         │
   │  │ nginx       │   │ API Express    │  │         │
   │  │ (front React│──▶│ (Node.js)      │  │         │
   │  │  statique)  │   │  routes:       │  │         │
   │  └─────────────┘   │  auth/products │  │         │
   │                    │  orders/upload │  │         │
   │                    │  sumup/telegram│  │         │
   │                    └───────┬────────┘  │         │
   │                            │ Knex       │         │
   │                    ┌───────▼────────┐  │         │
   │                    │ PostgreSQL     │  │         │
   │                    │ (SQLite en dev)│  │         │
   │                    └────────────────┘  │         │
   └─────────┬───────────────┬──────────────┘         │
             │               │                        │
       (HTTPS sortant)  (HTTPS sortant)          (webhook entrant)
             ▼               ▼                        ▼
      ┌────────────┐   ┌────────────┐          ┌──────────────┐
      │  SumUp      │   │  SMTP       │          │ Telegram Bot │
      │ (checkout + │   │ (nodemailer)│          │ API          │
      │  webhook)   │   └────────────┘          └──────────────┘
      └────────────┘
```

**Légende :** rectangles = composants déployés ; cylindres = base de données ; flèches pleines = appels synchrones (HTTP/SQL) ; « webhook » = appel asynchrone entrant. Couleurs à reproduire en Canva : front (bleu), API (vert), base (gris), services externes (orange).

### 1.2 Interactions principales

- **Achat** : navigateur → Cloudflare → nginx (SPA) ; la SPA appelle l'API (`/api/products`, `/api/orders`) ; le paiement redirige vers le **checkout SumUp**, qui confirme via **webhook** → la commande passe `paid`.
- **Notification** : à la création/au paiement d'une commande, l'API appelle l'**API Telegram** → message + boutons sur le smartphone de la secrétaire ; le **callback** (bouton) revient en webhook et met le statut à `collected`.
- **Administration** : la secrétaire (rôle `admin`) gère produits/stock/commandes via des routes protégées (`verifyToken` + `verifyAdmin`).

L'architecture est **maintenable** (tiers découplés, technos courantes), **sécurisée** (secrets et base isolés côté serveur, paiement délégué) et **extensible** (ajout d'un fournisseur d'email, d'un second canal de notification, ou d'un module sans refonte).

## 2. Modèle de données

Modèle relationnel (Knex), cohérent avec les migrations existantes.

```text
users (id, username, email, password[bcrypt], role[user|admin], timestamps)
   │ 1
   │ ──< refresh_tokens (id, user_id, token, created_at)
   │
products (id, name, description, price, condition[new|used], brand, gender, category, images[json], timestamps)
   │ 1
   ├──< product_inventory (id, product_id, size, quantity)   UNIQUE(product_id, size)
   │
orders (id, total, status[pending|paid|ready|collected], payment_method,
         customer_name, customer_email, telegram_message_id, notification_sent_at, timestamps)
   │ 1
   └──< order_items (id, order_id, product_id, quantity, selected_size)

temp_orders (id, checkout_id UNIQUE, order_details[json], timestamps)   ← tunnel de paiement SumUp
```

**Points clés** : stock géré **par taille** (`product_inventory`, unicité `product_id`+`size`) pour absorber les tailles hétérogènes (lettres et âges) ; `temp_orders` isole les commandes en attente de confirmation de paiement ; suppression en cascade `orders → order_items` et `products → product_inventory`.

## 3. Sécurité (OWASP Top 10)

| Risque OWASP 2021 | Mesure dans le projet |
|---|---|
| **A01 — Broken Access Control** | Middlewares `verifyToken`, `verifyAdmin`, `verifyResourceOwnership` ; routes d'écriture produits/commandes réservées `admin` ; `ProtectedRoute` côté front |
| **A02 — Cryptographic Failures** | Mots de passe **bcrypt** ; cookies `secure` + TLS (Cloudflare) ; secrets en **variables d'environnement** (suppression des valeurs de repli en dur) |
| **A03 — Injection** | **Knex** (requêtes paramétrées) ; validation des entrées (`express-validator`) |
| **A04 — Insecure Design** | **Paiement délégué à SumUp** (aucune donnée de carte) ; séparation des rôles ; tunnel `temp_orders` |
| **A05 — Security Misconfiguration** | **Suppression des seeds/compte par défaut** (`admin123`) en production ; CORS restreint à l'origine front ; en-têtes de sécurité (CSP/HSTS via nginx/Cloudflare) |
| **A06 — Vulnerable Components** | `npm audit` en CI ; `package-lock.json` versionné ; **retrait de `stripe`** inutilisé ; versions LTS |
| **A07 — Identification & Auth Failures** | JWT access court (15 min) + refresh (7 j) en cookie `httpOnly`/`sameSite=strict` ; rotation/nettoyage des refresh tokens ; **rate limiting** (`express-rate-limit`) sur l'auth |
| **A08 — Software & Data Integrity** | **Vérification de la signature du webhook SumUp** ; lockfile ; déploiement reproductible (Docker) |
| **A09 — Logging & Monitoring** | Journalisation des erreurs ; supervision *uptime* et alertes (détaillé en BC04) |
| **A10 — SSRF** | Aucun appel sortant piloté par une URL utilisateur ; destinations externes fixes (SumUp, Telegram, SMTP) |

## 4. Conformité RGPD

- **Données traitées** : parents uniquement — nom, email, mot de passe (haché), historique de commandes. **Aucune donnée d'enfant.**
- **Bases légales** : **exécution du contrat** de vente (commande, paiement, retrait) ; **intérêt légitime** (compte parent).
- **Minimisation & conservation** : seules les données utiles à la commande ; durée de conservation définie `[À CONFIRMER avec l'école]` puis purge.
- **Droits** : information claire (page **Politique de confidentialité** déjà présente) ; **droit d'accès et d'effacement** implémenté ; consentement explicite hors nécessité contractuelle.
- **Hébergement** : dans l'**UE** (VPS/OVH, Cloudflare avec localisation UE) → pas de transfert hors UE non encadré.
- **Registre des traitements** simplifié (petite structure) remis à l'école ; la **sécurité** (section 3) constitue une mesure RGPD.

## 5. Impact environnemental

Solution **sobre** : application légère (~100 fiches, 31 familles), trafic faible avec pics ponctuels à la rentrée, **hébergement mutualisé / petit VPS** plutôt qu'un cluster cloud surdimensionné. Leviers : **images optimisées** (compression, formats modernes, dimensions adaptées), **cache statique** (Cloudflare), base compacte, **suppression des dépendances inutiles** (`stripe`). Comparée à une plateforme SaaS toujours active et multi-régions, l'empreinte d'usage est nettement inférieure, sans perte fonctionnelle pour ce besoin.

## 6. Préconisations et argumentaire de décision

[C1.6]

### 6.1 Décisions préconisées

1. **Développer la solution sur-mesure** (socle existant fiabilisé) plutôt qu'un SaaS payant ou un CMS lourd (cf. `03` §3).
2. **Conserver SumUp** (paiement) et **Telegram** (notification) — déjà en place et adaptés.
3. **Sortir l'hébergement du poste personnel** vers un **petit VPS dédié** (ou l'hébergement de l'école) + **sauvegardes** chiffrées (mitigation R02/R08).
4. **Durcir la sécurité avant mise en service** (secrets en env, suppression des comptes par défaut, signature webhook, `npm audit`).
5. **Viser RGAA AA** sur les parcours publics et formaliser la **conformité RGPD**.

### 6.2 Traitement des objections (argumentaire vulgarisé pour la direction)

| Objection probable | Réponse |
|---|---|
| « On va dépendre de toi. » | Code et documentation **remis à l'école**, technologies **courantes** (un autre développeur peut reprendre) ; le bénévolat n'enferme pas l'école. |
| « Combien ça coûte vraiment ? » | **Quasi rien** : domaine 13 €/3 ans, hébergement ~0-5 €/mois, commissions SumUp seulement quand il y a une vente. La prestation (valeur ≈ 11 100 €) est offerte. |
| « Et si le site tombe en panne le jour de la rentrée ? » | **Sauvegardes** + **supervision** ; et le **paiement par TPE sur place reste possible** en repli — l'école n'est jamais bloquée. |
| « Le paiement en ligne, c'est risqué ? » | **SumUp gère le paiement** : aucune donnée de carte ne passe par notre site (responsabilité et conformité portées par SumUp). |
| « Et les données des familles ? » | Uniquement des **données de parents**, hébergées en **UE**, avec registre RGPD et droit à l'effacement. **Aucune donnée d'enfant.** |
| « Est-ce que ce sera plus simple que notre tableur ? » | Oui : saisie d'un article en quelques minutes, **stock à jour automatiquement**, et **notification Telegram** qui prévient sans rien ouvrir. |

### 6.3 Synthèse

Le projet répond à la problématique (`01` §5) : une **boutique d'uniformes gérée par l'école**, intégrée à **SumUp**, avec **retrait sur place** et **notification temps réel** de la secrétaire, **accessible** et **conforme RGPD**, à **coût quasi nul**, déployable avant la **rentrée 2026**. Les seuls vrais points de vigilance — **hébergement** et **sauvegardes** — sont identifiés et adressés. Je recommande le **go** pour la phase de réalisation.

---

*Fin du livrable 05 et du dossier de cadrage BC01.*
