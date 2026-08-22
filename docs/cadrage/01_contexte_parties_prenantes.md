# 01 — Contexte et parties prenantes

> Phase de cadrage BC01 — Cours Notre-Dame (Montpellier). Mission **réelle**. Tous les faits proviennent de `00_scenario.md` (source de vérité). Les dates et noms réels sont utilisés avec l'accord de l'établissement ; les éléments non confirmés portent la mention `[À CONFIRMER]`.

## 1. Cartographie des parties prenantes

[C1.1.1 — ÉLIMINATOIRE]

J'identifie ici l'ensemble des acteurs qui ont un pouvoir de décision, une utilisation directe ou une influence indirecte sur le projet de boutique d'uniformes. Je distingue les acteurs **internes** (établissement, utilisateurs) des acteurs **externes** (fournisseurs de services, tutelle, régulateur). Le niveau d'implication est évalué sur trois paliers (haut / moyen / faible), à partir des échanges de cadrage conduits avec la direction.

### 1.1 Tableau classifié

| Acteur | Catégorie | Rôle dans le projet | Implication | Attentes principales |
|---|---|---|---|---|
| **Isabelle Marié** (directrice) | Interne — gouvernance | **Commanditaire** : décide du go/no-go, valide le périmètre et la mise en service | Haute | Décharger l'école, image sérieuse vis-à-vis des familles, coûts maîtrisés, autonomie de l'outil |
| **Ghyslaine de Gouttes** (secrétaire) | Interne — gouvernance + utilisatrice clé | **Administratrice quotidienne** : détient le stock, saisit le catalogue, prépare et remet les commandes | Haute | Recevoir les commandes sans friction, suivre le stock **par taille**, être prévenue immédiatement (Telegram) |
| **Parents d'élèves** (31 familles, 61 enfants) | Interne — utilisateurs finaux | Consultent, commandent, paient en ligne, retirent à l'école | Moyenne (collective) | Voir les uniformes attendus, acheter **neuf ou occasion** à moindre coût, payer en ligne, retrait simple |
| **Moi, développeur (bénévole)** | Externe — prestataire | Producteur du cadrage et de la réalisation ; candidat à la certification RNCP39583 | Haute | Cadrage clair, périmètre tenable, base saine, valorisation pédagogique |
| **ICRSP** (organisme gestionnaire) | Externe — tutelle | Cadre institutionnel et image de l'établissement | Moyenne | Cohérence avec l'image de l'institut, sobriété, conformité |
| **SumUp** | Externe — fournisseur de paiement | Encaissement en ligne sous le compte existant de l'école | Faible (mais critique en disponibilité) | Respect des CGU et de l'API, conformité PCI-DSS déléguée au prestataire de paiement |
| **Telegram** (Bot API) | Externe — fournisseur de notification | Canal d'alerte temps réel vers la secrétaire | Faible | Respect de l'API ; dépendance à un service gratuit tiers |
| **OVH** (domaine) / **Cloudflare** (DNS, proxy) / **Dokploy** (déploiement) | Externe — fournisseurs d'infrastructure | Nom de domaine `app-all.fr`, exposition et orchestration de l'hébergement | Faible | Continuité de service ; contraintes de compatibilité |
| **Développeur tiers du site statique** | Externe — détenteur d'accès | Gère `coursnotredame.fr` et l'hébergement éventuel de l'école | Faible | **Peu réactif** : point de friction identifié pour une reprise d'hébergement côté école |
| **CNIL** (régulateur RGPD) | Externe — régulateur | Conformité du traitement des données des parents | Faible (mais contraignant) | Registre des traitements, base légale, droit à l'effacement |

### 1.2 Matrice influence × intérêt (Mendelow)

L'**influence** mesure la capacité d'un acteur à infléchir une décision projet ; l'**intérêt** mesure son exposition au résultat.

```
                  INTÉRÊT FAIBLE                        INTÉRÊT ÉLEVÉ
                ┌─────────────────────────────┬─────────────────────────────┐
                │  SATISFAIRE                 │  PILOTER EN PRIORITÉ        │
   INFLUENCE    │  (keep satisfied)           │  (manage closely)           │
   HAUTE        │  • ICRSP (tutelle)          │  • Isabelle Marié (dir.)    │
                │  • CNIL (régulateur)        │  • Moi (développeur)        │
                │  • SumUp (fournisseur)      │                             │
                ├─────────────────────────────┼─────────────────────────────┤
                │  SURVEILLER                 │  INFORMER                   │
   INFLUENCE    │  (monitor)                  │  (keep informed)            │
   BASSE        │  • Telegram                 │  • Ghyslaine de Gouttes     │
                │  • OVH / Cloudflare/Dokploy │  • Parents d'élèves         │
                │  • Dév. tiers site statique │                             │
                └─────────────────────────────┴─────────────────────────────┘
```

**Interprétation :**

- **Piloter en priorité (haut/haut)** : Isabelle Marié détient la décision (go/no-go, validation). Je m'y inclus car ma crédibilité et la certification sont engagées. Ce sont les deux acteurs à aligner avant toute mise en service.
- **Satisfaire (haut/faible)** : l'ICRSP n'est pas opérationnel mais porte l'image institutionnelle (sobriété attendue). La CNIL n'intervient pas au quotidien mais peut sanctionner un manquement RGPD. SumUp est un fournisseur captif : je dois respecter ses CGU sans solliciter d'engagement.
- **Informer (faible/haut)** : Ghyslaine de Gouttes est l'utilisatrice la plus exposée au résultat mais sans pouvoir d'arbitrage budgétaire ; son **adhésion conditionne l'adoption** — je l'implique en relectures fonctionnelles. Les parents sont informés via une communication de l'école.
- **Surveiller (faible/faible)** : Telegram, la chaîne OVH/Cloudflare/Dokploy et le développeur tiers du site statique sont des points de vigilance passifs, documentés sans action déclenchée.

### 1.3 Schéma textuel (→ visuel Canva)

```
                          ┌──────────────────────────────┐
                          │  BOUTIQUE UNIFORMES CND      │
                          │  (cœur — décisions cadrage)  │
                          └──────────────────────────────┘
                                       │
        ┌──────────────────────────────┼──────────────────────────────┐
   Cercle 1                      Cercle 2                      Cercle 3
   GOUVERNANCE                   PROCHES                       EXTERNES
   (décision + admin)            (usagers + prestataire)       (fournisseurs, tutelle, régulateur)
        │                              │                              │
   • Isabelle Marié               • Parents (31 familles)        • SumUp (paiement)
   • Ghyslaine de Gouttes         • Moi (développeur bénévole)   • Telegram (notification)
                                                                 • OVH / Cloudflare / Dokploy
                                                                 • ICRSP (tutelle)
                                                                 • CNIL (RGPD)
```

→ à transformer en visuel Canva (cercles concentriques, code couleur par catégorie).

## 2. Profils utilisateurs finaux

J'isole quatre personas représentatifs de la diversité d'usage. Les noms des deux personas « parents » sont fictifs mais ancrés dans le profil sociologique d'un établissement familial hors contrat ; la secrétaire et la directrice sont des personnes réelles.

### Persona 1 — Le parent acheteur régulier

- **Nom (fictif)** : Sophie Berton, 39 ans, deux enfants scolarisés au CND
- **Usage** : à chaque rentrée + remplacements en cours d'année (croissance des enfants, articles abîmés)
- **Compétences numériques** : bonnes — achète déjà en ligne (Vinte, marketplaces)
- **Besoins** : voir précisément les uniformes attendus, comparer **neuf vs occasion**, acheter pour deux enfants en une commande, payer en ligne, retirer à l'école
- **Frustrations actuelles** : tableur illisible, articles déjà vendus toujours affichés, allers-retours par mail avec le secrétariat
- **Cas d'usage cible** : « Filtrer par catégorie et taille, ajouter au panier pour deux enfants, payer via SumUp, recevoir une confirmation, venir retirer. »

### Persona 2 — Le parent nouvel arrivant

- **Nom (fictif)** : Karim Schmitt, 34 ans, premier enfant inscrit pour 2026-2027
- **Usage** : ponctuel, surtout avant la rentrée
- **Compétences numériques** : variables ; **public à inclure** au titre de l'accessibilité (lecture sur mobile, parents peu à l'aise avec le numérique, grands-parents acheteurs, situations de handicap visuel)
- **Besoins** : **comprendre quoi acheter** (la tenue attendue par niveau), sans connaître les codes de l'école
- **Frustrations actuelles** : aucune source claire ; il faut demander au secrétariat
- **Cas d'usage cible** : « Arriver sur la boutique, identifier la tenue obligatoire, constituer la garde-robe de rentrée en autonomie, y compris au lecteur d'écran. »
- **Exigence dérivée** : conformité **RGAA AA** sur les parcours publics (catalogue → fiche → panier → paiement).

### Persona 3 — La secrétaire administratrice (réelle)

- **Nom** : Ghyslaine de Gouttes (secrétaire)
- **Usage** : quasi quotidien en période scolaire
- **Compétences numériques** : intermédiaires — bureautique, pas de compétence technique
- **Besoins** : ajouter/éditer un article et son **stock par taille** en quelques minutes ; voir les commandes ; être **prévenue immédiatement** d'une nouvelle commande ; marquer une commande « collectée » d'un geste
- **Frustrations actuelles** : suivi des stocks au tableur laborieux, encaissement manuel séparé, sollicitations dispersées
- **Cas d'usage cible** : « Recevoir une notification Telegram à chaque commande, préparer les articles, marquer la commande collectée depuis le téléphone, sans ouvrir l'ordinateur. »

### Persona 4 — La directrice décideuse (réelle)

- **Nom** : Isabelle Marié (directrice)
- **Usage** : occasionnel (supervision)
- **Besoins** : une solution qui **fonctionne sans la solliciter**, renvoie une image sérieuse aux familles, et n'engage pas de coûts non maîtrisés
- **Critère de succès vu d'elle** : moins de charge pour le secrétariat, zéro incident d'image, coût quasi nul.

## 3. Analyse de la demande

[C1.1.2 — ÉLIMINATOIRE]

### 3.1 Recueil et explicitation du besoin

- **Cadre** : le besoin a été recueilli lors d'**échanges informels** avec la direction, au moment où j'ai proposé mon aide en développement à l'établissement (pas d'entretien formel programmé). Je restitue ci-dessous une **explicitation structurée** de ce besoin, destinée à être présentée et validée avec l'école.
- **Interlocutrices** : Isabelle Marié (directrice) et Ghyslaine de Gouttes (secrétaire)
- **Méthode** : reformulation des irritants du processus actuel (tableur partagé), identification des attentes et des contraintes, validation croisée avec la direction

**Constats exprimés.** L'école gère aujourd'hui la vente et l'échange d'uniformes via un **tableur partagé** alimenté à la fois par les parents et par l'école. Le dispositif s'est essoufflé : des annonces de parents restent en ligne alors que l'article est déjà parti, l'école se retrouve **intermédiaire de mises en relation** qu'elle n'a pas le temps d'assurer, et le **suivi du stock par taille** comme la **réception des commandes** sont laborieux. L'encaissement, fait à part, ajoute une étape manuelle.

**Attentes principales.** La direction souhaite, dans cet ordre : (1) **reprendre la main** — que l'école centralise un catalogue propre (neuf et occasion) plutôt que de modérer des annonces ; (2) **fluidifier l'exploitation** — recevoir les commandes et suivre les stocks sans friction, avec une **alerte immédiate** de la secrétaire ; (3) **encaisser en ligne** via l'outil déjà en place (**SumUp**), sans nouveau compte ni nouvelle complexité ; (4) **maîtriser les coûts** (réalisation bénévole, frais récurrents minimes).

**Contraintes posées.** Retrait **à l'école** uniquement (stock chez la secrétaire), pas de logistique de livraison. Paiement **SumUp** imposé (déjà utilisé en TPE). Notification de la secrétaire par un canal qu'elle consulte (**Telegram**, sur smartphone). Aucune donnée d'enfant collectée. Mise en service visée avant la **rentrée 2026**.

**Points d'attention.** (i) **Adoption** : l'outil doit être plus simple que le tableur pour la secrétaire, sinon retour aux vieilles habitudes ; (ii) **dépendance au prestataire** (bénévole unique) et à un **hébergement personnel** actuel, à clarifier pour la pérennité ; (iii) **image** : un site sérieux et accessible valorise l'établissement auprès des familles.

### 3.2 Reformulation du besoin

> Je vous propose une **boutique en ligne d'uniformes gérée par l'école** : un catalogue **neuf et d'occasion** avec photos et tailles, où chaque parent commande et **paie en ligne via SumUp**, puis **retire à l'école**.
>
> Côté école, un **espace d'administration** simple permet à la secrétaire de gérer les articles, le **stock par taille** et les commandes, et la prévient **immédiatement par Telegram** à chaque nouvelle commande, qu'elle peut marquer « préparée / collectée » depuis son téléphone.
>
> La solution est **accessible (RGAA AA)**, **conforme RGPD** (données de parents uniquement), à **coût quasi nul**, et vise une mise en service avant la **rentrée de septembre 2026**.

## 4. Objectifs et enjeux par partie prenante

| Partie prenante | Objectifs | Enjeux | Critère de succès vu d'elle |
|---|---|---|---|
| **École (collectif direction + secrétariat)** | Reprendre la main sur la vente d'uniformes ; fluidifier commandes et stocks ; encaisser en ligne | Charge du secrétariat ; image vis-à-vis des familles ; maîtrise des coûts | Outil adopté, moins de sollicitations, mise en service avant la rentrée 2026 |
| **Isabelle Marié (directrice)** | Décharger l'école sans coût non maîtrisé | Décisionnel, image, budget | Solution autonome, sérieuse, quasi gratuite |
| **Ghyslaine de Gouttes (secrétaire)** | Sortir du tableur ; suivre le stock par taille ; être alertée en temps réel | Opérationnel quotidien | Saisie d'un article < 3 min ; notification Telegram fiable ; geste « collectée » en 1 clic |
| **Parents (31 familles)** | Voir les uniformes attendus ; acheter neuf/occasion ; payer en ligne ; retirer simplement | Coût pour les familles, simplicité | Commande de bout en bout sans appeler l'école |
| **Parent en situation de fragilité numérique / handicap** | Consulter et commander en autonomie | Inclusion | Parcours principal navigable au clavier / lecteur d'écran (RGAA AA) |
| **Moi (développeur bénévole)** | Livrer un cadrage rigoureux puis un logiciel fiable | Référence, certification RNCP39583 | Validation du cadrage + logiciel en service |
| **ICRSP (tutelle)** | Cohérence d'image, sobriété, conformité | Institutionnel | Site sérieux et conforme, sans dérapage |

## 5. Problématique reformulée et pistes de solutions

**Problématique** : *comment doter le Cours Notre-Dame d'une **boutique en ligne d'uniformes (neuf + occasion) gérée par l'école**, intégrée au compte **SumUp** existant, avec **retrait sur place** et **notification temps réel** de la secrétaire, **accessible (RGAA AA)** et **conforme RGPD**, **maintenable** et à **coût quasi nul**, déployable avant la **rentrée de septembre 2026** ?*

**Pistes de solutions à instruire en veille technique** (arbitrage dans `03_veille_etude_technique.md`) :

1. **Plateforme e-commerce SaaS clé en main** (Shopify, Wix Commerce). Avantage : mise en service rapide. Risques : **abonnement mensuel** récurrent contraire au « coût quasi nul », intégration **SumUp** non native, **notification Telegram** sur-mesure difficile, personnalisation et accessibilité bridées.

2. **CMS e-commerce auto-hébergé** (WooCommerce/WordPress, PrestaShop). Avantage : gratuit en licence, riche. Risques : **surdimensionné** pour 31 familles / ~100 articles, maintenance de plugins et de failles, intégrations SumUp + Telegram à brancher quand même, accessibilité des thèmes inégale.

3. **Statu quo amélioré** (Google Forms + Sheets structuré). Avantage : gratuit, immédiat. Risques : ne règle **ni le stock par taille, ni le paiement en ligne, ni la notification** ; reproduit les douleurs actuelles.

4. **Application web sur-mesure** (React + TypeScript / Node + Express, SQLite→PostgreSQL). Avantage : **intégration native SumUp + Telegram**, **accessibilité maîtrisée** (composants ARIA), **coût d'exploitation minime**, périmètre exactement calibré, **socle déjà développé** (cf. `00` §7). Risques : charge de développement et **bus factor** d'un développeur unique — traités en `02`.

L'arbitrage entre ces pistes est conduit dans `03_veille_etude_technique.md`. Le présent document fige le contexte, les acteurs et la problématique.

---

*Fin du livrable 01. Suite : `02_opportunites_risques.md`.*
