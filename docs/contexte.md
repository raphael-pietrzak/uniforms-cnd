# Contexte du projet — CND-Uniformes

**Site e-commerce de vente d'uniformes scolaires (neuf et occasion) pour le Cours Notre-Dame, géré par l'école, avec retrait sur place.**

## Le client

Cours Notre-Dame (CND) — école primaire + collège privée hors contrat (ICRSP), Montpellier.
61 enfants, 31 familles (2025-2026).
Contacts : **Isabelle Marié** (directrice), **Ghyslaine de Gouttes** (secrétaire).

## Le problème

Aujourd'hui, parents et école déposent des annonces sur un tableur partagé. Les annonces restent en ligne après vente, l'école sert d'intermédiaire débordé, et le suivi des stocks comme l'encaissement se font à la main.

## La solution

- Boutique en ligne **gérée par l'école** : catalogue neuf + occasion, panier, compte parent.
- Paiement en ligne via **SumUp** (compte de l'école déjà existant).
- **Retrait à l'école** (stock chez la secrétaire).
- **Notification Telegram** à la secrétaire à chaque commande, avec boutons *collectée / annuler*.
- Back-office admin pour produits, stock **par taille**, et commandes.

## Stack

React + TypeScript / Express + Knex (SQLite dev, PostgreSQL prod), JWT, Docker, Cloudflare, domaine `app-all.fr`.

## Statut

Socle applicatif déjà construit. Réalisation **bénévole**. Mise en service visée pour la **rentrée 2026**.
