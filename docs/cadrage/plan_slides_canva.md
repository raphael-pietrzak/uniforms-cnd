# Plan de slides — Soutenance orale BC01

> **Cadrer un projet de développement** — Cours Notre-Dame, boutique d'uniformes.
> Rendu du support : **10 juin 2026** · Oral : **11 juin 2026** · Certification **RNCP39583** (Expert en développement logiciel).
> Jury : 2 professionnels externes. Objectif : présenter le cadrage et **obtenir l'adhésion** (C1.6). Durée cible ≈ 15-20 min + questions.

## Principes de conception (Canva)

- **Une idée par slide**, titre porteur de sens, peu de texte, un visuel par slide.
- **Charte** : logo CND, bleu marine dominant, sobre (cohérent avec une école).
- Reprendre les **schémas** des livrables (matrice Mendelow, cercles concentriques, SWOT, FAST, architecture) en visuels Canva.
- Chaque slide « éliminatoire » couvre une compétence — repère `[Cx.x]` indiqué pour ne rien oublier (à **retirer** du support final).

## Déroulé des slides

| # | Slide | Contenu clé | Visuel | Compétence |
|---|---|---|---|---|
| 1 | **Titre** | Projet « Boutique d'uniformes du Cours Notre-Dame », nom, date, RNCP39583 — BC01 | Logo CND + photo uniformes | — |
| 2 | **Le client** | École primaire+collège privée hors contrat (Montpellier), 61 enfants / 31 familles, mission **bénévole** | Carte + chiffres clés | Contexte |
| 3 | **Le problème** | Tableur partagé : annonces oubliées, école intermédiaire débordée, stock/encaissement manuels | 3 icônes douleurs | C1.1.2 |
| 4 | **Parties prenantes** | Tableau classifié interne/externe + **matrice influence × intérêt** (Mendelow) | Matrice 2×2 | **C1.1.1** |
| 5 | **Utilisateurs (personas)** | Parent régulier, parent nouvel arrivant, secrétaire, directrice + angle accessibilité | 4 cartes persona | C1.1.1 |
| 6 | **Analyse de la demande** | Reformulation du besoin en 3 phrases (boutique gérée par l'école, SumUp, retrait, Telegram) | Bloc citation | **C1.1.2** |
| 7 | **Objectifs & enjeux** | Par partie prenante : décharge, fluidité, encaissement, coût maîtrisé | Tableau synthétique | C1.1.2 |
| 8 | **Opportunités & menaces** | SWOT condensé + impact environnemental (sobriété) | Matrice SWOT | **C1.2.1** |
| 9 | **Audit de l'existant** | 3 axes (besoin / tableur / socle technique) + constats | Frise 3 axes | **C1.2.2** |
| 10 | **Diagnostic infrastructures** | Hébergement perso fragile, domaine, SumUp, base, sauvegardes | Schéma infra | C1.2.2 |
| 11 | **Risques & indicateurs** | Top risques cotés P×I (R02 hébergement 16, R08 sauvegardes 15…) + indicateurs de contrôle | Carte de chaleur risques | **C1.2.3** |
| 12 | **Veille** | Méthodo (sources/outils Feedly+GitHub) + 5 trouvailles (SumUp, PCI SAQ-A, RGAA, CNIL, coût SaaS) | Logos sources | **C1.3.1** |
| 13 | **Étude comparative** | 4 solutions × 8 critères pondérés → **sur-mesure 158/165** | Tableau scoring | **C1.3.2** |
| 14 | **Périmètre fonctionnel** | Diagramme **FAST** (F1-F14) + 2-3 user stories INVEST | Arborescence FAST | **C1.4.1** |
| 15 | **Charge & budget** | ~37 J-H ; valorisation ≈ 11 100 € **offerte** ; coût réel ≈ 13 € + récurrents marginaux | Camembert lots / chiffres | **C1.4.2** |
| 16 | **Architecture logicielle** | Schéma 3-tiers (SPA React / API Express / PostgreSQL) + SumUp/Telegram/Cloudflare | Schéma d'architecture | **C1.5** |
| 17 | **Sécurité & conformité** | OWASP (paiement délégué, JWT durci), RGPD (données parents, aucune donnée enfant) | Cadenas + tableau OWASP | C1.5 |
| 18 | **Préconisations & décision** | Go recommandé ; traitement des objections (dépendance, panne, coût, RGPD) ; demande de validation | Checklist + appel à l'action | **C1.6** |
| 19 | **Démonstration** | Capture(s) du socle existant (boutique, back-office, notif Telegram) pour rendre tangible | Captures d'écran réelles | C1.6 |
| 20 | **Conclusion / Merci** | Récap problématique → solution → bénéfices ; ouverture (réplicabilité autres écoles) | Visuel de clôture | — |

## Conseils de présentation

- **Ouvrir par le problème humain** (la secrétaire débordée, les parents perdus), pas par la technique : capter le jury.
- **Montrer du tangible tôt** : une capture du socle existant (slide 19 peut être avancée) prouve la faisabilité.
- **Vulgariser** (C1.6) : « SumUp gère le paiement, donc aucune carte ne passe par notre site » plutôt que « PCI-DSS SAQ-A ».
- **Assumer les points durs** : dire franchement que l'hébergement et les sauvegardes sont les vrais risques, et montrer les mitigations — un jury valorise la lucidité.
- **Terminer sur la demande de go** (C1.6) : une slide claire « Ce que je recommande / Ce que je demande ».
- **Préparer les questions probables** : pérennité (bus factor), RGPD, sécurité du paiement, coût récurrent, accessibilité.

## Points encore à confirmer avant le 10 juin

- Compléter les `[À CONFIRMER]` restants du `00_scenario.md` (répartition références/pièces, taux de commission SumUp, durée de conservation RGPD, sous-domaine éventuel).
- Préparer **2-3 captures d'écran** réelles du socle (boutique, back-office admin, message Telegram) pour la démonstration.
- Vérifier l'autorisation d'utiliser le **nom et le logo réels** de l'école dans le support de soutenance.
