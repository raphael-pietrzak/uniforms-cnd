# 00 — Scénario : Cours Notre-Dame — Site de vente d'uniformes

> **Source de vérité du contexte.** Mission **réelle** menée pour le Cours Notre-Dame (Montpellier). Tout chiffre, nom ou rôle utilisé dans les fichiers 01 à 05 doit provenir d'ici ou y être rétro-ajouté.
> Les éléments non encore confirmés par le client sont marqués **`[À CONFIRMER]`** : à valider avec la directrice / la secrétaire avant le rendu du 10 juin 2026.

## 1. Fiche identité de l'établissement

- **Nom** : Cours Notre-Dame (ci-après « CND »)
- **Organisme gestionnaire** : ICRSP — Institut du Christ Roi Souverain Prêtre (domaine de messagerie `@icrsp.org`) `[À CONFIRMER : intitulé exact / lien juridique]`
- **Statut** : établissement scolaire **privé hors contrat**, confessionnel catholique
- **Niveaux scolaires** : primaire + collège
- **Effectif** : **61 enfants** scolarisés en 2025-2026, répartis sur **31 familles** (une famille scolarisant souvent plusieurs enfants) — petite structure
- **Adresse** : 334 rue du Pioch de Boutonnet, 34090 Montpellier
- **Contact secrétariat** : `cnd.secretariat@icrsp.org` — horaires : lundi-vendredi 8h30-16h30, fermé le week-end et pendant les vacances scolaires
- **Présence en ligne actuelle** : **site statique de présentation** de l'école — <https://www.coursnotredame.fr/> (maintenu par un développeur tiers peu réactif)
- **Compte d'encaissement existant** : **SumUp**, utilisé aujourd'hui via des **terminaux de paiement physiques** (TPE) ; le projet ajoutera l'encaissement **en ligne** sous le même compte SumUp

## 2. Composition des parties prenantes internes

| Rôle | Personne | Lien au projet | Disponibilité | Attentes clés |
|---|---|---|---|---|
| **Directrice** | **Isabelle Marié** | **Commanditaire** — décide du go/no-go, valide le périmètre et la mise en service | En période scolaire | Décharger l'école, image sérieuse vis-à-vis des familles, maîtrise des coûts, simplicité |
| **Secrétaire** | **Ghyslaine de Gouttes** | **Utilisatrice clé** — détient physiquement le stock, prépare et remet les commandes, gère le catalogue au quotidien | Journée, en période scolaire | Recevoir les commandes sans friction, suivre le stock par taille, être prévenue immédiatement (Telegram) |
| **Parents d'élèves** | **31 familles** (61 enfants) | **Utilisateurs finaux acheteurs** — consultent, commandent et paient en ligne, retirent à l'école | Variable | Voir ce que l'école attend comme uniformes, acheter neuf **ou** occasion à moindre coût, payer en ligne, retrait simple |
| **Moi (étudiant/développeur)** | — | **Prestataire** — cadrage + réalisation, à titre **bénévole** | — | Cadrage clair, périmètre tenable, base saine pour la réalisation, valorisation pédagogique (certification RNCP39583) |

> **Entrée en relation** : j'ai **proposé spontanément mon aide en développement** à l'établissement pour soutenir son organisation. Je dispose des contacts directs de la **directrice** (Isabelle Marié) et de la **secrétaire** (Ghyslaine de Gouttes), qui constituent mes deux interlocutrices de cadrage.

## 3. Existant et douleurs constatées

**Outil actuel** : un **fichier tableur partagé** (type Excel / Google Sheets) sur lequel **les parents déposent eux-mêmes des annonces** d'uniformes (principalement d'occasion) **et l'école dépose aussi** des articles. Le tableur sert à la fois de catalogue et de petites annonces entre familles.

**Douleurs identifiées** (entretien préliminaire avec l'école) :

1. **Annonces obsolètes** : les parents qui ont posté un article **oublient qu'ils l'ont mis en ligne** ; des articles déjà vendus ou donnés restent listés, ce qui crée des sollicitations inutiles.
2. **L'école en position d'intermédiaire** : la mise en relation parent ↔ parent transite souvent par l'école, qui **a déjà beaucoup à gérer** ; la communication n'est pas fluide.
3. **Suivi des commandes et des stocks peu fluide** : recevoir les commandes et tenir les quantités **par taille** via un tableur est laborieux et source d'erreurs ; pas de vue claire de ce qui reste.
4. **Pas de paiement intégré** : l'encaissement se fait à part, manuellement.
5. `[À CONFIRMER : autres douleurs — doublons, litiges sur l'état des articles, tailles erronées… ]`

**Reformulation de l'intention de l'école** : passer d'un tableur d'annonces semi-collaboratif et désordonné à **une boutique en ligne où l'école centralise et maîtrise tout** (catalogue, stock, commandes, encaissement), les parents se contentant d'acheter.

## 4. Catalogue type (uniformes)

Le catalogue mêle **articles neufs et d'occasion**. Familles d'articles attendues `[À CONFIRMER : liste réelle CND]` :

| Article | Exemple | Neuf / Occasion | Tailles |
|---|---|---|---|
| Polo / chemise avec logo école | Polo brodé logo CND | les deux | lettres (XS-XL) `[À CONFIRMER]` |
| Pull / cardigan | Cardigan bleu marine logo école | les deux | lettres et/ou âges |
| Bas (jupe plissée / pantalon) | Jupe plissée, pantalon chino bleu marine | les deux | lettres et/ou âges |
| Blazer | Blazer formel avec écusson (événements) | les deux | lettres |
| Tenue d'EPS | T-shirt + short de sport logo école | plutôt neuf | lettres |

- **Volumétrie** : **une centaine d'articles** au catalogue (neuf + occasion confondus) `[À CONFIRMER : répartition références / pièces en stock]`
- **Particularité « tailles »** : les tailles sont **hétérogènes** selon les marques — lettres (S, M, L…) **et** âges (« 10 ans », « 12 ans », « 12-13 ans »). Le modèle de données traite la taille comme une **chaîne libre par référence**, avec un **stock par couple (article, taille)**.
- **Couleur dominante** : bleu marine `[À CONFIRMER]`.

## 5. Contexte de la mission

- **Positionnement** : j'interviens comme **développeur réalisant le projet à titre bénévole** pour le CND. Un **chiffrage de la prestation est néanmoins établi** (cf. `04`) à titre de **valorisation** — il représente ce que coûterait la prestation au prix du marché, sans être facturé.
- **Phases** : cadrage (BC01) → réalisation (un socle technique existe déjà, cf. §7) → mise en service.
- **Calendrier projet visé** :
  - Cadrage et validation du périmètre : **mai-juin 2026**
  - Réalisation / fiabilisation : **été 2026**
  - **Mise en service souhaitée : rentrée de septembre 2026**, pour la saison 2026-2027

## 6. Périmètre annoncé et contraintes

**Périmètre fonctionnel cible (MVP) :**

- **Boutique en ligne gérée par l'école** : catalogue neuf + occasion avec photos, fiches, filtres ; **panier** ; **compte parent** ; **paiement en ligne** ; **retrait à l'école**.
- **Back-office administrateur** (école/secrétaire) : gestion des produits, du **stock par taille**, et des **commandes** (cycle `pending → paid → ready → collected`).
- **Notification Telegram** à la secrétaire : alerte « nouvelle commande à préparer / à remettre », avec **boutons** « marquer collectée / annuler ».

**Hors périmètre du MVP (évolutions futures possibles) :**

- **Mise en vente directe par les parents** (consignation / dépôt-vente géré par chaque famille) — c'est précisément le désordre que le projet supprime.
- **Livraison postale** : le modèle est **retrait à l'école** uniquement.

**Contraintes posées :**

- **Paiement** : **SumUp**, déjà utilisé par l'école → pas de nouveau compte marchand, **encaissements centralisés** et rapprochement simplifié. *(Le `stripe` présent dans les dépendances du socle est un résidu à retirer.)*
- **Retrait** : à l'école, **stock détenu par la secrétaire** → aucune logistique de livraison à gérer.
- **Notification** : **Telegram** vers la secrétaire (bot + actions inline).
- **RGPD** : seules des **données de parents (adultes)** sont traitées — nom, email, historique de commande. **Aucune donnée d'enfant** n'est collectée. Registre des traitements simplifié + droit à l'effacement (cf. `02`/`05`).
- **Accessibilité** : cible **RGAA AA** sur les parcours publics principaux (catalogue, fiche produit, panier, paiement).
- **Hébergement actuel** : **auto-hébergé** par le développeur — VM Ubuntu (poste personnel) orchestrée avec **Dokploy**, exposée via **Cloudflare**, nom de domaine **`app-all.fr`** (OVH, 13 € / 3 ans). **Reprise envisagée par l'école** sur son propre hébergement en cas de validation (le CND dispose vraisemblablement d'un hébergement pour son site statique, mais le développeur qui le gère est peu réactif).
- **Budget** : réalisation **bénévole**. Seul coût réel engagé à ce jour : le **nom de domaine `app-all.fr`** (13 € / 3 ans, OVH). Les frais récurrents (hébergement, domaine, commissions SumUp) seraient **repris par l'école** en cas de validation. Un chiffrage indicatif de la prestation est néanmoins produit pour la valorisation (cf. `04`).
- **Délai** : mise en service avant la **rentrée de septembre 2026**.

## 7. Infrastructure et socle technique existants

- **Socle applicatif déjà développé** (dépôt `CND-Uniformes`) :
  - **Frontend** : React 18 + TypeScript, Vite 5, React Router 6, Tailwind 3, lucide-react. Pages publiques (accueil, boutique, fiche produit, panier, checkout, compte/login/register, mot de passe oublié, CGV, politique de confidentialité, page hors-ligne) et **espace admin** (dashboard, produits, commandes).
  - **Backend** : Node.js + Express 4, **Knex** (SQLite en développement, PostgreSQL en production), **authentification JWT** (access 15 min + refresh 7 j, cookies `httpOnly`/`secure`/`sameSite=strict`, bcrypt, rôles `user`/`admin`), **upload d'images** (multer), **paiement SumUp** (route + webhook), **notifications Telegram** (bot + webhook callback).
  - **Modèle de données** : `products`, `product_inventory` (stock unique par couple produit/taille), `orders`, `order_items`, `temp_orders` (tunnel de paiement), `users`, `refresh_tokens`.
  - **Industrialisation** : Docker + docker-compose, nginx (prod), configurations Vercel, devcontainer, migrations & seeds Knex. **Déploiement actuel auto-hébergé** : VM Ubuntu + **Dokploy** + **Cloudflare** (domaine `app-all.fr`).
- **Historique notable** : migration **WhatsApp → Telegram** pour les notifications (colonnes `whatsapp_message_id` → `telegram_message_id`) — à valoriser dans le suivi des versions (BC04).
- **Côté établissement** : compte **SumUp** existant ; poste du secrétariat ; **smartphone de la secrétaire** pour recevoir les notifications Telegram.

---

*Fin du scénario (00). Les livrables 01 à 05 s'appuient exclusivement sur les faits ci-dessus.*
