# 04 — Périmètre fonctionnel et chiffrage

> Phase de cadrage BC01 — Cours Notre-Dame (Montpellier). S'appuie sur le besoin reformulé (`01` §5), la solution sur-mesure arbitrée (`03` §3) et le contexte bénévole (`00` §5). Le périmètre est cartographié sur les **composants réels** du socle `CND-Uniformes` pour prouver qu'il est techniquement adressable sans zone d'ombre.

## 1. Cahier des charges fonctionnel

[C1.4.1 — ÉLIMINATOIRE]

Le périmètre répond aux attentes de la direction (`01` §3 : boutique gérée par l'école, paiement SumUp, retrait sur place, notification de la secrétaire) et aux douleurs du tableur actuel. Chaque fonction est rattachée à une **brique technique existante** (route API ou composant), ce qui prouve la couverture du besoin.

### 1.1 Hiérarchie des fonctions

**Fonctions principales (cœur — indispensables à la mise en service)**

| Fonction | Description | Couverture technique (socle `CND-Uniformes`) |
|---|---|---|
| **F1 — Catalogue & fiches produit** | Présenter les uniformes (photos, prix, état neuf/occasion, description) en grille et en fiche détaillée | `ShopPage`, `ProductDetailPage` ; `GET /api/products`, `GET /api/products/:id` |
| **F2 — Panier & passage de commande** | Ajouter des articles (avec taille/quantité), constituer une commande pour une ou plusieurs tailles | `CartPage`, `ShopContext` ; `POST /api/orders` (`orders` + `order_items`) |
| **F3 — Paiement en ligne (SumUp)** | Payer la commande en ligne via le compte SumUp de l'école | `/api/sumup` (+ **webhook**), `temp_orders` (tunnel), `CheckoutSuccessPage` |
| **F4 — Stock par taille** | Suivre les quantités disponibles **par couple (article, taille)**, hétérogènes selon les marques | `product_inventory` (unique `product_id`+`size`) ; `PATCH /api/products/:id/inventory/:size` |
| **F5 — Back-office administrateur** | Gérer produits, stock et commandes (réservé `admin`) | Pages `/admin/*` ; `products` CRUD (`verifyToken`+`verifyAdmin`) ; `PUT /api/orders/:id/status` |
| **F6 — Notification Telegram à la secrétaire** | Alerter en temps réel d'une nouvelle commande, avec bouton « marquer collectée / annuler » | `routes/telegram.js` (`sendOrderNotification`, webhook callback, `telegram_message_id`) |

**Fonctions secondaires (forte valeur d'usage — incluses)**

| Fonction | Description | Couverture technique |
|---|---|---|
| **F7 — Compte parent & authentification** | Création de compte, connexion, mot de passe oublié/réinitialisé | `AuthContext`, pages login/register/forgot/reset ; `routes/auth` (JWT access+refresh, `bcrypt`, `refresh_tokens`) |
| **F8 — Upload d'images produit** | Associer une ou plusieurs photos à un article | `routes/upload` (`multer`), `/uploads` statiques |
| **F9 — Filtres du catalogue** | Filtrer par catégorie, taille, état (neuf/occasion), genre | `ShopPage` (filtrage) sur le champ `category`, `condition`, `gender`, inventaire |
| **F10 — Cycle de vie de la commande** | Suivre le statut `pending → paid → ready → collected` | `orders.status` ; `PUT /api/orders/:id/status` ; callback Telegram |

**Fonctions complémentaires (confort — incluses, effort maîtrisé)**

| Fonction | Description | Couverture technique |
|---|---|---|
| **F11 — Pages légales & information** | CGV, politique de confidentialité (RGPD), page « tenue attendue » | `CGV`, `PolitiqueConfidentialite`, `Info` |
| **F12 — Mode hors-ligne / résilience** | Page dédiée si l'application n'est pas joignable | `OfflinePage`, `ConnectionGuard` |
| **F13 — Accessibilité RGAA AA** | Focus visible, contrastes, intitulés, navigation clavier/lecteur d'écran (transverse F1-F7) | Composants ARIA dans le front (transverse) |
| **F14 — Emails transactionnels** | Confirmation de commande, réinitialisation de mot de passe | `nodemailer` |

> **Note de périmètre.** La **mise en vente par les parents** (consignation) et la **livraison postale** sont **hors périmètre du MVP** (`00` §6) : le modèle est *boutique gérée par l'école + retrait sur place*. Ce choix réduit la charge et la complexité (gestion de vendeurs multiples, logistique) sans dégrader l'usage cible.

### 1.2 User stories INVEST

Dix user stories couvrant les fonctions ci-dessus et au moins un besoin par persona (`01` §2). Annotées selon les six critères **INVEST**.

1. **En tant que** parent (Sophie), **je veux** parcourir le catalogue avec photos et filtrer par catégorie et taille, **afin de** trouver vite les bons articles. — *I* F1/F9 · *N* nb de filtres · *V* lève la douleur tableur · *E* lot 2 · *S* un écran · *T* filtre ⇒ liste cohérente

2. **En tant que** parent, **je veux** distinguer les articles **neufs** des articles **d'occasion** et voir leur prix, **afin de** choisir selon mon budget. — *I* F1 · *N* présentation · *V* cœur de l'offre · *E* lot 2 · *S* un attribut · *T* état affiché correct

3. **En tant que** parent de plusieurs enfants (Sophie), **je veux** ajouter au panier plusieurs articles/tailles et commander en une fois, **afin de** ne pas multiplier les démarches. — *I* F2 · *N* — · *V* gain de temps · *E* lot 3 · *S* un panier · *T* n articles ⇒ commande à n lignes

4. **En tant que** parent, **je veux** **payer en ligne via SumUp**, **afin de** régler sans passer par le secrétariat. — *I* F3 · *N* moyens de paiement · *V* supprime l'encaissement manuel · *E* lot 4 · *S* un tunnel · *T* paiement validé ⇒ commande `paid`

5. **En tant que** parent nouvel arrivant (Karim), **je veux** comprendre la **tenue attendue**, **afin de** préparer la rentrée sans connaître les usages. — *I* F11 · *N* contenu · *V* lève la douleur n°2 · *E* lot 9 · *S* une page · *T* page claire et à jour

6. **En tant que** parent en situation de fragilité numérique/handicap, **je veux** naviguer et commander **au clavier / lecteur d'écran**, **afin d'**acheter en autonomie. — *I* F13 · *N* périmètre AA · *V* inclusion · *E* lot 8 · *S* par écran · *T* parcours principal validé

7. **En tant que** secrétaire (Ghyslaine), **je veux** ajouter un article et son **stock par taille** en moins de 3 minutes, **afin de** tenir le catalogue à jour facilement. — *I* F5/F4 · *N* champs · *V* sort du tableur · *E* lot 5 · *S* un formulaire · *T* article créé ⇒ visible en boutique avec stock

8. **En tant que** secrétaire, **je veux** être **prévenue par Telegram** d'une nouvelle commande et la **marquer collectée** d'un bouton, **afin de** préparer et remettre sans ouvrir l'ordinateur. — *I* F6/F10 · *N* format message · *V* gain opérationnel majeur · *E* lot 6 · *S* une notif · *T* commande ⇒ message reçu ; bouton ⇒ statut `collected`

9. **En tant que** secrétaire, **je veux** voir les commandes et leur statut, **afin de** suivre ce qui reste à préparer/remettre. — *I* F5/F10 · *N* vue · *V* pilotage · *E* lot 5 · *S* une liste · *T* changement de statut ⇒ liste à jour

10. **En tant que** parent, **je veux** créer un compte et réinitialiser mon mot de passe, **afin de** retrouver mes commandes en sécurité. — *I* F7/F14 · *N* — · *V* confiance · *E* lot 7 · *S* un flux auth · *T* reset ⇒ email + nouveau mot de passe fonctionnel

## 2. Diagramme de fonctionnalités (→ Canva)

Arborescence FAST : fonction de service principale à gauche, déclinée en fonctions techniques. Code couleur par priorité : **principal**, *secondaire*, complémentaire.

```text
GÉRER LA VENTE D'UNIFORMES DU CND
│
├─ [PRINCIPAL] Vendre en ligne (parents)
│   ├─ Présenter le catalogue & fiches ........ F1  (ShopPage / ProductDetailPage)
│   ├─ Gérer panier & commande ................ F2  (CartPage / POST /api/orders)
│   └─ Encaisser le paiement (SumUp) .......... F3  (/api/sumup + webhook)
│
├─ [PRINCIPAL] Administrer (école)
│   ├─ Gérer produits & stock par taille ...... F4/F5 (product_inventory / admin)
│   └─ Suivre & traiter les commandes ......... F10  (orders.status)
│
├─ [PRINCIPAL] Alerter la secrétaire
│   └─ Notifier + marquer collectée (Telegram)  F6  (routes/telegram.js)
│
├─ (SECONDAIRE) Gérer les comptes
│   ├─ Compte parent & auth ................... F7  (routes/auth, JWT)
│   ├─ Upload d'images produit ................ F8  (routes/upload, multer)
│   └─ Filtrer le catalogue ................... F9  (ShopPage)
│
└─ (COMPLÉMENTAIRE) Cadre & robustesse
    ├─ Pages légales & info (RGPD) ............ F11 (CGV / Politique / Info)
    ├─ Mode hors-ligne ........................ F12 (OfflinePage)
    ├─ Accessibilité RGAA AA (transverse) ..... F13
    └─ Emails transactionnels ................. F14 (nodemailer)
```

→ à transformer en visuel Canva (arborescence FAST horizontale, code couleur par priorité).

## 3. Estimation de la charge de travail

**Méthode.** Estimation **par analogie sur le socle existant** : le code couvre déjà la majorité des fonctions, la mission consiste surtout à **fiabiliser, sécuriser, accessibiliser, tester et finaliser**. Le découpage en lots reprend l'ordre de réalisation prévu (été 2026).

| Lot | Description | Fonctions | Charge (J-H) |
|---|---|---|---|
| **Lot 1** | Setup, CI (lint + `npm audit` + tests), **nettoyage dette** (retrait `stripe`, secrets en env, suppression des seeds/compte par défaut) | infra / sécurité | **3** |
| **Lot 2** | Catalogue, fiches, filtres — fiabilisation | F1, F9 | **3** |
| **Lot 3** | Panier, commande, cycle de statut | F2, F10 | **3** |
| **Lot 4** | Paiement SumUp : sécurisation du webhook (signature), gestion des échecs, **décrément de stock atomique** | F3 | **4** |
| **Lot 5** | Stock par taille + back-office admin (produits, commandes) | F4, F5 | **4** |
| **Lot 6** | Notification Telegram : fiabilisation + repli email | F6 | **2** |
| **Lot 7** | Compte parent / auth **durci** + emails transactionnels | F7, F14 | **3** |
| **Lot 8** | **Accessibilité RGAA AA** + audit `axe-core` + tests clavier/lecteur d'écran | F13 | **4** |
| **Lot 9** | Pages légales & RGPD (registre, effacement) + mode hors-ligne | F11, F12 | **2** |
| **Lot 10** | Tests (Vitest/supertest), recette, documentation, accompagnement de la secrétaire | transverse | **4** |
| | **Sous-total réalisation** | | **32** |
| | **Provision aléas (15 %)** | | **5** |
| | **TOTAL** | | **≈ 37 J-H** |

**Facteurs de variation** : la **sécurisation fine du paiement** (lot 4, cas d'échec/remboursement SumUp) et la **profondeur de la recette accessibilité** (lot 8) sont les deux postes les plus incertains ; la provision de 15 % les absorbe.

## 4. Estimation des coûts

**Cadre.** La réalisation est **bénévole** (`00` §5) : **aucun honoraire n'est facturé**. J'établis néanmoins un **chiffrage indicatif** pour *valoriser* la prestation et satisfaire l'exigence de macro-chiffrage du cadrage.

**Hypothèse de TJM** : profil développeur junior/medior en micro-entreprise (franchise en base de TVA, art. 293 B du CGI → HT = TTC). **TJM indicatif retenu : 300 € HT**.

| Poste | Détail | Montant indicatif |
|---|---|---|
| Réalisation (lots 1 à 10) | 32 J-H × 300 € | 9 600 € |
| Provision aléas (15 %) | 5 J-H × 300 € | 1 500 € |
| **Valorisation de la prestation** | **37 J-H × 300 €** | **11 100 € HT** *(non facturé — bénévole)* |

**Coûts réels d'exploitation** (seuls coûts effectivement engagés) :

| Poste | Détail | Coût |
|---|---|---|
| Nom de domaine | `app-all.fr` (OVH) | 13 € / 3 ans |
| Hébergement | VM perso actuelle (0 €) → cible VPS dédié recommandée | ~0 à ~5 €/mois |
| Commissions SumUp | par transaction en ligne `[À CONFIRMER : taux SumUp online]` | % du panier |
| API Telegram | bot gratuit | 0 € |

## 5. Budget prévisionnel

| Récapitulatif | Montant |
|---|---|
| Valorisation de la prestation (HT, **non facturée**) | 11 100 € |
| TVA | non applicable (franchise — art. 293 B du CGI) |
| **Coût réel pour l'école — investissement initial** | **≈ 13 € (domaine)** |
| **Coût réel récurrent** | hébergement (~0-60 €/an) + commissions SumUp par vente |

La valeur livrée (≈ 11 100 € au prix du marché) est **offerte** à l'établissement ; le coût réel se limite au **domaine** et à des **frais récurrents marginaux**, en cohérence avec l'exigence de « coût quasi nul ». Le périmètre **complet** (F1 à F14) est tenu sans arbitrage à la baisse, le socle existant rendant l'effort soutenable en bénévolat.

---

*Fin du livrable 04. Suite : `05_architecture_preconisations.md`.*
